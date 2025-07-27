import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { tagOptions } from '../data/sampleData';

const { FiX, FiCheck, FiClock, FiUsers, FiPackage, FiTarget } = FiIcons;

function DetailDrawer({ isOpen, onClose, task, initiatives, onToggleCompletion }) {
  if (!task) return null;

  const getTagColor = (tag) => {
    const tagOption = tagOptions.find(opt => opt.value === tag);
    return tagOption?.color || 'bg-gray-100 text-gray-700';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Quick task';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  };

  const getClosenessLabel = (level) => {
    const labels = {
      1: 'Stranger',
      2: 'New relationship',
      3: 'Warming up',
      4: 'Trusted relationship'
    };
    return labels[level] || 'Any level';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <SafeIcon icon={FiTarget} className="text-primary-600 text-lg" />
                    <span className="text-sm font-medium text-primary-600">Target</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {task.title}
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Action Steps ({initiatives?.length || 0})
                </h3>
                <div className="space-y-3">
                  {initiatives?.map((initiative, index) => (
                    <motion.div
                      key={initiative.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.button
                          onClick={() => onToggleCompletion(initiative.id)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            initiative.completed
                              ? 'bg-success-500 border-success-500 text-white'
                              : 'border-gray-300 hover:border-success-400'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {initiative.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
                        </motion.button>
                        <div className="flex-1">
                          <h4
                            className={`font-medium mb-2 ${
                              initiative.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {initiative.title}
                          </h4>
                          {initiative.meta && (
                            <div className="space-y-3">
                              {/* Tags */}
                              {initiative.meta.tags && initiative.meta.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {initiative.meta.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getTagColor(
                                        tag
                                      )}`}
                                    >
                                      {tag.replace(/^(Closeness|Age|TimeImpact|Materials):/, '')}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Meta details */}
                              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                {initiative.meta.estEffortMins && (
                                  <div className="flex items-center gap-2">
                                    <SafeIcon icon={FiClock} className="text-gray-400" />
                                    <span>{formatDuration(initiative.meta.estEffortMins)}</span>
                                  </div>
                                )}
                                {initiative.meta.closenessMin && (
                                  <div className="flex items-center gap-2">
                                    <SafeIcon icon={FiUsers} className="text-gray-400" />
                                    <span>Requires: {getClosenessLabel(initiative.meta.closenessMin)}</span>
                                  </div>
                                )}
                                {initiative.meta.needs && initiative.meta.needs.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <SafeIcon icon={FiPackage} className="text-gray-400 mt-0.5" />
                                    <div>
                                      <div className="font-medium text-gray-700 mb-1">Materials needed:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {initiative.meta.needs.map((need, needIndex) => (
                                          <span
                                            key={needIndex}
                                            className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                                          >
                                            {need}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips section */}
              <div className="bg-primary-50 rounded-xl p-4">
                <h4 className="font-semibold text-primary-900 mb-2">💡 Why this works</h4>
                <p className="text-sm text-primary-800">
                  These action steps are designed to be practical and immediately actionable. Each step builds trust and addresses specific challenges that street children face when transitioning to center life.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DetailDrawer;