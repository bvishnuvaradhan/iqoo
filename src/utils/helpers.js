export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const getRelativeTime = (dateString) => {
  // Using September 17, 2026 as the current context date
  const now = new Date('2026-09-17T21:49:53+05:30');
  const date = new Date(dateString);
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 0) {
    // Future dates
    const futureDiff = Math.abs(diffInSeconds);
    const days = Math.floor(futureDiff / 86400);
    if (days === 1) return 'Tomorrow';
    if (days > 1) return `in ${days} days`;
    
    const hours = Math.floor(futureDiff / 3600);
    if (hours > 0) return `in ${hours} hr${hours > 1 ? 's' : ''}`;
    
    const minutes = Math.floor(futureDiff / 60);
    return `in ${minutes} min${minutes > 1 ? 's' : ''}`;
  }
  
  // Past dates
  if (diffInSeconds < 60) return 'Just now';
  
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return formatDate(dateString);
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getSubjectIcon = (iconName) => {
  // Map our data string names to Lucide icon component names if necessary
  return iconName; 
};

export const getDaysUntil = (dateString) => {
  const now = new Date('2026-09-17T00:00:00');
  const target = new Date(dateString);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getConfidenceLabel = (confidence) => {
  if (confidence >= 0.9) return 'High';
  if (confidence >= 0.7) return 'Medium';
  return 'Low';
};

export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'medium':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'low':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    default:
      return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};
