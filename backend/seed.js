require('dotenv').config();
const mongoose = require('mongoose');
const { initDb } = require('./database');
const Student = require('./models/Student');
const Subject = require('./models/Subject');
const Topic = require('./models/Topic');
const Material = require('./models/Material');
const UpcomingItem = require('./models/UpcomingItem');
const Capture = require('./models/Capture');
const Recommendation = require('./models/Recommendation');
const Project = require('./models/Project');
const ProjectTask = require('./models/ProjectTask');

async function seed() {
  await initDb();
  
  console.log("Clearing existing data...");
  await Promise.all([
    Student.deleteMany({}),
    Subject.deleteMany({}),
    Topic.deleteMany({}),
    Material.deleteMany({}),
    UpcomingItem.deleteMany({}),
    Capture.deleteMany({}),
    Recommendation.deleteMany({}),
    Project.deleteMany({}),
    ProjectTask.deleteMany({})
  ]);

  console.log("Seeding Students...");
  await Student.create({
    _id: 'stu_1', name: 'Arjun Mehta', firstName: 'Arjun', semester: '5th Semester', program: 'B.Tech CSE', university: 'abc univi', gpa: 8.72
  });

  console.log("Seeding Subjects...");
  const subjects = [
    { _id: 'sub_os', student_id: 'stu_1', name: 'Operating Systems', code: 'OS401', color: '#3b82f6', professor: 'Dr. Rajesh Kumar', progress: 42 },
    { _id: 'sub_soa', student_id: 'stu_1', name: 'SOA Programming and Microservices', code: 'SOA502', color: '#f59e0b', professor: 'Dr. Ananya Sharma', progress: 28 },
    { _id: 'sub_dbms', student_id: 'stu_1', name: 'Database Management Systems', code: 'DB402', color: '#8b5cf6', professor: 'Dr. Priya Sharma', progress: 65 },
    { _id: 'sub_alm', student_id: 'stu_1', name: 'Agile Lifecycle Management', code: 'ALM301', color: '#10b981', professor: 'Dr. Kavita Singh', progress: 50 }
  ];
  await Subject.insertMany(subjects);

  console.log("Seeding Topics...");
  const topics = [
    { _id: 'top_os_1', subject_id: 'sub_os', name: 'Process Management', status: 'completed', module_name: 'Module 1', importance: 'medium', quiz_score: 85 },
    { _id: 'top_os_2', subject_id: 'sub_os', name: 'CPU Scheduling', status: 'in-progress', module_name: 'Module 2', importance: 'high', quiz_score: 60 },
    { _id: 'top_os_3', subject_id: 'sub_os', name: 'Round Robin Scheduling', status: 'not-started', module_name: 'Module 2', importance: 'high', quiz_score: 45 },
    
    { _id: 'top_soa_1', subject_id: 'sub_soa', name: 'Monolithic vs Microservices', status: 'completed', module_name: 'Architecture Basics', importance: 'medium', quiz_score: 90 },
    { _id: 'top_soa_2', subject_id: 'sub_soa', name: 'REST APIs & GraphQL', status: 'in-progress', module_name: 'Communication Protocols', importance: 'high', quiz_score: 70 },
    { _id: 'top_soa_3', subject_id: 'sub_soa', name: 'Docker & Containerization', status: 'not-started', module_name: 'Deployment', importance: 'medium', quiz_score: null },
    { _id: 'top_soa_4', subject_id: 'sub_soa', name: 'Service Discovery (Consul, Eureka)', status: 'not-started', module_name: 'Advanced Microservices', importance: 'high', quiz_score: null },
    { _id: 'top_soa_5', subject_id: 'sub_soa', name: 'Event-Driven Architecture', status: 'not-started', module_name: 'Advanced Microservices', importance: 'medium', quiz_score: null },
    
    { _id: 'top_alm_1', subject_id: 'sub_alm', name: 'Scrum Framework', status: 'completed', module_name: 'Agile Basics', importance: 'high', quiz_score: 80 }
  ];
  await Topic.insertMany(topics);

  console.log("Seeding Materials...");
  const materials = [
    { _id: 'mat_os_1', subject_id: 'sub_os', topic_id: 'top_os_3', title: 'OS Syllabus 2026', type: 'syllabus', content_snippet: 'Module 2 covers CPU Scheduling algorithms including FCFS, SJF, and Round Robin Scheduling. The time quantum is a critical parameter in Round Robin.' },
    { _id: 'mat_os_2', subject_id: 'sub_os', topic_id: 'top_os_3', title: 'OS Course Handout', type: 'handout', content_snippet: 'Scheduling algorithms dictate the execution flow. Round Robin uses time slicing (quantum) to ensure fairness.' },
    { _id: 'mat_soa_1', subject_id: 'sub_soa', topic_id: 'top_soa_2', title: 'SOA Syllabus', type: 'syllabus', content_snippet: 'Course covers REST API design, HTTP verbs, statelessness, and GraphQL alternatives.' },
    { _id: 'mat_soa_2', subject_id: 'sub_soa', topic_id: 'top_soa_4', title: 'Service Discovery Handout', type: 'handout', content_snippet: 'Microservices need to find each other dynamically. Eureka and Consul are popular service registries used in event-driven setups.' },
    { _id: 'mat_alm_1', subject_id: 'sub_alm', topic_id: 'top_alm_1', title: 'ALM Course Overview', type: 'syllabus', content_snippet: 'Agile Lifecycle Management involves continuous integration, sprints, and regular internal evaluations.' }
  ];
  await Material.insertMany(materials);

  console.log("Seeding Upcoming Items...");
  const upcoming = [
    { _id: 'up_os_1', subject_id: 'sub_os', title: 'OS Internal', type: 'exam', date: 'Sep 22', priority: 'high' },
    { _id: 'up_soa_1', subject_id: 'sub_soa', title: 'API Gateway Assignment', type: 'assignment', date: 'Sep 25', priority: 'medium' },
    { _id: 'up_dbms_1', subject_id: 'sub_dbms', title: 'DBMS Assignment', type: 'assignment', date: 'Sep 20', priority: 'high' },
    { _id: 'up_alm_1', subject_id: 'sub_alm', title: 'ALM Internal Exam', type: 'exam', date: 'Sep 20', priority: 'high' }
  ];
  await UpcomingItem.insertMany(upcoming);

  console.log("Seeding Projects...");
  const project = new Project({
    _id: 'proj_1',
    student_id: 'stu_1',
    name: 'AI Medical Prediction System',
    description: 'Machine-learning based medical prediction platform.',
    status: 'ON TRACK',
    deadline: 'Sep 30',
    progress: 50,
    subjects: ['sub_dbms', 'sub_soa'],
    members: [
      { _id: 'mem_1', name: 'Arjun Mehta', role: 'Backend Lead', responsibility: 'API design & DB architecture' },
      { _id: 'mem_2', name: 'Priya Sharma', role: 'ML Engineer', responsibility: 'Model training & evaluation' },
      { _id: 'mem_3', name: 'Rahul Verma', role: 'Frontend Developer', responsibility: 'Dashboard UI & integration' }
    ]
  });
  await project.save();

  console.log("Seeding Project Tasks...");
  const tasks = [
    { _id: 'tsk_1', project_id: 'proj_1', title: 'Design Database Schema', description: 'Create ER diagrams and define collections for patient records.', assignee: 'Arjun Mehta', status: 'Completed', priority: 'high', deadline: 'Sep 5' },
    { _id: 'tsk_2', project_id: 'proj_1', title: 'Train initial ML model', description: 'Use Random Forest for initial baseline predictions.', assignee: 'Priya Sharma', status: 'Completed', priority: 'high', deadline: 'Sep 10' },
    { _id: 'tsk_3', project_id: 'proj_1', title: 'API integration', description: 'Connect frontend dashboard with ML endpoints.', assignee: 'Rahul Verma', status: 'Pending', priority: 'high', deadline: 'Sep 27' }
  ];
  await ProjectTask.insertMany(tasks);

  console.log("Seeding Recommendations...");
  const recommendations = [
    { _id: 'rec_1', student_id: 'stu_1', subject_id: 'sub_soa', type: 'STUDY', priority: 'high', title: 'Review Service Discovery', description: 'Your progress in SOA is lagging. Focus on Eureka and Consul concepts.', estimated_time: '2 hours', reason: 'Upcoming API Gateway assignment relies heavily on this.', action_label: 'Start Module 3', deadline: 'Sep 24' },
    { _id: 'rec_2', student_id: 'stu_1', subject_id: 'sub_os', type: 'PRACTICE', priority: 'medium', title: 'Practice Round Robin Scenarios', description: 'Your quiz score on CPU Scheduling was borderline. Time quantums often trick students.', estimated_time: '45 mins', reason: 'OS Internal exam in 2 days.', action_label: 'Take Practice Quiz', deadline: 'Sep 21' }
  ];
  await Recommendation.insertMany(recommendations);

  console.log("Database seeded successfully.");
}

module.exports = { seed };
if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
