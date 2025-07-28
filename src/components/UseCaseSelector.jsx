import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiBookOpen, FiCalendar, FiMapPin, FiUsers, FiFileText, FiEdit, FiHeart, FiTool, FiSettings, FiX, FiCheck, FiArrowRight } = FiIcons;

const USE_CASES = [
  {
    id: 'goal-to-action',
    title: 'Goal-to-Action Planner',
    icon: FiTarget,
    description: 'Break down big goals into actionable steps',
    columns: {
      goals: 'Big Goals',
      steps: 'Milestones',
      tasks: 'Metrics & Targets',
      initiatives: 'Action Steps'
    },
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'skills-practice',
    title: 'Skills-to-Practice Planner',
    icon: FiBookOpen,
    description: 'Master new skills through structured practice',
    columns: {
      goals: 'Skill Goals',
      steps: 'Modules',
      tasks: 'Lessons',
      initiatives: 'Practice Tasks'
    },
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'event-workshop',
    title: 'Event / Workshop Planner',
    icon: FiCalendar,
    description: 'Organize multi-day events with detailed sessions',
    columns: {
      goals: 'Event Day',
      steps: 'Modules',
      tasks: 'Sessions',
      initiatives: 'Logistics & Tasks'
    },
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'trip-planner',
    title: 'Trip Planner',
    icon: FiMapPin,
    description: 'Plan your perfect trip with all details covered',
    columns: {
      goals: 'Destinations',
      steps: 'Main Objectives',
      tasks: 'Activities',
      initiatives: 'Logistics & Tasks'
    },
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'workshop-planner',
    title: 'Workshop Planner',
    icon: FiUsers,
    description: 'Design engaging workshops with clear objectives',
    columns: {
      goals: 'Key Themes',
      steps: 'Learning Objectives',
      tasks: 'Exercises/Activities',
      initiatives: 'Steps'
    },
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'meeting-minutes',
    title: 'Meeting Minutes',
    icon: FiFileText,
    description: 'Track meetings, decisions and follow-up actions',
    columns: {
      goals: 'Meetings',
      steps: 'Agenda Items',
      tasks: 'Notes & Decisions',
      initiatives: 'Action Items'
    },
    color: 'from-gray-500 to-gray-700'
  },
  {
    id: 'article-writing',
    title: 'Article-Writing',
    icon: FiEdit,
    description: 'Structure your writing with supporting evidence',
    columns: {
      goals: 'Articles',
      steps: 'Top-3 Claims / Points',
      tasks: 'Key Arguments',
      initiatives: 'Support & Criticisms'
    },
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'life-area-planning',
    title: 'Life Area Planning',
    icon: FiHeart,
    description: 'Balance and improve different areas of your life',
    columns: {
      goals: 'Life Domains',
      steps: 'Top Focus Areas',
      tasks: 'Broad Strategy',
      initiatives: 'Actions & Habits'
    },
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'problem-solver',
    title: 'Problem-Solver',
    icon: FiTool,
    description: 'Break down problems into actionable solutions',
    columns: {
      goals: 'Problems',
      steps: 'Solution Themes',
      tasks: 'Specific Interventions',
      initiatives: 'Next Actions'
    },
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'custom-flow',
    title: 'Your Custom Flow',
    icon: FiSettings,
    description: 'Create your own unique planning structure',
    columns: {
      goals: '',
      steps: '',
      tasks: '',
      initiatives: ''
    },
    color: 'from-violet-500 to-purple-600',
    isCustom: true
  }
];

function UseCaseSelector({ isOpen, onClose, onSelectUseCase }) {
  const [selectedCase, setSelectedCase] = useState(USE_CASES[0]);
  const [customColumns, setCustomColumns] = useState({
    goals: '',
    steps: '',
    tasks: '',
    initiatives: ''
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleSelectUseCase = (useCase) => {
    setSelectedCase(useCase);
    if (useCase.isCustom) {
      setShowCustomForm(true);
    } else {
      setShowCustomForm(false);
    }
  };

  const handleSubmit = () => {
    if (selectedCase.isCustom) {
      // Submit custom columns if they're not empty
      const customColumnValues = {
        goals: customColumns.goals || 'Column 1',
        steps: customColumns.steps || 'Column 2',
        tasks: customColumns.tasks || 'Column 3',
        initiatives: customColumns.initiatives || 'Column 4'
      };
      onSelectUseCase({...selectedCase, columns: customColumnValues});
    } else {
      // Submit selected use case
      onSelectUseCase(selectedCase);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div 
        className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choose Your Planning Template</h2>
            <p className="text-sm text-gray-600">Select a template that best fits your planning needs</p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!showCustomForm ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="use-case-grid"
              >
                {USE_CASES.map((useCase) => (
                  <motion.div
                    key={useCase.id}
                    className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCase.id === useCase.id 
                        ? 'border-primary-500 ring-2 ring-primary-300 shadow-md' 
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleSelectUseCase(useCase)}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${useCase.color}`} />
                    <div className="p-5 relative z-10">
                      {/* Selected check indicator */}
                      {selectedCase.id === useCase.id && (
                        <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
                          <SafeIcon icon={FiCheck} className="text-sm" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${useCase.color} text-white`}>
                          <SafeIcon icon={useCase.icon} className="text-xl" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                      {!useCase.isCustom && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(useCase.columns).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">
                              {value}
                            </div>
                          ))}
                        </div>
                      )}
                      {useCase.isCustom && (
                        <div className="text-center mt-2">
                          <span className="text-primary-600 text-sm">Create your own columns →</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="custom-form"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Column Headers</h3>
                  <p className="text-sm text-gray-600">Name each column in your custom planning flow</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column 1 (leftmost)
                    </label>
                    <input
                      type="text"
                      value={customColumns.goals}
                      onChange={(e) => setCustomColumns({...customColumns, goals: e.target.value})}
                      placeholder="e.g., Projects, Areas, Categories..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column 2
                    </label>
                    <input
                      type="text"
                      value={customColumns.steps}
                      onChange={(e) => setCustomColumns({...customColumns, steps: e.target.value})}
                      placeholder="e.g., Components, Sections, Phases..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column 3
                    </label>
                    <input
                      type="text"
                      value={customColumns.tasks}
                      onChange={(e) => setCustomColumns({...customColumns, tasks: e.target.value})}
                      placeholder="e.g., Tasks, Elements, Items..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column 4 (rightmost)
                    </label>
                    <input
                      type="text"
                      value={customColumns.initiatives}
                      onChange={(e) => setCustomColumns({...customColumns, initiatives: e.target.value})}
                      placeholder="e.g., Actions, Details, Sub-tasks..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <motion.button 
                    onClick={() => setShowCustomForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Templates
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            You can change this later in settings
          </div>
          <motion.button 
            onClick={handleSubmit}
            className="px-5 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2 hover:bg-primary-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <SafeIcon icon={FiArrowRight} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default UseCaseSelector;