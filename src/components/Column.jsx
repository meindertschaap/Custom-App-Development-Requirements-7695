import React, { memo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RowItem from './RowItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import AddItemModal from './AddItemModal';

const { FiChevronRight, FiGrid, FiPlus, FiEdit2 } = FiIcons;

// Memoized Column component to prevent unnecessary re-renders
const Column = memo(function Column({
  title,
  items,
  onSelect,
  onToggleCompletion,
  onAdd,
  onEdit,
  onDelete,
  selectedId,
  type,
  disabled = false,
  isLeaf = false,
  editingNewItemId = null,
  isEditingHeader = false,
  onEditHeader,
  onStartEditingHeader,
  forceRefresh = false,
  fields = [],
  useDonorNameLabel = false
}) {
  const count = items?.length || 0;
  const completedCount = items?.filter(item => item.completed).length || 0;
  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [pendingItemSelection, setPendingItemSelection] = useState(null);
  const [headerTitle, setHeaderTitle] = useState(title);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const headerInputRef = useRef(null);
  const newItemInputRef = useRef(null);

  // Set up droppable area for the column
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${type}`,
    data: { type: type, accepts: [type] }
  });

  // Update headerTitle when title prop changes
  useEffect(() => {
    setHeaderTitle(title);
  }, [title]);

  // Focus and select the header input when editing starts
  useEffect(() => {
    if (isEditingHeader && headerInputRef.current) {
      headerInputRef.current.focus();
      headerInputRef.current.select();
    }
  }, [isEditingHeader]);

  // Focus the new item input when it becomes visible - with proper timing
  useEffect(() => {
    if (showNewItemInput && newItemInputRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        if (newItemInputRef.current) {
          newItemInputRef.current.focus();
        }
      });
    }
  }, [showNewItemInput]);

  // Force refresh when forceRefresh changes
  useEffect(() => {
    if (forceRefresh) {
      setRefreshKey(prev => prev + 1);
    }
  }, [forceRefresh]);

  const handleAddItem = () => {
    if (disabled) return;
    
    // Always use modal for adding items
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleNewItemSubmit = (e) => {
    e.preventDefault();
    if (newItemTitle.trim()) {
      onAdd(newItemTitle);
      // Clear the input but keep it open and focused
      setNewItemTitle("");
      // Ensure focus stays in the input field using multiple methods
      requestAnimationFrame(() => {
        if (newItemInputRef.current) {
          newItemInputRef.current.focus();
        }
      });
      // Backup focus attempt
      setTimeout(() => {
        if (newItemInputRef.current) {
          newItemInputRef.current.focus();
        }
      }, 10);
    }
  };

  const handleNewItemBlur = () => {
    if (newItemTitle.trim()) {
      onAdd(newItemTitle);
      setNewItemTitle("");
      // If there's a pending item selection, process it
      if (pendingItemSelection) {
        onSelect && onSelect(pendingItemSelection);
        setPendingItemSelection(null);
      }
      // Keep the input field open and focused after adding
      requestAnimationFrame(() => {
        if (newItemInputRef.current) {
          newItemInputRef.current.focus();
        }
      });
    } else {
      setShowNewItemInput(false);
      // If there's a pending item selection, process it
      if (pendingItemSelection) {
        onSelect && onSelect(pendingItemSelection);
        setPendingItemSelection(null);
      }
    }
  };

  // Handle selection while ensuring input is properly closed first
  const handleItemSelect = (item) => {
    // Process selection immediately without storing it as pending
    onSelect && onSelect(item);
  };

  const handleHeaderInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (headerTitle.trim()) {
        onEditHeader(headerTitle);
      } else {
        setHeaderTitle(title); // Reset to original if empty
        onEditHeader(title);
      }
    } else if (e.key === 'Escape') {
      setHeaderTitle(title); // Reset to original
      onEditHeader(title); // Cancel editing
    }
  };

  const handleHeaderBlur = () => {
    if (headerTitle.trim()) {
      onEditHeader(headerTitle);
    } else {
      setHeaderTitle(title); // Reset to original if empty
      onEditHeader(title);
    }
  };

  // Handle adding item from modal
  const handleAddItemFromModal = (title, data) => {
    onAdd(title, data);
    setShowAddModal(false);
  };

  // Handle editing item from modal
  const handleEditItemFromModal = (title, data) => {
    if (editingItem) {
      onEdit(editingItem.id, title, data);
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  // Create sortable item IDs for dnd-kit
  const itemIds = items ? items.map(item => item.id) : [];

  // Generate proper placeholder text based on column title
  const getPlaceholderText = () => {
    return `Add ${title.toLowerCase().replace(/s$/, '')}...`;
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${
        disabled ? 'opacity-50' : ''
      } ${isOver ? 'ring-4 ring-primary-300 ring-opacity-50 bg-primary-25 border-primary-300' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isOver ? 1.02 : 1,
        borderColor: isOver ? '#f97316' : '#e5e7eb'
      }}
      transition={{ duration: 0.2, scale: { duration: 0.15 }, borderColor: { duration: 0.15 } }}
      layout
      key={`column-${type}-${refreshKey}`}
    >
      {/* Column Header - Changed background gradient to be darker */}
      <motion.div
        className={`p-4 border-b border-gray-100 transition-all ${
          isOver ? 'bg-gradient-to-r from-primary-200 to-primary-300' : 'bg-gradient-to-r from-primary-100 to-primary-200'
        }`}
        animate={{ backgroundColor: isOver ? '#fed7aa' : '#ffedd5' }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <SafeIcon icon={FiGrid} className="text-primary-600 text-xl" />
            {isEditingHeader ? (
              <input
                ref={headerInputRef}
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                onKeyDown={handleHeaderInputKeyDown}
                onBlur={handleHeaderBlur}
                className="flex-1 px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-base font-semibold"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
                <motion.button
                  onClick={onStartEditingHeader}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Edit column title"
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!disabled && !showNewItemInput && (
              <motion.button
                onClick={handleAddItem}
                className="p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Add new ${type}`}
              >
                <SafeIcon icon={FiPlus} className="text-base" />
              </motion.button>
            )}
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
              {count}
            </span>
            {completedCount > 0 && (
              <span className="px-2 py-1 bg-success-100 text-success-700 rounded-lg text-sm font-medium">
                ✓ {completedCount}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Items List - with sortable context for drag and drop */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {(items?.length > 0 || showNewItemInput) ? (
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {items?.map((item, index) => (
                <RowItem
                  key={`${item.id}-${refreshKey}`}
                  item={item}
                  onSelect={onSelect ? () => handleItemSelect(item) : undefined}
                  onToggleCompletion={() => onToggleCompletion(item.id)}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => onDelete(item.id)}
                  isSelected={selectedId === item.id}
                  type={type}
                  isLeaf={isLeaf}
                  index={index}
                  isEditing={item.id === editingNewItemId}
                  onEditComplete={() => {
                    // Don't auto open input when completing an edit
                  }}
                />
              ))}

              {/* New item input field */}
              {showNewItemInput && !disabled && (
                <motion.form
                  onSubmit={handleNewItemSubmit}
                  className="p-3 border-t border-gray-50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <input
                    ref={newItemInputRef}
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    onBlur={handleNewItemBlur}
                    placeholder={getPlaceholderText()}
                    className="w-full px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                    autoFocus
                  />
                </motion.form>
              )}
            </SortableContext>
          ) : (
            <motion.div
              className="p-8 text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {disabled ? (
                <div className="space-y-2">
                  <SafeIcon icon={FiChevronRight} className="text-3xl mx-auto text-gray-300" />
                  <p className="text-base">Select an item from the previous column</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <SafeIcon icon={FiGrid} className="text-3xl mx-auto text-gray-300" />
                  <p className="text-base">{onAdd ? `Click + to add a new ${title.toLowerCase().replace(/s$/, '')}` : 'No items found'}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItemFromModal}
        title={`Add New ${title.replace(/s$/, '')}`}
        type={type}
        fields={fields}
        useDonorNameLabel={useDonorNameLabel}
        isEditMode={false}
      />

      {/* Edit Item Modal */}
      <AddItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        onEdit={handleEditItemFromModal}
        title={`Edit ${title.replace(/s$/, '')}`}
        type={type}
        fields={fields}
        useDonorNameLabel={useDonorNameLabel}
        isEditMode={true}
        editingItem={editingItem}
      />
    </motion.div>
  );
});

export default Column;