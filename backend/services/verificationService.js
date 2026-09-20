function verifyContext(perception, contextMatches) {
  if (perception.confidence < 0.2) {
    return {
      verified: false,
      verificationState: 'UNCERTAIN',
      confidence: perception.confidence,
      reason: "Image is too unclear for AI perception.",
      match: null,
      evidence: ["Perception confidence below acceptable threshold."]
    };
  }

  if (!contextMatches || contextMatches.length === 0) {
    return {
      verified: false,
      verificationState: 'NEW',
      confidence: perception.confidence,
      reason: "ContextAI could not confidently match this information to your academic context. Treating as new.",
      match: null,
      evidence: ["No overlapping keywords in subjects, topics, or materials."]
    };
  }

  // 1. Check for upcoming_item matches first (for Update/Duplicate/Conflict flow)
  const isProject = (perception.type || '').toUpperCase().includes('PROJECT');
  console.log("Perception Type:", perception.type, "isProject:", isProject);
  const upcomingMatches = isProject ? [] : contextMatches.filter(m => m.type === 'upcoming_match');
  if (upcomingMatches.length > 0 && perception.target_date) {
    // Sort by overlap to get best match (searchContext attaches overlap)
    upcomingMatches.sort((a, b) => (b.overlap || 0) - (a.overlap || 0));
    const bestUpcoming = upcomingMatches[0];
    const existingDate = bestUpcoming.item_date;
    const perceivedDate = perception.target_date;

    // Check if dates are equivalent
    // "Sept 20" vs "September 20" vs "Sep 20"
    const normalizeDate = (d) => d.toLowerCase().replace(/september|sept|sep/g, 'sep').replace(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/g, '').trim();
    
    const normExisting = normalizeDate(existingDate);
    const normPerceived = normalizeDate(perceivedDate);

    let state = 'VERIFIED';
    let reason = '';
    let isVerified = true;
    let changes = null;
    let evidenceStrings = [`Found existing item: ${bestUpcoming.item_title} (${existingDate})`];

    if (normExisting === normPerceived) {
      state = 'DUPLICATE';
      reason = `This information exactly matches an existing item in your calendar.`;
      evidenceStrings.push(`Date '${existingDate}' matches perceived date.`);
    } else {
      // Dates differ.
      const action = (perception.action_hint || '').toLowerCase();
      if (action.includes('postpone') || action.includes('move') || action.includes('update') || action.includes('change') || action.includes('reschedule')) {
        state = 'UPDATE';
        reason = `Detected a change to the existing schedule for ${bestUpcoming.item_title}.`;
        changes = [{ field: 'date', old: existingDate, new: perceivedDate }];
        evidenceStrings.push(`Perceived action: ${action}`);
      } else {
        // If it just differs and we aren't sure why, it's a conflict
        state = 'CONFLICT';
        reason = `The captured date (${perceivedDate}) conflicts with your existing schedule (${existingDate}).`;
        changes = [{ field: 'date', old: existingDate, new: perceivedDate }];
        isVerified = false; // Requires human resolution
      }
    }

    return {
      verified: isVerified,
      verificationState: state,
      confidence: Math.min(perception.confidence + 0.2, 0.99),
      reason: reason,
      match: {
        subject: bestUpcoming.subject,
        topic: bestUpcoming.item_title, // Map to topic for UI consistency
        itemId: bestUpcoming.item_id,
        itemType: bestUpcoming.item_type
      },
      changes: changes,
      evidence: evidenceStrings
    };
  }

  // 1.5. Check for Project/Task Matches
  const taskMatches = contextMatches.filter(m => m.type === 'project_task_match');
  if (taskMatches.length > 0) {
    taskMatches.sort((a, b) => (b.overlap || 0) - (a.overlap || 0));
    const bestTask = taskMatches[0];
    
    let state = 'UPDATE';
    let reason = `Detected an update for project task: ${bestTask.task_title}`;
    let changes = [];
    let evidenceStrings = [`Matched project task: ${bestTask.task_title} in ${bestTask.project_name}`];

    const action = (perception.action_hint || '').toLowerCase();
    let newStatus = bestTask.status;
    let newAssignee = bestTask.assignee;

    if (action.includes('done') || action.includes('completed') || action.includes('finished')) {
      newStatus = 'Completed';
    } else if (action.includes('pending') || action.includes('started')) {
      newStatus = 'Pending';
    }

    // Attempt to extract assignee from text (heuristic for demo)
    const rawTextLower = (perception.action_hint || perception.raw_text || '').toLowerCase();
    const potentialAssignees = ['arjun', 'priya', 'rahul'];
    for (const name of potentialAssignees) {
      if (rawTextLower.includes(name)) {
        newAssignee = name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    if (newStatus !== bestTask.status) {
      changes.push({ field: 'status', old: bestTask.status, new: newStatus });
    }
    if (newAssignee !== bestTask.assignee) {
      changes.push({ field: 'assignee', old: bestTask.assignee, new: newAssignee });
    }
    
    // Check for deadline update
    if (perception.target_date) {
      const normalizeDate = (d) => (d||'').toLowerCase().replace(/september|sept|sep/g, 'sep').replace(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/g, '').trim();
      const normExisting = normalizeDate(bestTask.deadline);
      const normPerceived = normalizeDate(perception.target_date);
      if (normExisting !== normPerceived) {
        changes.push({ field: 'date', old: bestTask.deadline, new: perception.target_date });
        evidenceStrings.push(`Task deadline moved to ${perception.target_date}`);
      }
    }

    // Even if no changes were strictly detected by heuristic, we surface it as an UPDATE for review
    if (changes.length === 0) {
      state = 'VERIFIED';
      reason = `Matched task: ${bestTask.task_title}`;
    }

    return {
      verified: state !== 'CONFLICT',
      verificationState: state,
      confidence: Math.min(perception.confidence + 0.2, 0.99),
      reason,
      match: {
        subject: bestTask.project_name, // Projects act like subjects in UI
        topic: bestTask.task_title,
        itemId: bestTask.task_id,
        itemType: 'project_task'
      },
      changes: changes.length > 0 ? changes : null,
      evidence: evidenceStrings
    };
  }

  const projectMatches = contextMatches.filter(m => m.type === 'project_match');
  if (projectMatches.length > 0 && perception.target_date) {
    projectMatches.sort((a, b) => (b.overlap || 0) - (a.overlap || 0));
    const bestProj = projectMatches[0];
    
    const normalizeDate = (d) => d.toLowerCase().replace(/september|sept|sep/g, 'sep').replace(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/g, '').trim();
    
    const normExisting = normalizeDate(bestProj.deadline || '');
    const normPerceived = normalizeDate(perception.target_date);
    
    let state = 'UPDATE';
    let reason = `Detected a deadline change for project: ${bestProj.project_name}`;
    let changes = [{ field: 'deadline', old: bestProj.deadline, new: perception.target_date }];
    
    if (normExisting === normPerceived) {
      state = 'DUPLICATE';
      changes = null;
      reason = "Deadline already matches existing project.";
    }

    return {
      verified: true,
      verificationState: state,
      confidence: Math.min(perception.confidence + 0.2, 0.99),
      reason,
      match: {
        subject: bestProj.project_name,
        topic: 'Project Deadline',
        itemId: bestProj.project_id,
        itemType: 'project'
      },
      changes,
      evidence: [`Matched project: ${bestProj.project_name}`]
    };
  }

  // 2. Normal Topic/Material matching
  const matchesByTopic = {};
  
  contextMatches.forEach(match => {
    if (match.type === 'upcoming_match') return; // skip
    const key = `${match.subject}|${match.topic}`;
    if (!matchesByTopic[key]) {
      matchesByTopic[key] = {
        subject: match.subject,
        topic: match.topic,
        module: match.module || null,
        evidenceCount: 0,
        sources: [],
        evidenceStrings: []
      };
    }
    matchesByTopic[key].evidenceCount += 1;
    matchesByTopic[key].sources.push(match.type);

    if (match.type === 'topic_match') {
      matchesByTopic[key].evidenceStrings.push(`Topic exists in ${match.subject} academic context`);
      if (match.module) matchesByTopic[key].evidenceStrings.push(`Topic belongs to ${match.module}`);
    } else if (match.type === 'material_match') {
      matchesByTopic[key].evidenceStrings.push(`Related material exists: ${match.material_title}`);
    }
  });

  // Find the topic with the most evidence
  let bestMatch = null;
  let maxEvidence = 0;

  for (const key in matchesByTopic) {
    if (matchesByTopic[key].evidenceCount > maxEvidence) {
      maxEvidence = matchesByTopic[key].evidenceCount;
      bestMatch = matchesByTopic[key];
    }
  }

  if (!bestMatch) {
    return {
      verified: false,
      verificationState: 'NEW',
      confidence: perception.confidence,
      reason: "No strong match found. Treating as new information.",
      match: null,
      evidence: ["Did not match topics or upcoming items."]
    };
  }

  bestMatch.evidence = [...new Set(bestMatch.evidenceStrings)];
  let verificationConfidence = perception.confidence;
  
  if (bestMatch.evidenceCount > 0) {
    const boost = Math.min(0.15 * bestMatch.evidenceCount, 0.45); 
    verificationConfidence = Math.min(verificationConfidence + boost, 0.99);
  }

  const isVerified = verificationConfidence >= 0.75;

  return {
    verified: isVerified,
    verificationState: isVerified ? 'VERIFIED' : 'UNCERTAIN',
    confidence: Number(verificationConfidence.toFixed(2)),
    reason: isVerified 
      ? `Matched against the student's ${bestMatch.subject} academic context.` 
      : `ContextAI could not confidently match this information to your academic context.`,
    match: bestMatch,
    evidence: bestMatch.evidence
  };
}

module.exports = { verifyContext };
