export const schedule = {
  today: [
    {
      id: 'sch1',
      subject: 'Software Architecture',
      type: 'lecture',
      room: 'PRP 201',
      startTime: '09:00',
      endTime: '10:30',
      professor: 'Dr. Meena Iyer'
    },
    {
      id: 'sch2',
      subject: 'Operating Systems',
      type: 'tutorial',
      room: 'SJT 401',
      startTime: '11:00',
      endTime: '12:00',
      professor: 'Dr. Rajesh Kumar'
    },
    {
      id: 'sch3',
      subject: 'Lunch Break',
      type: 'break',
      room: 'Food Court',
      startTime: '12:00',
      endTime: '13:30',
      professor: null
    },
    {
      id: 'sch4',
      subject: 'Database Management Systems',
      type: 'lab',
      room: 'SJT 305',
      startTime: '14:00',
      endTime: '15:30',
      professor: 'Dr. Priya Sharma'
    }
  ],
  week: [
    {
      day: 'Monday',
      classes: [
        { subject: 'AI/ML', type: 'lecture', startTime: '10:00', endTime: '11:30', room: 'TT 105' },
        { subject: 'Web Technologies', type: 'lecture', startTime: '14:00', endTime: '15:30', room: 'SJT 110' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { subject: 'Operating Systems', type: 'lecture', startTime: '09:00', endTime: '10:30', room: 'SJT 401' },
        { subject: 'Database Management Systems', type: 'lecture', startTime: '11:00', endTime: '12:30', room: 'SJT 302' },
        { subject: 'Software Architecture', type: 'lab', startTime: '14:00', endTime: '16:00', room: 'PRP 205' }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { subject: 'Software Architecture', type: 'lecture', startTime: '09:00', endTime: '10:30', room: 'PRP 201' },
        { subject: 'Operating Systems', type: 'tutorial', startTime: '11:00', endTime: '12:00', room: 'SJT 401' },
        { subject: 'Database Management Systems', type: 'lab', startTime: '14:00', endTime: '15:30', room: 'SJT 305' }
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { subject: 'Web Technologies', type: 'lab', startTime: '09:00', endTime: '11:00', room: 'SJT 115' },
        { subject: 'AI/ML', type: 'lecture', startTime: '11:30', endTime: '13:00', room: 'TT 105' }
      ]
    },
    {
      day: 'Friday',
      classes: [
        { subject: 'Database Management Systems', type: 'tutorial', startTime: '10:00', endTime: '11:00', room: 'SJT 302' },
        { subject: 'Operating Systems', type: 'lecture', startTime: '11:30', endTime: '13:00', room: 'SJT 401' },
        { subject: 'AI/ML', type: 'lab', startTime: '14:00', endTime: '16:00', room: 'TT 110' }
      ]
    }
  ]
};
