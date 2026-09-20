import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ name, size = 'md', src, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const combinedClasses = `rounded-full flex items-center justify-center font-semibold overflow-hidden shrink-0 ${sizes[size] || sizes.md} ${className}`;

  if (src) {
    return (
      <div className={combinedClasses}>
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  const initials = getInitials(name || 'User Name');

  return (
    <div className={`${combinedClasses} bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-inner`}>
      {initials}
    </div>
  );
};

export default Avatar;
