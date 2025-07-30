import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiX } = FiIcons;

function AddItemModal({ isOpen, onClose, onAdd, title, type, fields = [], useDonorNameLabel = false }) {
  const [formData, setFormData] = useState({ title: '' });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialData = { title: '' };
      fields.forEach(field => {
        initialData[field.name] = field.defaultValue || '';
      });
      setFormData(initialData);
    }
  }, [isOpen, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For goal type, if updating startDate, ensure endDate is after startDate
    if (type === 'goal' && name === 'startDate' && formData.endDate) {
      const startDate = new Date(value);
      const endDate = new Date(formData.endDate);
      
      if (endDate <= startDate) {
        // Set end date to one year after start date
        const newEndDate = new Date(startDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          endDate: format(newEndDate, 'yyyy-MM-dd')
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAdd(formData.title, formData);
    }
  };

  // Format date for display in input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  // Define what fields to show based on the item type
  let displayFields = [];
  
  if (type === 'goal') {
    displayFields = fields;
  } else if (type === 'step') {
    // Remove endDate field for steps
    displayFields = fields.filter(field => field.name !== 'endDate');
  } else {
    displayFields = fields;
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div 
          className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <motion.button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiX} className="text-lg" />
            </motion.button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Essential fields (always shown) */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {useDonorNameLabel ? "Grant/Donor Name, Duration, Country" : "Title"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={useDonorNameLabel ? "E.g., UNICEF Youth Project 2023-2025, Tanzania" : `Enter title`}
                  autoFocus
                />
              </div>
            </div>
            
            {/* Advanced fields (always shown) */}
            {displayFields.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                {displayFields.map(field => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    
                    {field.type === 'date' && (
                      <input
                        type="date"
                        name={field.name}
                        value={formatDateForInput(formData[field.name] || '')}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <select
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!formData.title?.trim()}
              >
                Add
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AddItemModal;