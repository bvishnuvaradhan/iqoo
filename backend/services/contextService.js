const { getDb } = require('../database');

function tokenize(text) {
  if (!text) return [];
  // Lowercase, remove non-alphanumeric, split by spaces
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function calculateOverlap(tokens1, tokens2) {
  const set2 = new Set(tokens2);
  return tokens1.filter(t => set2.has(t)).length;
}

async function searchContext(query, studentId = 'stu_1') {
  const db = await getDb();
  
  if (!query) {
    return [];
  }

  // 1. Fetch all potential academic context for the student
  const allTopics = await db.all(`
    SELECT t.*, s.name as subject_name 
    FROM topics t JOIN subjects s ON t.subject_id = s.id
    WHERE s.student_id = ?
  `, [studentId]);

  const allMaterials = await db.all(`
    SELECT m.*, t.name as topic_name, s.name as subject_name
    FROM materials m 
    JOIN topics t ON m.topic_id = t.id
    JOIN subjects s ON m.subject_id = s.id
    WHERE s.student_id = ?
  `, [studentId]);

  const queryTokens = tokenize(query);
  const queryNorm = query.toLowerCase().trim();

  const contextResults = [];

  // 2. Layered Matching for Topics
  for (const top of allTopics) {
    const topNorm = top.name.toLowerCase().trim();
    const topTokens = tokenize(top.name);
    
    let isMatch = false;
    let matchType = '';

    if (topNorm === queryNorm) {
      isMatch = true; matchType = 'exact_match';
    } else if (topNorm.startsWith(queryNorm) || queryNorm.startsWith(topNorm)) {
      isMatch = true; matchType = 'prefix_match';
    } else {
      const overlap = calculateOverlap(queryTokens, topTokens);
      if (overlap > 0) {
        isMatch = true; matchType = 'token_overlap';
      }
    }

    if (isMatch) {
      contextResults.push({
        type: 'topic_match',
        match_level: matchType,
        subject: top.subject_name,
        module: top.module_name,
        topic: top.name
      });
    }
  }

  // 3. Layered Matching for Materials
  for (const mat of allMaterials) {
    const titleNorm = mat.title.toLowerCase();
    const snippetNorm = mat.content_snippet.toLowerCase();
    const matTokens = [...tokenize(mat.title), ...tokenize(mat.content_snippet)];
    
    let isMatch = false;
    let matchType = '';

    if (titleNorm.includes(queryNorm) || snippetNorm.includes(queryNorm)) {
      isMatch = true; matchType = 'normalized_text_match';
    } else {
      const overlap = calculateOverlap(queryTokens, matTokens);
      if (overlap > 0) {
        isMatch = true; matchType = 'token_overlap';
      }
    }

    if (isMatch) {
      contextResults.push({
        type: 'material_match',
        match_level: matchType,
        subject: mat.subject_name,
        topic: mat.topic_name,
        material_title: mat.title,
        snippet: mat.content_snippet
      });
    }
  }

  // 4. Layered Matching for Upcoming Items
  const allUpcoming = await db.all(`
    SELECT u.*, s.name as subject_name
    FROM upcoming_items u
    JOIN subjects s ON u.subject_id = s.id
    WHERE s.student_id = ?
  `, [studentId]);

  for (const item of allUpcoming) {
    const titleNorm = item.title.toLowerCase();
    const itemTokens = tokenize(item.title);
    
    let isMatch = false;
    let matchType = '';
    let overlapCount = 0;

    if (titleNorm.includes(queryNorm)) {
      isMatch = true; matchType = 'normalized_text_match';
      overlapCount = 10;
    } else {
      overlapCount = calculateOverlap(queryTokens, itemTokens);
      if (overlapCount > 0) {
        isMatch = true; matchType = 'token_overlap';
      }
    }

    if (isMatch) {
      contextResults.push({
        type: 'upcoming_match',
        match_level: matchType,
        overlap: overlapCount,
        subject: item.subject_name,
        item_id: item.id,
        item_title: item.title,
        item_type: item.type,
        item_date: item.date
      });
    }
  }

  // 5. Layered Matching for Projects and Tasks
  const allProjects = await db.all('SELECT * FROM projects WHERE student_id = ?', [studentId]);
  
  for (const proj of allProjects) {
    const projNorm = proj.name.toLowerCase();
    const projTokens = tokenize(proj.name);
    
    let isMatch = false;
    let matchType = '';
    let overlapCount = 0;

    if (projNorm.includes(queryNorm)) {
      isMatch = true; matchType = 'normalized_text_match';
      overlapCount = 15;
    } else {
      overlapCount = calculateOverlap(queryTokens, projTokens);
      if (overlapCount > 0) {
        isMatch = true; matchType = 'token_overlap';
      }
    }

    if (isMatch) {
      contextResults.push({
        type: 'project_match',
        match_level: matchType,
        overlap: overlapCount,
        project_id: proj.id,
        project_name: proj.name,
        deadline: proj.deadline
      });
    }
    
    // Check Tasks
    const tasks = await db.all('SELECT * FROM project_tasks WHERE project_id = ?', [proj.id]);
    for (const task of tasks) {
      const taskNorm = task.title.toLowerCase();
      const taskTokens = tokenize(task.title);
      let tIsMatch = false;
      let tMatchType = '';
      let tOverlapCount = 0;

      if (taskNorm.includes(queryNorm) || queryNorm.includes(taskNorm)) {
        tIsMatch = true; tMatchType = 'normalized_text_match';
        tOverlapCount = 12;
      } else {
        tOverlapCount = calculateOverlap(queryTokens, taskTokens);
        if (tOverlapCount > 0) {
          tIsMatch = true; tMatchType = 'token_overlap';
        }
      }
      
      if (tIsMatch) {
        contextResults.push({
          type: 'project_task_match',
          match_level: tMatchType,
          overlap: tOverlapCount,
          project_id: proj.id,
          project_name: proj.name,
          task_id: task.id,
          task_title: task.title,
          status: task.status,
          assignee: task.assignee
        });
      }
    }
  }

  return contextResults;
}

module.exports = { searchContext };
