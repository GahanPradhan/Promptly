import React from 'react';
import { Sparkles, Share2, MessageSquare } from 'lucide-react';

const UserPrompts = ({ prompt }) => {
  return (
    <div className="relative bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
            {prompt.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {prompt.input}
          </p>
        </div>
        <button className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-50 group">
          <Share2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {prompt.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{prompt.aiModel}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">

          <time className="text-gray-400">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </div>
  );
};

export default UserPrompts;