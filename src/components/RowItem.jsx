import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { tagOptions } from '../data/sampleData';

const { FiCheck, FiChevronRight, FiClock, FiUsers, FiPackage } = FiIcons;

function RowItem({ 
  item, 
  onSelect, 
  onToggleCompletion, 
  isSelected, 
  type, 
  isLeaf = false,
  index 
}) {
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleCompletion();
  };

  const getTagColor = (tag) => {
    const tagOption = tagOptions.find(opt => opt.value === tag);
    return tagOption?.color || 'bg-gray-100 text-gray-700';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      className={`p-3 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? 'bg-primary-50 border-primary-200' : ''
      }`}
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ x: 2 }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          onClick={handleCheckboxClick}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            item.completed
              ? 'bg-success-500 border-success-500 text-white'
              : 'border-gray-300 hover:border-success-400'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {item.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium leading-relaxed ${
              item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {item.title}
            </h4>
            
            {!isLeaf && (
              <SafeIcon 
                icon={FiChevronRight} 
                className={`text-gray-400 transition-transform ${
                  isSelected ? 'rotate-90' : ''
                }`}
              />
            )}
          </div>

          {/* Meta information for initiatives */}
          {type === 'initiative' && item.meta && (
            <div className="mt-2 space-y-1">
              {/* Tags */}
              {item.meta.tags && item.meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.meta.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag.replace(/^(Closeness|Age|TimeImpact|Materials):/, '')}
                    </span>
                  ))}
                  {item.meta.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{item.meta.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Additional meta info */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {item.meta.estEffortMins && (
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiClock} />
                    <span>{formatDuration(item.meta.estEffortMins)}</span>
                  </div>
                )}
                
                {item.meta.closenessMin && (
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiUsers} />
                    <span>Level {item.meta.closenessMin}</span>
                  </div>
                )}
                
                {item.meta.needs && item.meta.needs.length > 0 && (
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiPackage} />
                    <span>{item.meta.needs.length} items</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default RowItem;