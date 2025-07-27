import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format, addDays, startOfDay } from 'date-fns';

const { FiArrowLeft, FiCheck, FiRefreshCw, FiDownload, FiShare2, FiCalendar, FiClock, FiUsers, FiTarget } = FiIcons;

function MicroPlan() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load child and plan data from localStorage
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    
    const foundChild = children.find(c => c.id === childId);
    const foundPlan = plans.find(p => p.childId === childId);
    
    if (foundChild && foundPlan) {
      setChild(foundChild);
      setPlan(foundPlan);
    }
    
    setLoading(false);
  }, [childId]);

  const toggleItemCompletion = (itemId) => {
    if (!plan) return;
    
    const updatedPlan = {
      ...plan,
      items: plan.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : null
            }
          : item
      )
    };
    
    setPlan(updatedPlan);
    
    // Update localStorage
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const updatedPlans = plans.map(p => (p.id === plan.id ? updatedPlan : p));
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
  };

  const replaceItem = (itemId) => {
    // In a real app, this would call the API to get the next best candidate
    alert('Replace functionality would call the API to get alternative suggestions');
  };

  const generatePDF = () => {
    // In a real app, this would generate a PDF using pdfmake
    alert('PDF generation would be implemented here');
  };

  const shareViaWhatsApp = () => {
    const completedCount = plan?.items?.filter(item => item.completed).length || 0;
    const totalCount = plan?.items?.length || 0;
    const text = `${child?.name}'s 14-Day Plan Progress: ${completedCount}/${totalCount} actions completed!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!child || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Plan not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Back to Board
          </button>
        </div>
      </div>
    );
  }

  const startDate = startOfDay(new Date());
  const completedCount = plan.items.filter(item => item.completed).length;
  const progressPercentage = (completedCount / plan.items.length) * 100;

  // Group items by day
  const itemsByDay = plan.items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiArrowLeft} />
              Back to Board
            </motion.button>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={generatePDF}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download PDF"
              >
                <SafeIcon icon={FiDownload} className="text-lg" />
              </motion.button>
              <motion.button
                onClick={shareViaWhatsApp}
                className="p-2 text-gray-600 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Share via WhatsApp"
              >
                <SafeIcon icon={FiShare2} className="text-lg" />
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616330596-WWSC%20Logo%20Transparent.png" 
                alt="WWSC Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {child.name}'s 14-Day Micro-Plan
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiCalendar} />
                    <span>Started {format(new Date(plan.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiTarget} />
                    <span>{plan.items.length} actions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {completedCount}/{plan.items.length}
              </div>
              <div className="text-sm text-gray-600">completed</div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  className="bg-primary-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {Array.from({ length: 14 }, (_, i) => i + 1).map(day => {
            const dayItems = itemsByDay[day] || [];
            const dayDate = addDays(startDate, day - 1);
            return (
              <motion.div
                key={day}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: day * 0.05 }}
              >
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Day {day}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(dayDate, 'EEEE, MMMM d')}
                      </p>
                    </div>
                    {dayItems.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                          {dayItems.filter(item => item.completed).length}/{dayItems.length} done
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {dayItems.length > 0 ? (
                    <div className="space-y-4">
                      {dayItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`border rounded-xl p-4 transition-all ${
                            item.completed
                              ? 'bg-success-50 border-success-200'
                              : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start gap-4">
                            <motion.button
                              onClick={() => toggleItemCompletion(item.id)}
                              className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                item.completed
                                  ? 'bg-success-500 border-success-500 text-white'
                                  : 'border-gray-300 hover:border-success-400'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {item.completed && <SafeIcon icon={FiCheck} className="text-sm" />}
                            </motion.button>
                            <div className="flex-1">
                              <h4
                                className={`font-medium mb-2 ${
                                  item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}
                              >
                                {item.title}
                              </h4>
                              {item.reasons && item.reasons.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-1">Why this action:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.reasons.map((reason, reasonIndex) => (
                                      <span
                                        key={reasonIndex}
                                        className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-lg text-xs"
                                      >
                                        {reason}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.meta && (
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {item.meta.estEffortMins && (
                                    <div className="flex items-center gap-1">
                                      <SafeIcon icon={FiClock} />
                                      <span>
                                        {item.meta.estEffortMins < 60
                                          ? `${item.meta.estEffortMins}m`
                                          : `${Math.floor(item.meta.estEffortMins / 60)}h${
                                              item.meta.estEffortMins % 60 > 0
                                                ? ` ${item.meta.estEffortMins % 60}m`
                                                : ''
                                            }`}
                                      </span>
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
                                      <span>Materials: {item.meta.needs.join(', ')}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <motion.button
                              onClick={() => replaceItem(item.id)}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Replace with alternative"
                            >
                              <SafeIcon icon={FiRefreshCw} className="text-sm" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No actions scheduled for this day</p>
                      <p className="text-xs mt-1">Rest day or continue previous actions</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 bg-white border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Interactive Street Outreach & Rescue Guide © {new Date().getFullYear()} Worldwide Street Children</p>
      </div>
    </div>
  );
}

export default MicroPlan;