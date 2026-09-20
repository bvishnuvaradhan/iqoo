const { getDb, initDb } = require('./database');

async function seed() {
  const db = await initDb();
  
  // Clear existing data
  const tables = ['project_tasks', 'project_members', 'project_subjects', 'projects', 'recommendations', 'captures', 'upcoming_items', 'materials', 'topics', 'subjects', 'students'];
  for (const table of tables) {
    await db.exec(`DELETE FROM ${table}`);
  }

  // 1. Seed Student
  await db.run(`
    INSERT INTO students (id, name, firstName, semester, program, university, gpa) 
    VALUES ('stu_1', 'Arjun Mehta', 'Arjun', '5th Semester', 'B.Tech CSE', 'VIT University', 8.72)
  `);

  // 2. Seed Subjects
  const subjects = [
    { id: 'sub_os', name: 'Operating Systems', code: 'OS401', color: '#3b82f6', professor: 'Dr. Rajesh Kumar', progress: 42 },
    { id: 'sub_soa', name: 'SOA Programming and Microservices', code: 'SOA502', color: '#f59e0b', professor: 'Dr. Ananya Sharma', progress: 28 },
    { id: 'sub_dbms', name: 'Database Management Systems', code: 'DB402', color: '#8b5cf6', professor: 'Dr. Priya Sharma', progress: 65 },
    { id: 'sub_alm', name: 'Agile Lifecycle Management', code: 'ALM301', color: '#10b981', professor: 'Dr. Kavita Singh', progress: 50 }
  ];

  for (const sub of subjects) {
    await db.run(
      `INSERT INTO subjects (id, student_id, name, code, color, professor, progress) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sub.id, 'stu_1', sub.name, sub.code, sub.color, sub.professor, sub.progress]
    );
  }

  // 3. Seed Topics
  const topics = [
    { id: 'top_os_1', subject_id: 'sub_os', name: 'Process Management', status: 'completed', module_name: 'Module 1', importance: 'medium', quiz_score: 85 },
    { id: 'top_os_2', subject_id: 'sub_os', name: 'CPU Scheduling', status: 'in-progress', module_name: 'Module 2', importance: 'high', quiz_score: 60 },
    { id: 'top_os_3', subject_id: 'sub_os', name: 'Round Robin Scheduling', status: 'not-started', module_name: 'Module 2', importance: 'high', quiz_score: 45 },
    
    { id: 'top_soa_1', subject_id: 'sub_soa', name: 'Monolithic vs Microservices', status: 'completed', module_name: 'Architecture Basics', importance: 'medium', quiz_score: 90 },
    { id: 'top_soa_2', subject_id: 'sub_soa', name: 'REST APIs & GraphQL', status: 'in-progress', module_name: 'Communication Protocols', importance: 'high', quiz_score: 70 },
    { id: 'top_soa_3', subject_id: 'sub_soa', name: 'Docker & Containerization', status: 'not-started', module_name: 'Deployment', importance: 'medium', quiz_score: null },
    { id: 'top_soa_4', subject_id: 'sub_soa', name: 'Service Discovery (Consul, Eureka)', status: 'not-started', module_name: 'Advanced Microservices', importance: 'high', quiz_score: null },
    { id: 'top_soa_5', subject_id: 'sub_soa', name: 'Event-Driven Architecture', status: 'not-started', module_name: 'Advanced Microservices', importance: 'medium', quiz_score: null },
    
    { id: 'top_alm_1', subject_id: 'sub_alm', name: 'Scrum Framework', status: 'completed', module_name: 'Agile Basics', importance: 'high', quiz_score: 80 }
  ];

  for (const topic of topics) {
    await db.run(
      `INSERT INTO topics (id, subject_id, name, status, module_name, importance, quiz_score) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [topic.id, topic.subject_id, topic.name, topic.status, topic.module_name, topic.importance, topic.quiz_score]
    );
  }

  // 4. Seed Materials (Context Engine fodder)
  const materials = [
    { id: 'mat_os_1', subject_id: 'sub_os', topic_id: 'top_os_3', title: 'OS Syllabus 2026', type: 'syllabus', content_snippet: 'Module 2 covers CPU Scheduling algorithms including FCFS, SJF, and Round Robin Scheduling. The time quantum is a critical parameter in Round Robin.' },
    { id: 'mat_os_2', subject_id: 'sub_os', topic_id: 'top_os_3', title: 'OS Course Handout', type: 'handout', content_snippet: 'Scheduling algorithms dictate the execution flow. Round Robin uses time slicing (quantum) to ensure fairness.' },
    
    { id: 'mat_soa_1', subject_id: 'sub_soa', topic_id: 'top_soa_2', title: 'SOA Syllabus', type: 'syllabus', content_snippet: 'Course covers REST API design, HTTP verbs, statelessness, and GraphQL alternatives.' },
    { id: 'mat_soa_2', subject_id: 'sub_soa', topic_id: 'top_soa_4', title: 'Service Discovery Handout', type: 'handout', content_snippet: 'Microservices need to find each other dynamically. Eureka and Consul are popular service registries used in event-driven setups.' },
    
    { id: 'mat_alm_1', subject_id: 'sub_alm', topic_id: 'top_alm_1', title: 'ALM Course Overview', type: 'syllabus', content_snippet: 'Agile Lifecycle Management involves continuous integration, sprints, and regular internal evaluations.' }
  ];

  for (const mat of materials) {
    await db.run(
      `INSERT INTO materials (id, subject_id, topic_id, title, type, content_snippet) VALUES (?, ?, ?, ?, ?, ?)`,
      [mat.id, mat.subject_id, mat.topic_id, mat.title, mat.type, mat.content_snippet]
    );
  }

  // 5. Seed Upcoming Items
  const upcoming = [
    { id: 'up_os_1', subject_id: 'sub_os', title: 'OS Internal', type: 'exam', date: 'Sep 22', priority: 'high' },
    { id: 'up_soa_1', subject_id: 'sub_soa', title: 'API Gateway Assignment', type: 'assignment', date: 'Sep 25', priority: 'medium' },
    { id: 'up_dbms_1', subject_id: 'sub_dbms', title: 'DBMS Assignment', type: 'assignment', date: 'Sep 20', priority: 'high' },
    { id: 'up_alm_1', subject_id: 'sub_alm', title: 'ALM Internal Exam', type: 'exam', date: 'Sep 20', priority: 'high' }
  ];

  for (const item of upcoming) {
    await db.run(
      `INSERT INTO upcoming_items (id, subject_id, title, type, date, priority) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.id, item.subject_id, item.title, item.type, item.date, item.priority]
    );
  }

  // 6. Seed Projects
  await db.run(
    `INSERT INTO projects (id, student_id, name, description, status, deadline, progress) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['proj_1', 'stu_1', 'AI Medical Prediction System', 'Machine-learning based medical prediction platform.', 'ON TRACK', 'Sep 30', 50]
  );

  const projectSubjects = [
    { project_id: 'proj_1', subject_id: 'sub_os' }, // AI/ML isn't natively seeded above except as topics, let's use DBMS and SOA
    { project_id: 'proj_1', subject_id: 'sub_dbms' },
    { project_id: 'proj_1', subject_id: 'sub_soa' }
  ];
  for (const ps of projectSubjects) {
    await db.run(`INSERT INTO project_subjects (project_id, subject_id) VALUES (?, ?)`, [ps.project_id, ps.subject_id]);
  }

  const projectMembers = [
    { id: 'mem_1', project_id: 'proj_1', name: 'Arjun', role: 'Team Lead', responsibility: 'ML Model, API' },
    { id: 'mem_2', project_id: 'proj_1', name: 'Priya', role: 'Member', responsibility: 'Frontend' },
    { id: 'mem_3', project_id: 'proj_1', name: 'Rahul', role: 'Member', responsibility: 'Database' }
  ];
  for (const mem of projectMembers) {
    await db.run(`INSERT INTO project_members (id, project_id, name, role, responsibility) VALUES (?, ?, ?, ?, ?)`, [mem.id, mem.project_id, mem.name, mem.role, mem.responsibility]);
  }

  const projectTasks = [
    { id: 'task_1', project_id: 'proj_1', title: 'Dataset preparation', description: '', assignee: 'Rahul', status: 'Completed', priority: 'high', deadline: 'Sep 10' },
    { id: 'task_2', project_id: 'proj_1', title: 'Model training', description: '', assignee: 'Arjun', status: 'Completed', priority: 'high', deadline: 'Sep 15' },
    { id: 'task_3', project_id: 'proj_1', title: 'Database schema', description: '', assignee: 'Rahul', status: 'Completed', priority: 'medium', deadline: 'Sep 18' },
    { id: 'task_4', project_id: 'proj_1', title: 'API integration', description: '', assignee: 'Arjun', status: 'Pending', priority: 'high', deadline: 'Sep 25' },
    { id: 'task_5', project_id: 'proj_1', title: 'Frontend integration', description: '', assignee: 'Priya', status: 'Pending', priority: 'medium', deadline: 'Sep 28' },
    { id: 'task_6', project_id: 'proj_1', title: 'Testing', description: '', assignee: 'Team', status: 'Pending', priority: 'low', deadline: 'Sep 29' }
  ];
  for (const task of projectTasks) {
    await db.run(`INSERT INTO project_tasks (id, project_id, title, description, assignee, status, priority, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [task.id, task.project_id, task.title, task.description, task.assignee, task.status, task.priority, task.deadline]);
  }

  console.log("Database seeded successfully with Academic Context!");
}

if (require.main === module) {
  seed().catch(err => {
    console.error("Seed error:", err);
  });
}

module.exports = { seed };
