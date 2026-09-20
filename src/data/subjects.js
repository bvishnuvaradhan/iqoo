export const subjects = [
  {
    id: 's1',
    name: 'Operating Systems',
    code: 'OS401',
    color: '#3b82f6',
    icon: 'Terminal',
    professor: 'Dr. Rajesh Kumar',
    progress: 45,
    totalChapters: 8,
    completedChapters: 3,
    nextClass: '2026-09-18T10:00:00',
    room: 'SJT 401',
    pendingTasks: 2,
    recentCaptures: 5,
    topics: [
      { name: 'Process Management', status: 'completed' },
      { name: 'CPU Scheduling', status: 'in-progress', subtopics: [
        { name: 'FCFS', status: 'completed' },
        { name: 'Round Robin', status: 'in-progress' },
        { name: 'SJF', status: 'not-started' }
      ]},
      { name: 'Memory Management', status: 'not-started' },
      { name: 'File Systems', status: 'not-started' }
    ],
    upcomingItems: [
      { type: 'Exam', title: 'Mid-term Exam', date: '2026-09-25T14:00:00', priority: 'high' },
      { type: 'Quiz', title: 'Chapter 2 Quiz', date: '2026-09-19T10:00:00', priority: 'medium' }
    ]
  },
  {
    id: 's2',
    name: 'Database Management Systems',
    code: 'DB402',
    color: '#8b5cf6',
    icon: 'Database',
    professor: 'Dr. Priya Sharma',
    progress: 55,
    totalChapters: 6,
    completedChapters: 3,
    nextClass: '2026-09-18T11:30:00',
    room: 'SJT 302',
    pendingTasks: 1,
    recentCaptures: 3,
    topics: [
      { name: 'ER Modeling', status: 'completed' },
      { name: 'Normalization', status: 'completed' },
      { name: 'SQL Queries', status: 'in-progress' },
      { name: 'Transactions', status: 'not-started' }
    ],
    upcomingItems: [
      { type: 'Assignment', title: 'SQL Queries Assignment', date: '2026-09-20T23:59:00', priority: 'high' },
      { type: 'Lab', title: 'Lab Evaluation 1', date: '2026-09-24T14:00:00', priority: 'high' }
    ]
  },
  {
    id: 's3',
    name: 'AI/ML',
    code: 'AI403',
    color: '#06b6d4',
    icon: 'BrainCircuit',
    professor: 'Dr. Sanjay Patel',
    progress: 30,
    totalChapters: 10,
    completedChapters: 3,
    nextClass: '2026-09-18T14:00:00',
    room: 'TT 105',
    pendingTasks: 3,
    recentCaptures: 8,
    topics: [
      { name: 'Linear Regression', status: 'completed' },
      { name: 'Classification', status: 'completed' },
      { name: 'Neural Networks', status: 'in-progress' },
      { name: 'CNN', status: 'not-started' }
    ],
    upcomingItems: [
      { type: 'Project', title: 'PBL Phase 1 Submission', date: '2026-09-28T23:59:00', priority: 'high' },
      { type: 'Exam', title: 'Mid-sem Exam', date: '2026-10-02T10:00:00', priority: 'high' }
    ]
  },
  {
    id: 's4',
    name: 'Software Architecture',
    code: 'SA404',
    color: '#f59e0b',
    icon: 'LayoutTemplate',
    professor: 'Dr. Meena Iyer',
    progress: 40,
    totalChapters: 7,
    completedChapters: 2,
    nextClass: '2026-09-19T09:00:00',
    room: 'PRP 201',
    pendingTasks: 2,
    recentCaptures: 2,
    topics: [
      { name: 'SOLID Principles', status: 'completed' },
      { name: 'Design Patterns', status: 'in-progress' },
      { name: 'Microservices', status: 'not-started' },
      { name: 'System Design', status: 'not-started' }
    ],
    upcomingItems: [
      { type: 'Quiz', title: 'Pop Quiz 2', date: '2026-09-19T09:00:00', priority: 'medium' },
      { type: 'Assignment', title: 'Design Pattern Implementation', date: '2026-09-26T23:59:00', priority: 'medium' }
    ]
  },
  {
    id: 's5',
    name: 'Web Technologies',
    code: 'WT405',
    color: '#10b981',
    icon: 'Globe',
    professor: 'Dr. Amit Singh',
    progress: 60,
    totalChapters: 8,
    completedChapters: 5,
    nextClass: '2026-09-20T10:00:00',
    room: 'SJT 110',
    pendingTasks: 1,
    recentCaptures: 4,
    topics: [
      { name: 'HTML/CSS', status: 'completed' },
      { name: 'JavaScript', status: 'completed' },
      { name: 'React', status: 'in-progress' },
      { name: 'REST APIs', status: 'not-started' },
      { name: 'Node.js', status: 'not-started' }
    ],
    upcomingItems: [
      { type: 'Lab', title: 'Frontend Lab Eval', date: '2026-09-22T14:00:00', priority: 'high' },
      { type: 'Project', title: 'Course Project Proposal', date: '2026-09-30T23:59:00', priority: 'medium' }
    ]
  }
];
