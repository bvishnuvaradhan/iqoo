export const recommendations = [
  {
    id: 'r1',
    type: 'study',
    priority: 'high',
    title: 'Review Round Robin Scheduling',
    description: 'You have a quiz on Sep 19. Your recent capture indicates you were learning this topic.',
    subject: 'Operating Systems',
    estimatedTime: '45 min',
    reason: 'Based on upcoming quiz and recent camera capture of Gantt chart.',
    deadline: '2026-09-19T10:00:00',
    actionLabel: 'Start Review'
  },
  {
    id: 'r2',
    type: 'assignment',
    priority: 'high',
    title: 'Start SQL Queries Assignment',
    description: 'Deadline updated to Sep 20 based on your voice note. You have completed 0/5 sections.',
    subject: 'Database Management Systems',
    estimatedTime: '2 hrs',
    reason: 'Upcoming deadline in 3 days. Voice note capture verified deadline extension.',
    deadline: '2026-09-20T23:59:00',
    actionLabel: 'Open Assignment'
  },
  {
    id: 'r3',
    type: 'prepare',
    priority: 'medium',
    title: 'Prep for Neural Networks Lab',
    description: 'Review the architecture diagram you saved before tomorrows class.',
    subject: 'AI/ML',
    estimatedTime: '30 min',
    reason: 'Class scheduled for tomorrow. Topic aligns with recent screenshot capture.',
    actionLabel: 'View Notes'
  },
  {
    id: 'r4',
    type: 'review',
    priority: 'medium',
    title: 'Synthesize React Notes',
    description: 'Convert your handwritten notes on useEffect into digital flashcards.',
    subject: 'Web Technologies',
    estimatedTime: '20 min',
    reason: 'Spaced repetition schedule suggests reviewing notes taken 3 days ago.',
    actionLabel: 'Create Cards'
  },
  {
    id: 'r5',
    type: 'collaborate',
    priority: 'low',
    title: 'Schedule Team Sync',
    description: 'Follow up on the project ideas discussion for Web Tech.',
    subject: 'Web Technologies',
    estimatedTime: '10 min',
    reason: 'No activity on project planning since the meeting 4 days ago.',
    actionLabel: 'Draft Message'
  },
  {
    id: 'r6',
    type: 'study',
    priority: 'low',
    title: 'Read Design Patterns Handout',
    description: 'Cover Singleton and Factory patterns before the next quiz.',
    subject: 'Software Architecture',
    estimatedTime: '1 hr',
    reason: 'Quiz coming up in 2 days. Handout document captured but not reviewed yet.',
    deadline: '2026-09-19T09:00:00',
    actionLabel: 'Open Document'
  }
];
