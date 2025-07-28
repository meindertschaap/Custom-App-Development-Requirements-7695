import React, {useState, useRef, useEffect, memo} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const {FiCheck, FiChevronRight, FiEdit2, FiTrash2, FiStar} = FiIcons;

// Memoized RowItem component to prevent unnecessary re-renders
const RowItem = memo(function RowItem({
  item,
  onSelect,
  onToggleCompletion,
  onToggleStarred,
  onEdit,
  onDelete,
  isSelected,
  type,
  isLeaf = false,
  index,
  isEditing = false,
  onEditComplete,
  canBeStar = true
}) {
  const [editMode, setEditMode] = useState(isEditing);
  const [editValue, setEditValue] = useState(item.title);
  const [showActions, setShowActions] = useState(false);
  const [truncatedTitle, setTruncatedTitle] = useState(item.title);
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  
  // Set up sortable functionality - entire item is draggable with click-hold
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: item.id,
    data: {
      type: type,
      index: index,
      item: item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  };

  // When isEditing prop changes, update the editMode state
  useEffect(() => {
    if (isEditing) {
      setEditMode(true);
    }
  }, [isEditing]);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easy replacement
      inputRef.current.select();
    }
  }, [editMode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Calculate and set truncated text only once when showActions changes
  useEffect(() => {
    if (!showActions || editMode || !titleRef.current) {
      setTruncatedTitle(item.title);
      return;
    }
    
    // Calculate approximate characters that fit in two lines
    const containerWidth = titleRef.current.clientWidth || 200;
    const avgCharWidth = 8; // Approximate character width in pixels
    const charsPerLine = Math.floor(containerWidth / avgCharWidth);
    const maxCharsForTwoLines = charsPerLine * 2;
    
    // Reserve space for action buttons (approximately 15-20 characters worth)
    const actionsReserve = canBeStar ? 20 : 15;
    const availableChars = maxCharsForTwoLines - actionsReserve;
    
    if (item.title.length > availableChars && availableChars > 10) {
      // Truncate to fit in two lines with ellipses
      const truncated = item.title.slice(0, availableChars - 3) + '...';
      setTruncatedTitle(truncated);
    } else {
      setTruncatedTitle(item.title);
    }
  }, [showActions, item.title, editMode, canBeStar]);

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleCompletion();
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStarred();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditValue(item.title);
    setEditMode(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete();
    }
  };

  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    // Allow all keys including space
    e.stopPropagation();
    if (e.key === 'Enter') {
      if (editValue.trim()) {
        onEdit(editValue);
        setEditMode(false);
        if (onEditComplete) {
          onEditComplete();
        }
      }
    } else if (e.key === 'Escape') {
      setEditMode(false);
      setEditValue(item.title);
    }
  };

  const handleBlur = () => {
    if (editValue.trim()) {
      onEdit(editValue);
    } else {
      setEditValue(item.title);
    }
    setEditMode(false);
  };

  // Handle click for selection - only if not dragging
  const handleClick = (e) => {
    if (!editMode && onSelect && !isDragging) {
      onSelect();
    }
  };

  // Fix: Prevent input click from triggering blur/exit edit mode
  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  // Completely eliminate flickering with a more robust hover system
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Use a single timeout to set the state to prevent rapid toggling
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current) {
        setShowActions(true);
      }
    }, 100);
  };
  
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Add a small delay before hiding to prevent flicker
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setShowActions(false);
      }
    }, 100);
  };

  // Optimized to reduce animation load for large lists
  const staggerDelay = Math.min(0.05, 0.02 + (index * 0.001));

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={`group p-3 border-b border-gray-50 cursor-pointer transition-all ${
        isSelected ? 'bg-primary-50 border-primary-200 hover:bg-primary-50' : 'hover:bg-gray-50'
      } ${editMode ? 'pointer-events-none' : ''} ${
        isDragging ? 'cursor-grabbing shadow-2xl bg-white border-2 border-primary-400 scale-105 rotate-2 z-50' : 'cursor-grab'
      } ${isOver ? 'border-t-4 border-t-primary-500 bg-primary-25' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 5 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        y: 0,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0,
        boxShadow: isDragging ? '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(249,115,22,0.4)' : '0 1px 3px 0 rgba(0,0,0,0.1)'
      }}
      transition={{
        duration: isDragging ? 0.2 : 0.15,
        delay: isDragging ? 0 : staggerDelay,
        type: isDragging ? 'spring' : 'tween',
        stiffness: isDragging ? 300 : 200,
        layoutId: undefined // Remove layout animation that causes scrolling
      }}
      whileHover={!isDragging ? { x: 2 } : {}}
    >
      <div className="flex items-start gap-3 row-item-content">
        {/* Checkbox */}
        <motion.button
          onClick={handleCheckboxClick}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            item.completed ? 'bg-success-500 border-success-500 text-white' : 'border-gray-300 hover:border-success-400'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {item.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editMode ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleBlur}
              onClick={handleInputClick}
              className="w-full px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-base pointer-events-auto"
              autoFocus
              style={{ pointerEvents: 'auto' }}
            />
          ) : (
            <div className="flex items-start justify-between gap-2">
              <h4
                ref={titleRef}
                className={`text-base leading-relaxed ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                } ${isSelected ? 'font-semibold' : 'font-normal'} flex items-center gap-1`}
                style={{
                  display: 'block',
                  WebkitLineClamp: showActions ? 2 : 'unset',
                  WebkitBoxOrient: showActions ? 'vertical' : 'unset',
                  overflow: 'hidden'
                }}
              >
                {item.starred && (
                  <SafeIcon icon={FiStar} className="text-amber-500 flex-shrink-0" />
                )}
                {showActions ? truncatedTitle : item.title}
              </h4>
              {!isLeaf && onSelect && (
                <SafeIcon
                  icon={FiChevronRight}
                  className={`text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {!editMode && showActions && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            {canBeStar && (
              <motion.button
                onClick={handleStarClick}
                className={`p-1.5 ${
                  item.starred ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
                } hover:bg-amber-50 rounded transition-all`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={item.starred ? "Unstar" : "Star"}
              >
                <SafeIcon icon={FiStar} className="text-base" />
              </motion.button>
            )}
            <motion.button
              onClick={handleEditClick}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit"
            >
              <SafeIcon icon={FiEdit2} className="text-base" />
            </motion.button>
            <motion.button
              onClick={handleDeleteClick}
              className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete"
            >
              <SafeIcon icon={FiTrash2} className="text-base" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default RowItem;