import React from 'react';
import { 
  ClipboardList, UserCheck, BriefcaseBusiness, AlertTriangle, AlertCircle, ShoppingBag, Lightbulb 
} from 'lucide-react';

export default function TagsList({ selectedTag, onTagSelect }) {
  const tags = [
    { name: 'ALL', color: 'text-blue-400', icon: <ClipboardList size={15} /> },
    { name: 'PERSONAL', color: 'text-green-400', icon: <UserCheck size={15} /> },
    { name: 'WORK', color: 'text-yellow-400', icon: <BriefcaseBusiness size={15} /> },
    { name: 'IMPORTANT', color: 'text-orange-400', icon: <AlertTriangle size={15} /> },
    { name: 'URGENT', color: 'text-red-400', icon: <AlertCircle size={15} /> },
    { name: 'SHOPPING', color: 'text-emerald-400', icon: <ShoppingBag size={15} /> },
    { name: 'IDEA', color: 'text-purple-400', icon: <Lightbulb size={15} /> },
  ];

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 w-48 shadow-2xl flex flex-col gap-3 transform transition-all duration-500 hover:scale-105">
      <h3 className="text-white/60 text-xs font-bold tracking-widest mb-1">My Todo List</h3>
      {tags.map((tag, index) => (
        <div 
          key={index} 
          onClick={() => onTagSelect(tag.name)}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
            selectedTag === tag.name 
              ? 'bg-white/20 border border-white/20 shadow-md scale-102' 
              : 'bg-black/20 hover:bg-white/10 border border-transparent'
          }`}
        >
          {/* Tag Icon Color Sync with text */}
          <div className={`${tag.color} shrink-0`}>
            {tag.icon}
          </div>
          <span className="text-white font-medium text-xs tracking-wider">{tag.name}</span>
        </div>
      ))}
    </div>
  );
}