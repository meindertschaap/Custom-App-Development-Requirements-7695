import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RowItem from './RowItem';

const { FiChevronRight, FiGrid } = FiIcons;

function Column({ title, items, onSelect, onToggleCompletion, selectedId, type, disabled = false, isLeaf = false }) {
  const count = items?.length || 0;
  const completedCount = items?.filter(item => item.completed).length || 0;

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${
        disabled ? 'opacity-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiGrid} className="text-primary-600 text-lg" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
              {count}
            </span>
            {completedCount > 0 && (
              <span className="px-2 py-1 bg-success-100 text-success-700 rounded-lg text-xs font-medium">
                ✓ {completedCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {items?.length > 0 ? (
            items.map((item, index) => (
              <RowItem
                key={item.id}
                item={item}
                onSelect={() => onSelect(item)}
                onToggleCompletion={() => onToggleCompletion(item.id)}
                isSelected={selectedId === item.id}
                type={type}
                isLeaf={isLeaf}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="p-8 text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {disabled ? (
                <div className="space-y-2">
                  <SafeIcon icon={FiChevronRight} className="text-2xl mx-auto text-gray-300" />
                  <p className="text-sm">Select an item from the previous column</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <SafeIcon icon={FiGrid} className="text-2xl mx-auto text-gray-300" />
                  <p className="text-sm">No items found</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Column;