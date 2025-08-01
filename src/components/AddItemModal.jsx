import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiX } = FiIcons;

function AddItemModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onEdit,
  title, 
  type, 
  fields = [], 
  useDonorNameLabel = false,
  editingItem = null,
  isEditMode = false
}) {
  const [formData, setFormData] = useState({ title: '' });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editingItem) {
        // Pre-populate form with existing item data
        const initialData = { title: editingItem.title };
        fields.forEach(field => {
          initialData[field.name] = editingItem[field.name] || field.defaultValue || '';
        });
        setFormData(initialData);
      } else {
        // New item - use defaults
        const initialData = { title: '' };
        fields.forEach(field => {
          initialData[field.name] = field.defaultValue || '';
        });
        setFormData(initialData);
      }
    }
  }, [isOpen, fields, isEditMode, editingItem]);

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
    if (canSubmit()) {
      if (isEditMode) {
        onEdit(formData.title, formData);
      } else {
        onAdd(formData.title, formData);
      }
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

  // Check if all required fields are filled
  const canSubmit = () => {
    // Title is always required
    if (!formData.title?.trim()) return false;
    
    // Check all fields are filled for non-edit mode or edit mode
    for (const field of fields) {
      const value = formData[field.name];
      if (!value || (typeof value === 'string' && !value.trim())) {
        return false;
      }
    }
    
    return true;
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

  // Get minimum date for end date picker (should be after start date)
  const getMinEndDate = () => {
    if (type === 'goal' && formData.startDate) {
      const startDate = new Date(formData.startDate);
      startDate.setDate(startDate.getDate() + 1); // Add one day to start date
      return format(startDate, 'yyyy-MM-dd');
    }
    return '';
  };

  // Check if field should be in two-column layout (for goal start/end dates)
  const isDateField = (field) => {
    return type === 'goal' && (field.name === 'startDate' || field.name === 'endDate');
  };

  // Group fields for goal type - dates after title, then other fields
  const titleField = { name: 'title', label: useDonorNameLabel ? "Grant/Donor Name, Duration, Country" : "Title", type: 'text' };
  const dateFields = displayFields.filter(field => isDateField(field));
  const nonDateFields = displayFields.filter(field => !isDateField(field));

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
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? `Edit ${title.replace(/^(Add New |Edit )/, '')}` : title}
            </h3>
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
            {/* Title field (always first) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {titleField.label}
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

            {/* Date fields in two-column layout for goals (positioned after title) */}
            {type === 'goal' && dateFields.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {dateFields.map(field => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="date"
                      name={field.name}
                      value={formatDateForInput(formData[field.name] || '')}
                      onChange={handleChange}
                      min={field.name === 'endDate' ? getMinEndDate() : undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Other fields */}
            {nonDateFields.length > 0 && (
              <div className="space-y-4">
                {nonDateFields.map(field => (
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
                        min={field.name === 'endDate' ? getMinEndDate() : undefined}
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
                className={`px-4 py-2 rounded-lg ${
                  canSubmit() 
                    ? 'bg-primary-500 text-white hover:bg-primary-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={canSubmit() ? { scale: 1.02 } : {}}
                whileTap={canSubmit() ? { scale: 0.98 } : {}}
                disabled={!canSubmit()}
              >
                {isEditMode ? 'Save Changes' : 'Add'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AddItemModal;