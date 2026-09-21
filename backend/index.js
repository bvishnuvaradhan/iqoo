require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const { initDb } = require('./database');
const { seed } = require('./seed');

const { analyzeImage } = require('./services/perceptionService');
const { searchContext } = require('./services/contextService');
const { verifyContext } = require('./services/verificationService');
const { generateRecommendations } = require('./services/recommendationService');
const { init: initSync, broadcastUpdate, resetSessions } = require('./services/deviceSyncService');
const { processTelegramData } = require('./services/telegramService');

const Student = require('./models/Student');
const Subject = require('./models/Subject');
const Topic = require('./models/Topic');
const Material = require('./models/Material');
const UpcomingItem = require('./models/UpcomingItem');
const Capture = require('./models/Capture');
const Recommendation = require('./models/Recommendation');
const Project = require('./models/Project');
const ProjectTask = require('./models/ProjectTask');

const app = express();
const server = http.createServer(app);
initSync(server);

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"] : "*";
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const uploadImage = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadJson = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    groq: process.env.GROQ_API_KEY ? "configured" : "missing_key_demo_fallback_active"
  });
});

app.post('/api/capture/analyze', uploadImage.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  try {
    const { mode, perception } = await analyzeImage(req.file.buffer, req.file.mimetype);
    const query = perception.raw_text || perception.topic_hint || 'Unknown'; 
    const contextMatches = await searchContext(query, 'stu_1');
    const verificationResult = verifyContext(perception, contextMatches);

    const duration = Date.now() - startTime;
    res.json({
      mode,
      perception: {
        raw_text: perception.raw_text,
        confidence: perception.confidence,
        target_date: perception.target_date || null,
        itemType: perception.target_item || null
      },
      context_match: verificationResult.match ? {
        subject: verificationResult.match.subject,
        topic: verificationResult.match.topic,
        module: verificationResult.match.module || null,
        itemId: verificationResult.match.itemId || null,
        itemType: verificationResult.match.itemType || null
      } : null,
      verification: {
        verified: verificationResult.verified,
        state: verificationResult.verificationState,
        confidence: verificationResult.confidence,
        reason: verificationResult.reason,
        changes: verificationResult.changes || null,
        evidence: verificationResult.evidence || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to process image. " + err.message });
  }
});

app.post('/api/telegram/import', uploadJson.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No JSON file provided." });

  try {
    const jsonStr = req.file.buffer.toString('utf-8');
    const parsedData = JSON.parse(jsonStr);
    
    const telegramResult = await processTelegramData(parsedData);
    
    const categorizedItems = {
      newItems: [],
      updates: [],
      conflicts: [],
      duplicates: [],
      uncertain: []
    };
    
    for (const item of telegramResult.extractedItems) {
      const perceptionProxy = {
        confidence: item.confidence,
        raw_text: item.activity,
        type: item.type,
        target_date: item.deadline,
        target_item: item.activity,
        action_hint: item.action
      };
      
      const contextMatches = await searchContext(item.activity, 'stu_1');
      const verificationResult = verifyContext(perceptionProxy, contextMatches);
      
      const enrichedItem = {
        ...item,
        verification: verificationResult
      };
      
      if (verificationResult.verificationState === 'NEW') categorizedItems.newItems.push(enrichedItem);
      else if (verificationResult.verificationState === 'DUPLICATE') categorizedItems.duplicates.push(enrichedItem);
      else if (verificationResult.verificationState === 'UPDATE') categorizedItems.updates.push(enrichedItem);
      else if (verificationResult.verificationState === 'CONFLICT') categorizedItems.conflicts.push(enrichedItem);
      else categorizedItems.uncertain.push(enrichedItem);
    }
    
    res.json({
      scannedCount: telegramResult.scannedCount,
      relevantCount: telegramResult.relevantCount,
      categorizedItems
    });
    
  } catch (err) {
    res.status(500).json({ error: "Failed to process Telegram file. " + err.message });
  }
});

app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ error: "Student not found" });

    const subjects = await Subject.find({ student_id: studentId }).lean();
    
    for (const sub of subjects) {
      sub.topics = await Topic.find({ subject_id: sub._id }).lean();
      sub.materials = await Material.find({ subject_id: sub._id }).lean();
      sub.upcomingItems = await UpcomingItem.find({ subject_id: sub._id }).lean();
      // map _id to id for frontend compatibility
      sub.id = sub._id;
      sub.topics.forEach(t => t.id = t._id);
      sub.materials.forEach(m => m.id = m._id);
      sub.upcomingItems.forEach(u => u.id = u._id);
    }
    
    const projects = await Project.find({ student_id: studentId }).lean();
    for (const proj of projects) {
      proj.subjects = await Subject.find({ _id: { $in: proj.subjects } }).lean();
      proj.tasks = await ProjectTask.find({ project_id: proj._id }).lean();
      
      // Calculate progress and risk
      const totalTasks = proj.tasks.length;
      const completedTasks = proj.tasks.filter(t => t.status === 'Completed').length;
      proj.calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : proj.progress;
      
      const hasPendingHighPriority = proj.tasks.some(t => t.priority === 'high' && t.status === 'Pending');
      proj.status = hasPendingHighPriority ? 'AT RISK' : 'ON TRACK';
      proj.riskReason = hasPendingHighPriority ? "Critical tasks remain incomplete." : "Project is progressing on schedule.";
      
      // map _id to id
      proj.id = proj._id;
      proj.tasks.forEach(t => t.id = t._id);
      if(proj.members) proj.members.forEach(m => m.id = m._id);
    }
    
    student.id = student._id;

    res.json({ student, subjects, projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recommendations/:studentId', async (req, res) => {
  try {
    const recs = await generateRecommendations(req.params.studentId);
    res.json({
      studentId: req.params.studentId,
      generatedAt: new Date().toISOString(),
      recommendations: recs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/recommendations/recalculate', async (req, res) => {
  const { studentId = 'stu_1' } = req.body;
  try {
    const recs = await generateRecommendations(studentId);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/context/accept', async (req, res) => {
  const { studentId = 'stu_1', captureData, pairingCode } = req.body;
  
  try {
    if (captureData && captureData.isVerified) {
      if ((captureData.verificationState === 'UPDATE' || captureData.verificationState === 'CONFLICT') && captureData.changes) {
          for (const change of captureData.changes) {
            if (change.field === 'date' && captureData.itemId && captureData.itemType !== 'project') {
              await UpcomingItem.updateOne({ _id: captureData.itemId }, { date: change.new });
            } else if (captureData.itemType === 'project_task') {
              if (change.field === 'status') await ProjectTask.updateOne({ _id: captureData.itemId }, { status: change.new });
              if (change.field === 'assignee') await ProjectTask.updateOne({ _id: captureData.itemId }, { assignee: change.new });
            } else if (captureData.itemType === 'project' && change.field === 'deadline') {
              await Project.updateOne({ _id: captureData.itemId }, { deadline: change.new });
            }
          }
      } else if (captureData.verificationState === 'NEW') {
        if (captureData.itemType) {
          const id = `up_new_${Date.now()}`;
          await UpcomingItem.create({
            _id: id, subject_id: 'sub_os', title: captureData.topic || 'New Item', type: captureData.itemType, date: captureData.targetDate || 'TBD', priority: 'medium'
          });
        }
      } else if (captureData.verificationState === 'VERIFIED') {
        await Topic.updateMany({ name: captureData.subtopic || captureData.topic }, { status: 'completed' });
      }
    }

    const recs = await generateRecommendations(studentId);
    
    if (pairingCode) {
      broadcastUpdate(pairingCode, 'CONTEXT_UPDATED', {
        subject: captureData.subject,
        topic: captureData.subtopic || captureData.topic,
        status: captureData.verificationState === 'UPDATE' ? 'Updated' : 'Verified',
        confidence: captureData.confidence
      });
      broadcastUpdate(pairingCode, 'RECOMMENDATIONS_UPDATED', recs);
    }
    
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/telegram/accept', async (req, res) => {
  const { studentId = 'stu_1', items, pairingCode } = req.body;
  
  try {
    for (const captureData of items) {
      if (captureData && captureData.isVerified) {
        if ((captureData.verificationState === 'UPDATE' || captureData.verificationState === 'CONFLICT') && captureData.changes) {
          for (const change of captureData.changes) {
            if (change.field === 'date' && captureData.itemId && captureData.itemType !== 'project') {
              await UpcomingItem.updateOne({ _id: captureData.itemId }, { date: change.new });
            } else if (captureData.itemType === 'project_task') {
              const taskId = captureData.itemId;
              const task = await ProjectTask.findById(taskId).lean();
              if(task) {
                if (change.field === 'status') await ProjectTask.updateOne({ _id: taskId }, { status: change.new });
                if (change.field === 'assignee') await ProjectTask.updateOne({ _id: taskId }, { assignee: change.new });
                if (change.field === 'date') await ProjectTask.updateOne({ _id: taskId }, { deadline: change.new });
                
                if (task.project_id && pairingCode) {
                  const proj = await Project.findById(task.project_id).lean();
                  if (proj) {
                    const tasks = await ProjectTask.find({ project_id: task.project_id }).lean();
                    const completed = tasks.filter(t => t.status === 'Completed').length;
                    const total = tasks.length;
                    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    broadcastUpdate(pairingCode, 'PROJECT_UPDATED', {
                      name: proj.name,
                      progress: progress,
                      completedCount: completed,
                      totalCount: total,
                      recentTask: task.title
                    });
                  }
                }
              }
            } else if (captureData.itemType === 'project' && change.field === 'deadline') {
              await Project.updateOne({ _id: captureData.itemId }, { deadline: change.new });
            }
          }
        } else if (captureData.verificationState === 'NEW') {
          if (captureData.itemType) {
            const id = `up_new_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            let subId = 'sub_os';
            if (captureData.subject.toLowerCase() === 'dbms') subId = 'sub_dbms';
            if (captureData.subject.toLowerCase() === 'alm') subId = 'sub_alm';
            if (captureData.subject.toLowerCase() === 'soa') subId = 'sub_soa';
            
            await UpcomingItem.create({
              _id: id, subject_id: subId, title: captureData.topic || 'New Item', type: captureData.itemType, date: captureData.targetDate || 'TBD', priority: 'medium', source: 'telegram', source_ref: captureData.sourceMessageIds?.join(',')
            });
          }
        } else if (captureData.verificationState === 'VERIFIED') {
          await Topic.updateMany({ name: captureData.subtopic || captureData.topic }, { status: 'completed' });
        }
      }
    }

    const recs = await generateRecommendations(studentId);
    
    if (pairingCode) {
      broadcastUpdate(pairingCode, 'RECOMMENDATIONS_UPDATED', recs);
      broadcastUpdate(pairingCode, 'TELEGRAM_BATCH_PROCESSED', { count: items.length });
    }
    
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/action/complete', async (req, res) => {
  const { type, id, studentId = 'stu_1', pairingCode, actionType = 'complete' } = req.body;
  
  try {
    if (type === 'project_task') {
      const newStatus = actionType === 'uncomplete' ? 'Pending' : 'Completed';
      await ProjectTask.updateOne({ _id: id }, { status: newStatus });
      
      if (pairingCode) {
        const task = await ProjectTask.findById(id).lean();
        if (task) {
          const proj = await Project.findById(task.project_id).lean();
          if (proj) {
            const tasks = await ProjectTask.find({ project_id: task.project_id }).lean();
            const completed = tasks.filter(t => t.status === 'Completed').length;
            const total = tasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            await Project.updateOne({ _id: task.project_id }, { progress });

            broadcastUpdate(pairingCode, 'PROJECT_UPDATED', {
              name: proj.name,
              progress: progress,
              completedCount: completed,
              totalCount: total,
              recentTask: task.title + (actionType === 'uncomplete' ? " (Reopened)" : " (Completed)")
            });
          }
        }
      }
    } else if (type === 'topic') {
      await Topic.updateOne({ _id: id }, { status: 'completed' });
    } else if (type === 'upcoming_item') {
      await UpcomingItem.deleteOne({ _id: id });
    }

    const recs = await generateRecommendations(studentId);
    if (pairingCode) {
      broadcastUpdate(pairingCode, 'RECOMMENDATIONS_UPDATED', recs);
      broadcastUpdate(pairingCode, 'CONTEXT_REFRESH_NEEDED', { type, id });
    }
    
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/demo/reset', async (req, res) => {
  try {
    await seed();
    resetSessions();
    res.json({ success: true, message: "Demo reset completed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
initDb().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexora Backend running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server", err);
});
