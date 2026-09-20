require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const { getDb } = require('./database');
const { seed } = require('./seed');

const { analyzeImage } = require('./services/perceptionService');
const { searchContext } = require('./services/contextService');
const { verifyContext } = require('./services/verificationService');
const { generateRecommendations } = require('./services/recommendationService');
const { init: initSync, broadcastUpdate, resetSessions } = require('./services/deviceSyncService');

const app = express();
const server = http.createServer(app);
initSync(server);

app.use(cors());
app.use(express.json());

// Set up Multer for handling multipart/form-data
const uploadImage = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const uploadJson = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for JSON
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed!'), false);
    }
  }
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    gemini: process.env.GEMINI_API_KEY ? "configured" : "missing_key_demo_fallback_active"
  });
});

// Orchestrated endpoint: Image -> Gemini -> Context Engine -> Verification
app.post('/api/capture/analyze', uploadImage.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  try {
    console.log(`[${new Date().toISOString()}] Request received: /api/capture/analyze`);

    // 1. Perception Service (Gemini)
    console.log(`[${new Date().toISOString()}] Perception started...`);
    const { mode, perception } = await analyzeImage(req.file.buffer, req.file.mimetype);
    console.log(`[${new Date().toISOString()}] Perception completed [Mode: ${mode}]. Confidence: ${perception.confidence}`);

    // 2. Context Engine API (Academic DB)
    console.log(`[${new Date().toISOString()}] Context search started for raw_text...`);
    const query = perception.raw_text || perception.topic_hint || 'Unknown'; 
    const contextMatches = await searchContext(query, 'stu_1');
    console.log(`[${new Date().toISOString()}] Context search completed. Matches found: ${contextMatches.length}`);

    // 3. Verification Service
    console.log(`[${new Date().toISOString()}] Verification started...`);
    const verificationResult = verifyContext(perception, contextMatches);
    console.log(`[${new Date().toISOString()}] Verification completed. Verified: ${verificationResult.verified}`);

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Request completed in ${duration}ms\n`);

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
        verificationState: verificationResult.verificationState,
        confidence: verificationResult.confidence,
        reason: verificationResult.reason,
        evidence: verificationResult.evidence,
        changes: verificationResult.changes || null
      }
    });

  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error during analyze:`, err.message);
    res.status(500).json({ 
      error: err.message || "AI perception is temporarily unavailable." 
    });
  }
});

const { processTelegramData } = require('./services/telegramService');

// Orchestrated endpoint for Telegram JSON
app.post('/api/telegram/analyze', uploadJson.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No JSON file provided." });
  }
  
  try {
    const fileString = req.file.buffer.toString('utf-8');
    const jsonData = JSON.parse(fileString);
    
    const telegramResult = await processTelegramData(jsonData);
    
    // Pass extracted items through context and verification
    const categorizedItems = {
      newItems: [],
      duplicates: [],
      updates: [],
      conflicts: [],
      uncertain: []
    };
    
    for (const item of telegramResult.extractedItems) {
      const query = `${item.subject || ''} ${item.activity}`.trim();
      const contextMatches = await searchContext(query, 'stu_1');
      
      const perceptionProxy = {
        raw_text: item.activity,
        confidence: item.confidence,
        type: item.type,
        target_date: item.deadline,
        target_item: item.activity,
        action_hint: item.action
      };
      
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
    console.error("Telegram API Error:", err);
    res.status(500).json({ error: "Failed to process Telegram file. " + err.message });
  }
});

// Get entire context for a student (UI hydration)
app.get('/api/student/:id', async (req, res) => {
  const db = await getDb();
  const studentId = req.params.id;

  try {
    const student = await db.get('SELECT * FROM students WHERE id = ?', studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const subjects = await db.all('SELECT * FROM subjects WHERE student_id = ?', [req.params.id]);
    
    for (const sub of subjects) {
      sub.topics = await db.all('SELECT * FROM topics WHERE subject_id = ?', [sub.id]);
      sub.materials = await db.all('SELECT * FROM materials WHERE subject_id = ?', [sub.id]);
      sub.upcomingItems = await db.all('SELECT * FROM upcoming_items WHERE subject_id = ?', [sub.id]);
    }
    
    // Fetch projects
    const projects = await db.all('SELECT * FROM projects WHERE student_id = ?', [req.params.id]);
    for (const proj of projects) {
      proj.subjects = await db.all(`
        SELECT s.* FROM subjects s
        JOIN project_subjects ps ON s.id = ps.subject_id
        WHERE ps.project_id = ?
      `, [proj.id]);
      proj.members = await db.all('SELECT * FROM project_members WHERE project_id = ?', [proj.id]);
      proj.tasks = await db.all('SELECT * FROM project_tasks WHERE project_id = ?', [proj.id]);
      
      // Calculate progress and risk
      const totalTasks = proj.tasks.length;
      const completedTasks = proj.tasks.filter(t => t.status === 'Completed').length;
      proj.calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : proj.progress;
      
      // Basic risk check: deadline approaching + critical tasks incomplete
      // Fake logic for demo: if deadline has "Sep 2" or "30" and progress < 80, maybe at risk.
      const hasPendingHighPriority = proj.tasks.some(t => t.priority === 'high' && t.status === 'Pending');
      proj.status = hasPendingHighPriority ? 'AT RISK' : 'ON TRACK';
      proj.riskReason = hasPendingHighPriority ? "Critical tasks remain incomplete." : "Project is progressing on schedule.";
    }

    res.json({ student, subjects, projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Recommendation Engine ---
app.get('/api/recommendations/:studentId', async (req, res) => {
  try {
    const recs = await generateRecommendations(req.params.studentId);
    res.json({
      studentId: req.params.studentId,
      generatedAt: new Date().toISOString(),
      recommendations: recs
    });
  } catch (err) {
    console.error("Error generating recommendations:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Calculate dynamically instead of hardcoded
app.post('/api/recommendations/recalculate', async (req, res) => {
  const { studentId = 'stu_1' } = req.body;
  try {
    const recs = await generateRecommendations(studentId);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Final accept loop
app.post('/api/context/accept', async (req, res) => {
  const { studentId = 'stu_1', captureData, pairingCode } = req.body;
  const db = await getDb();
  
  try {
    if (captureData && captureData.isVerified) {
      if ((captureData.verificationState === 'UPDATE' || captureData.verificationState === 'CONFLICT') && captureData.changes) {
        // Apply changes to upcoming_items for updates and forced conflicts
          for (const change of captureData.changes) {
            if (change.field === 'date' && captureData.itemId && captureData.itemType !== 'project') {
              await db.run(`UPDATE upcoming_items SET date = ? WHERE id = ?`, [change.new, captureData.itemId]);
            } else if (captureData.itemType === 'project_task') {
              if (change.field === 'status') await db.run(`UPDATE project_tasks SET status = ? WHERE id = ?`, [change.new, captureData.itemId]);
              if (change.field === 'assignee') await db.run(`UPDATE project_tasks SET assignee = ? WHERE id = ?`, [change.new, captureData.itemId]);
            } else if (captureData.itemType === 'project' && change.field === 'deadline') {
              await db.run(`UPDATE projects SET deadline = ? WHERE id = ?`, [change.new, captureData.itemId]);
            }
          }
      } else if (captureData.verificationState === 'NEW') {
        // Insert a new upcoming item if we have the data
        if (captureData.itemType) {
          const id = `up_new_${Date.now()}`;
          // In a real app we'd look up subject_id properly, for demo we mock it if it's unknown
          await db.run(
            `INSERT INTO upcoming_items (id, subject_id, title, type, date, priority) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, 'sub_os', captureData.topic || 'New Item', captureData.itemType, captureData.targetDate || 'TBD', 'medium']
          );
        }
      } else if (captureData.verificationState === 'VERIFIED') {
        // Normal topic completion
        await db.run(`UPDATE topics SET status = 'completed' WHERE name = ?`, [captureData.subtopic || captureData.topic]);
      }
    }

    const recs = await generateRecommendations(studentId);
    
    // Broadcast to laptop if paired
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

// Batch accept for Telegram
app.post('/api/telegram/accept', async (req, res) => {
  const { studentId = 'stu_1', items, pairingCode } = req.body;
  const db = await getDb();
  
  try {
    for (const captureData of items) {
      if (captureData && captureData.isVerified) {
        if ((captureData.verificationState === 'UPDATE' || captureData.verificationState === 'CONFLICT') && captureData.changes) {
          for (const change of captureData.changes) {
            if (change.field === 'date' && captureData.itemId && captureData.itemType !== 'project') {
              await db.run(`UPDATE upcoming_items SET date = ? WHERE id = ?`, [change.new, captureData.itemId]);
            } else if (captureData.itemType === 'project_task') {
              const taskId = captureData.itemId;
              let projectId = null;
              // Get project id
              const row = await db.get(`SELECT project_id, title FROM project_tasks WHERE id = ?`, [taskId]);
              if (row) projectId = row.project_id;
              
              if (change.field === 'status') {
                await db.run(`UPDATE project_tasks SET status = ? WHERE id = ?`, [change.new, taskId]);
              }
              if (change.field === 'assignee') {
                await db.run(`UPDATE project_tasks SET assignee = ? WHERE id = ?`, [change.new, taskId]);
              }
              if (change.field === 'date') {
                await db.run(`UPDATE project_tasks SET deadline = ? WHERE id = ?`, [change.new, taskId]);
              }

              if (projectId && pairingCode) {
                // Fetch project to broadcast
                const proj = await db.get(`SELECT * FROM projects WHERE id = ?`, [projectId]);
                if (proj) {
                  const tasks = await db.all(`SELECT * FROM project_tasks WHERE project_id = ?`, [projectId]);
                  const completed = tasks.filter(t => t.status === 'Completed').length;
                  const total = tasks.length;
                  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                  
                  broadcastUpdate(pairingCode, 'PROJECT_UPDATED', {
                    name: proj.name,
                    progress: progress,
                    completedCount: completed,
                    totalCount: total,
                    recentTask: row.title
                  });
                }
              }
            } else if (captureData.itemType === 'project' && change.field === 'deadline') {
              await db.run(`UPDATE projects SET deadline = ? WHERE id = ?`, [change.new, captureData.itemId]);
            }
          }
        } else if (captureData.verificationState === 'NEW') {
          if (captureData.itemType) {
            const id = `up_new_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            // Basic mapping logic
            let subId = 'sub_os';
            if (captureData.subject.toLowerCase() === 'dbms') subId = 'sub_dbms';
            if (captureData.subject.toLowerCase() === 'alm') subId = 'sub_alm';
            if (captureData.subject.toLowerCase() === 'soa') subId = 'sub_soa';
            
            await db.run(
              `INSERT INTO upcoming_items (id, subject_id, title, type, date, priority, source, source_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [id, subId, captureData.topic || 'New Item', captureData.itemType, captureData.targetDate || 'TBD', 'medium', 'telegram', captureData.sourceMessageIds?.join(',')]
            );
          }
        } else if (captureData.verificationState === 'VERIFIED') {
          await db.run(`UPDATE topics SET status = 'completed' WHERE name = ?`, [captureData.subtopic || captureData.topic]);
        }
      }
    }

    const recs = await generateRecommendations(studentId);
    
    // Broadcast to laptop if paired
    if (pairingCode) {
      broadcastUpdate(pairingCode, 'RECOMMENDATIONS_UPDATED', recs);
      broadcastUpdate(pairingCode, 'TELEGRAM_BATCH_PROCESSED', { count: items.length });
    }
    
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Demo Reset Mechanism
app.post('/api/demo/reset', async (req, res) => {
  try {
    await seed();
    resetSessions();
    res.json({ success: true, message: "Demo reset completed." });
  } catch (err) {
    console.error("Demo reset error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Context Engine Backend & Socket.IO running on http://localhost:${PORT}`);
});
