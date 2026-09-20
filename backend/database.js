const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function getDb() {
  return open({
    filename: './academic.db',
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT,
      firstName TEXT,
      semester TEXT,
      program TEXT,
      university TEXT,
      gpa REAL
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      name TEXT,
      code TEXT,
      color TEXT,
      professor TEXT,
      progress INTEGER,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      name TEXT,
      status TEXT,
      module_name TEXT,
      importance TEXT DEFAULT 'medium',
      quiz_score INTEGER,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      topic_id TEXT,
      title TEXT,
      type TEXT, -- 'syllabus', 'handout', 'notes'
      content_snippet TEXT,
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS upcoming_items (
      id TEXT PRIMARY KEY,
      subject_id TEXT,
      title TEXT,
      type TEXT, -- 'exam', 'quiz', 'assignment', 'class'
      date TEXT,
      priority TEXT,
      source TEXT DEFAULT 'system',
      source_ref TEXT,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE IF NOT EXISTS captures (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      subject_id TEXT,
      topic_id TEXT,
      title TEXT,
      type TEXT,
      extracted_text TEXT,
      timestamp TEXT,
      confidence REAL,
      status TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      subject_id TEXT,
      type TEXT,
      priority TEXT,
      title TEXT,
      description TEXT,
      estimated_time TEXT,
      reason TEXT,
      action_label TEXT,
      deadline TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      name TEXT,
      description TEXT,
      status TEXT,
      deadline TEXT,
      progress INTEGER,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS project_subjects (
      project_id TEXT,
      subject_id TEXT,
      PRIMARY KEY (project_id, subject_id),
      FOREIGN KEY(project_id) REFERENCES projects(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE IF NOT EXISTS project_members (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      name TEXT,
      role TEXT,
      responsibility TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS project_tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      title TEXT,
      description TEXT,
      assignee TEXT,
      status TEXT,
      priority TEXT,
      deadline TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
  `);

  console.log("Database schema initialized.");
  return db;
}

module.exports = { getDb, initDb };
