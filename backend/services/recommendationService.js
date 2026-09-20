const { getDb } = require('../database');

// Weights for the scoring algorithm (explainable priority)
const WEIGHTS = {
  DEADLINE_URGENCY: 40,
  EXAM_RELEVANCE: 30,
  WEAK_TOPIC: 20,
  IMPORTANCE: 10
};

// Helper: days until a given date (assuming 'Sep 22' formatting mapped to 2026 for the hackathon prototype)
function getDaysUntil(dateStr) {
  const fakeToday = new Date('2026-09-19T00:00:00Z');
  const targetDateStr = `2026-${dateStr.replace(' ', '-')}T00:00:00Z`;
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) return 14; // Default safe fallback
  return Math.max(0, (target - fakeToday) / (1000 * 60 * 60 * 24));
}

// Map 0-100 score back to string high/medium/low priority
function getPriorityLabel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

async function generateRecommendations(studentId) {
  const db = await getDb();
  const recommendations = [];
  
  // 1. Fetch academic context
  const upcomingItems = await db.all('SELECT * FROM upcoming_items WHERE subject_id IN (SELECT id FROM subjects WHERE student_id = ?)', [studentId]);
  const topics = await db.all('SELECT * FROM topics WHERE subject_id IN (SELECT id FROM subjects WHERE student_id = ?)', [studentId]);
  const subjects = await db.all('SELECT * FROM subjects WHERE student_id = ?', [studentId]);

  const subjectMap = {};
  subjects.forEach(sub => { subjectMap[sub.id] = sub.name; });

  let idCounter = 1;

  // 2. Iterate through upcoming items (exams, assignments)
  for (const item of upcomingItems) {
    const daysUntil = getDaysUntil(item.date);
    
    // Urgency score: Max weight if due today/tomorrow, drops to 0 if > 14 days
    const urgencyScore = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (daysUntil / 14)));

    if (item.type === 'assignment') {
      const score = Math.round(urgencyScore + WEIGHTS.IMPORTANCE); // Base importance
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
      // Find weak topics for this subject
      const subjectTopics = topics.filter(t => t.subject_id === item.subject_id && t.status !== 'completed');
      
      for (const topic of subjectTopics) {
        let score = urgencyScore; // Inherit urgency from the exam
        const reasons = [
          `${item.title} is approaching (${daysUntil} days away)`
        ];

        // Importance weight
        if (topic.importance === 'high') {
          score += WEIGHTS.IMPORTANCE;
          reasons.push("Topic is marked highly important in syllabus");
        }

        // Weakness weight (quiz performance)
        if (topic.quiz_score !== null && topic.quiz_score < 70) {
          const weaknessMultiplier = (70 - topic.quiz_score) / 70; // Lower score = higher multiplier
          score += (WEIGHTS.WEAK_TOPIC * weaknessMultiplier);
          reasons.push(`Recent quiz performance is low (${topic.quiz_score}%)`);
        }

        // Progress weight
        if (topic.status === 'not-started') {
          score += 5;
          reasons.push("Topic is not fully completed");
        }

        // Exam Relevance weight
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

  // 3. Fallback useful academic work (topics in-progress with no immediate deadline)
  for (const topic of topics) {
    if (topic.status === 'in-progress' && !upcomingItems.some(i => i.subject_id === topic.subject_id)) {
      let score = 20; // Base score for fallback
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

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  // 4. Project Tasks Intelligence
  const projects = await db.all('SELECT * FROM projects WHERE student_id = ?', [studentId]);
  for (const proj of projects) {
    const tasks = await db.all('SELECT * FROM project_tasks WHERE project_id = ?', [proj.id]);
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    
    // Project deadline urgency
    const projDaysUntil = getDaysUntil(proj.deadline);
    const projUrgency = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (projDaysUntil / 14)));

    for (const task of pendingTasks) {
      const taskDaysUntil = getDaysUntil(task.deadline || proj.deadline);
      const taskUrgency = Math.max(0, WEIGHTS.DEADLINE_URGENCY * (1 - (taskDaysUntil / 14)));
      
      let score = Math.max(projUrgency, taskUrgency);
      const reasons = [
        `Project deadline is approaching (${projDaysUntil} days away)`
      ];

      if (task.priority === 'high') {
        score += WEIGHTS.IMPORTANCE + 10;
        reasons.push("Critical project task");
      }

      recommendations.push({
        id: `rec-gen-${idCounter++}`,
        title: `Task: ${task.title}`,
        type: 'project',
        subject: proj.name, // Display project name as subject
        topic: task.title,
        durationMinutes: 60,
        priority: getPriorityLabel(score),
        score: Math.round(score),
        reasons
      });
    }
  }

  // Resort including projects
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

module.exports = { generateRecommendations };
