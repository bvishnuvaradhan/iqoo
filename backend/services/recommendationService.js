const UpcomingItem = require('../models/UpcomingItem');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Project = require('../models/Project');
const ProjectTask = require('../models/ProjectTask');

const WEIGHTS = {
  DEADLINE_URGENCY: 40,
  EXAM_RELEVANCE: 30,
  WEAK_TOPIC: 20,
  IMPORTANCE: 10
};

function getDaysUntil(dateStr) {
  const fakeToday = new Date('2026-09-19T00:00:00Z');
  const targetDateStr = `2026-${(dateStr||'').replace(' ', '-')}T00:00:00Z`;
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) return 14; 
  return Math.max(0, (target - fakeToday) / (1000 * 60 * 60 * 24));
}

function getPriorityLabel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

async function generateRecommendations(studentId) {
  const recommendations = [];
  
  const subjects = await Subject.find({ student_id: studentId }).lean();
  const subjectIds = subjects.map(s => s._id);
  const subjectMap = {};
  subjects.forEach(sub => { subjectMap[sub._id] = sub.name; });

  const upcomingItems = await UpcomingItem.find({ subject_id: { $in: subjectIds } }).lean();
  const topics = await Topic.find({ subject_id: { $in: subjectIds } }).lean();

  let idCounter = 1;

  for (const item of upcomingItems) {
    const daysUntil = getDaysUntil(item.date);
    const urgencyScore = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (daysUntil / 14)));

    if (item.type === 'assignment') {
      const score = Math.round(urgencyScore + WEIGHTS.IMPORTANCE); 
      const reasons = [
        `Deadline is approaching (${daysUntil} days away)`,
        `Mandatory assessment`
      ];
      recommendations.push({
        id: `rec-gen-${idCounter++}`,
        title: `Complete ${item.title}`,
        type: 'assignment',
        subject: subjectMap[item.subject_id],
        topic: item.title,
        durationMinutes: 45,
        priority: getPriorityLabel(score),
        score,
        reasons
      });
    }

    if (item.type === 'exam') {
      const subjectTopics = topics.filter(t => t.subject_id === item.subject_id && t.status !== 'completed');
      
      for (const topic of subjectTopics) {
        let score = urgencyScore; 
        const reasons = [`${item.title} is approaching (${daysUntil} days away)`];

        if (topic.importance === 'high') {
          score += WEIGHTS.IMPORTANCE;
          reasons.push("Topic is marked highly important in syllabus");
        }

        if (topic.quiz_score !== null && topic.quiz_score !== undefined && topic.quiz_score < 70) {
          const weaknessMultiplier = (70 - topic.quiz_score) / 70;
          score += (WEIGHTS.WEAK_TOPIC * weaknessMultiplier);
          reasons.push(`Recent quiz performance is low (${topic.quiz_score}%)`);
        }

        if (topic.status === 'not-started') {
          score += 5;
          reasons.push("Topic is not fully completed");
        }

        score += WEIGHTS.EXAM_RELEVANCE;

        recommendations.push({
          id: `rec-gen-${idCounter++}`,
          title: `Revise ${topic.name}`,
          type: 'study',
          subject: subjectMap[item.subject_id],
          topic: topic.name,
          durationMinutes: 30,
          priority: getPriorityLabel(score),
          score: Math.round(score),
          reasons
        });
      }
    }
  }

  for (const topic of topics) {
    if (topic.status === 'in-progress' && !upcomingItems.some(i => i.subject_id === topic.subject_id)) {
      let score = 20;
      const reasons = ["Topic is currently in-progress"];
      
      if (topic.importance === 'high') {
        score += WEIGHTS.IMPORTANCE;
        reasons.push("Topic is marked important");
      }
      
      recommendations.push({
        id: `rec-gen-${idCounter++}`,
        title: `Continue ${topic.name}`,
        type: 'study',
        subject: subjectMap[topic.subject_id],
        topic: topic.name,
        durationMinutes: 20,
        priority: getPriorityLabel(score),
        score: Math.round(score),
        reasons
      });
    }
  }

  const projects = await Project.find({ student_id: studentId }).lean();
  for (const proj of projects) {
    const tasks = await ProjectTask.find({ project_id: proj._id }).lean();
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    
    const projDaysUntil = getDaysUntil(proj.deadline);
    const projUrgency = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (projDaysUntil / 14)));

    for (const task of pendingTasks) {
      const taskDaysUntil = getDaysUntil(task.deadline || proj.deadline);
      const taskUrgency = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (taskDaysUntil / 14)));
      
      let score = Math.max(projUrgency, taskUrgency);
      const reasons = [`Project deadline is approaching (${projDaysUntil} days away)`];

      if (task.priority === 'high') {
        score += WEIGHTS.IMPORTANCE + 10;
        reasons.push("Critical project task");
      }

      recommendations.push({
        id: `rec-gen-${idCounter++}`,
        title: `Task: ${task.title}`,
        type: 'project',
        subject: proj.name,
        topic: task.title,
        durationMinutes: 60,
        priority: getPriorityLabel(score),
        score: Math.round(score),
        reasons
      });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations;
}

module.exports = { generateRecommendations };
