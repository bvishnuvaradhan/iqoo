import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Clock, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import Badge from '../common/Badge';

export default function TaskList() {
  const { recommendations, subjects } = useApp();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete OS Scheduling Assignment', subject: 'OS', color: '#3b82f6', due: 'Today, 11:59 PM', priority: 'high', est: '1.5h', done: false },
    { id: 2, title: 'Review DBMS Normalization', subject: 'DBMS', color: '#8b5cf6', due: 'Tomorrow', priority: 'high', est: '45m', done: false },
    { id: 3, title: 'Study Design Patterns', subject: 'SA', color: '#06b6d4', due: 'Sep 19', priority: 'medium', est: '2h', done: false },
    { id: 4, title: 'React Hooks Practice', subject: 'WT', color: '#10b981', due: 'Sep 21', priority: 'low', est: '1h', done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const highPriority = tasks.filter(t => t.priority === 'high');
  const others = tasks.filter(t => t.priority !== 'high');

  const TaskCard = ({ task }) => (
    <motion.div variants={fadeInUp} className={`glass-card p-4 rounded-xl flex items-start gap-3 transition-opacity ${task.done ? 'opacity-50' : 'opacity-100'}`}>
      <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-accent-success border-accent-success' : 'border-white/30'}`}>
        {task.done && <div className="w-2 h-2 bg-white rounded-full" />}
      </button>
      <div className="flex-1">
        <h4 className={`text-sm font-medium text-white mb-2 ${task.done ? 'line-through text-white/50' : ''}`}>{task.title}</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="default" size="sm" style={{ backgroundColor: `${task.color}20`, color: task.color }}>
            {task.subject}
          </Badge>
          <div className="flex items-center gap-1 text-white/50">
            <Calendar size={12} />
            <span className={task.due.includes('Today') ? 'text-accent-danger' : ''}>{task.due}</span>
          </div>
          <div className="flex items-center gap-1 text-white/50">
            <Clock size={12} />
            <span>{task.est}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-2 mb-2 text-white">
        <ListTodo size={24} className="text-ai-blue" />
        <h2 className="text-xl font-bold">Priority Tasks</h2>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-accent-danger flex items-center gap-2">
          High Priority <Badge variant="danger" size="sm" className="ml-1">{highPriority.length}</Badge>
        </h3>
        {highPriority.map(task => <TaskCard key={task.id} task={task} />)}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-sm font-medium text-white/60">Coming Up</h3>
        {others.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </motion.div>
  );
}
