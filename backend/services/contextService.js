const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Material = require('../models/Material');
const UpcomingItem = require('../models/UpcomingItem');
const Project = require('../models/Project');
const ProjectTask = require('../models/ProjectTask');

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function calculateOverlap(tokens1, tokens2) {
  const set2 = new Set(tokens2);
  return tokens1.filter(t => set2.has(t)).length;
}

async function searchContext(query, studentId = 'stu_1') {
  if (!query) {
    return [];
  }

  // Find subjects for this student
  const subjects = await Subject.find({ student_id: studentId }).lean();
  const subjectIds = subjects.map(s => s._id);
  const subjectMap = {};
  subjects.forEach(s => subjectMap[s._id] = s.name);

  const allTopics = await Topic.find({ subject_id: { $in: subjectIds } }).lean();
  const allMaterials = await Material.find({ subject_id: { $in: subjectIds } }).lean();
  
  // Create mapping for topic names for material join
  const topicMap = {};
  allTopics.forEach(t => topicMap[t._id] = t.name);

  const queryTokens = tokenize(query);
  const queryNorm = query.toLowerCase().trim();

  const contextResults = [];

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
        subject: subjectMap[top.subject_id],
        module: top.module_name,
        topic: top.name
      });
    }
  }

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
        subject: subjectMap[mat.subject_id],
        topic: topicMap[mat.topic_id] || 'General',
        material_title: mat.title,
        snippet: mat.content_snippet
      });
    }
  }

  const allUpcoming = await UpcomingItem.find({ subject_id: { $in: subjectIds } }).lean();

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
        subject: subjectMap[item.subject_id],
        item_id: item._id,
        item_title: item.title,
        item_type: item.type,
        item_date: item.date
      });
    }
  }

  const allProjects = await Project.find({ student_id: studentId }).lean();
  
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
        project_id: proj._id,
        project_name: proj.name,
        deadline: proj.deadline
      });
    }
    
    const tasks = await ProjectTask.find({ project_id: proj._id }).lean();
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
          project_id: proj._id,
          project_name: proj.name,
          task_id: task._id,
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
