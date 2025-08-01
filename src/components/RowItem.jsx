import React, {useState, useRef, useEffect, memo} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {differenceInDays, format} from 'date-fns';

const {FiCheck, FiChevronRight, FiEdit2, FiTrash2, FiAlertCircle, FiAlertTriangle, FiChevronsRight, FiAlert} = FiIcons;

// Memoized RowItem component to prevent unnecessary re-renders
const RowItem = memo(function RowItem({
  item,
  onSelect,
  onToggleCompletion,
  onEdit,
  onDelete,
  isSelected,
  type,
  isLeaf = false,
  index,
  isEditing = false,
  onEditComplete
}) {
  const [editMode, setEditMode] = useState(isEditing);
  const [editValue, setEditValue] = useState(item.title);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  const clickTimeoutRef = useRef(null); // For debouncing clicks

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

  // Update editValue when item.title changes
  useEffect(() => {
    setEditValue(item.title);
  }, [item.title]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleCompletion();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();  // Call the edit function passed from Column
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Ensure we have a delete handler
    if (typeof onDelete !== 'function') {
      console.error('Delete handler not provided');
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to delete "${item.title}"?`);
    if (confirmed) {
      // Set deleting state immediately
      setIsDeleting(true);
      // Call the delete handler immediately without delay
      onDelete(item.id);
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
        // Call onEdit directly with the new value
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
      // Call onEdit directly with the new value
      onEdit(editValue);
    } else {
      setEditValue(item.title);
    }
    setEditMode(false);
  };

  // Handle click for selection - only if not dragging 
  const handleClick = (e) => {
    // FIXED: Stop propagation for completed items to prevent bubbling
    if (item.completed) {
      e.stopPropagation();
    }
    
    if (!editMode && onSelect && !isDragging) {
      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      
      // Call onSelect immediately
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

  // Function to determine RAG status for steps (promises)
  const getRagStatus = () => {
    if (type === 'step' && item.endDate) {
      try {
        const endDate = new Date(item.endDate);
        const today = new Date();
        const daysRemaining = differenceInDays(endDate, today);
        
        if (item.completed) {
          return null; // No flag if completed
        } else if (daysRemaining <= 30) {
          return {
            icon: FiAlertCircle,
            color: 'text-red-500',
            tooltip: 'Less than 30 days remaining'
          };
        } else if (daysRemaining <= 60) {
          return {
            icon: FiAlertTriangle,
            color: 'text-amber-500',
            tooltip: '31-60 days remaining'
          };
        }
      } catch (e) {
        console.error("Error calculating RAG status:", e);
      }
    }
    return null;
  };

  // Get RAG status
  const ragStatus = getRagStatus();

  // Get progress percentage for donor timeline
  const getTimelineProgress = () => {
    if (type === 'goal' && item.startDate && item.endDate) {
      try {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const today = new Date();
        
        // Calculate total duration and elapsed time
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedTime = today.getTime() - startDate.getTime();
        
        // Calculate percentage (clamped between 0-100)
        const percentage = Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100));
        
        // Determine color based on percentage
        let color = 'bg-green-500'; // Light/mid-green for 0-70%
        if (percentage > 70 && percentage <= 85) {
          color = 'bg-orange-500'; // Orange for >70-85%
        } else if (percentage > 85) {
          color = 'bg-red-500'; // Red for >85%
        }
        
        return {percentage, color};
      } catch (e) {
        console.error("Error calculating timeline progress:", e);
      }
    }
    return null;
  };

  // Get timeline progress
  const timelineProgress = getTimelineProgress();

  // Get next report date status for goals
  const getNextReportStatus = () => {
    if (type === 'goal' && item.nextReportDate) {
      try {
        const reportDate = new Date(item.nextReportDate);
        const today = new Date();
        const daysUntilReport = differenceInDays(reportDate, today);
        
        if (daysUntilReport < 0) {
          return {
            status: 'overdue',
            background: 'bg-red-600 text-white',
            icon: FiAlert,
            tooltip: 'Report deadline has passed'
          };
        } else if (daysUntilReport < 30) {
          return {
            status: 'urgent',
            background: 'bg-red-500 text-white',
            tooltip: 'Less than 30 days until report'
          };
        } else if (daysUntilReport < 60) {
          return {
            status: 'warning',
            background: 'bg-orange-500 text-white',
            tooltip: 'Less than 60 days until report'
          };
        }
      } catch (e) {
        console.error("Error calculating next report status:", e);
      }
    }
    return null;
  };

  // Get next report status
  const nextReportStatus = getNextReportStatus();

  // Optimized to reduce animation load for large lists
  const staggerDelay = Math.min(0.05, 0.02 + (index * 0.001));

  // Format date in "12-Jan-2025" format
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd-MMM-yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get status color for promises (updated colors)
  const getStatusColor = (status) => {
    switch (status) {
      case 'On track': return 'bg-green-100 text-green-700';
      case 'Not started': return 'bg-blue-50 text-blue-600'; // Lighter blue
      case 'At risk': return 'bg-red-200 text-red-800'; // Stronger red
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get progress color for initiatives (tasks)
  const getProgressColor = (progress) => {
    switch (progress) {
      case 'Going well': return 'bg-green-100 text-green-700';
      case 'Going OK-ish': return 'bg-yellow-100 text-yellow-700';
      case 'Struggling': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Don't render if item is being deleted
  if (isDeleting) {
    return null;
  }

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
      initial={{opacity: 0, y: 5}}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        y: 0,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0,
        boxShadow: isDragging ? '0 25px 50px -12px rgba(0,0,0,0.25),0 0 0 1px rgba(249,115,22,0.4)' : '0 1px 3px 0 rgba(0,0,0,0.1)'
      }}
      transition={{
        duration: isDragging ? 0.2 : 0.15,
        delay: isDragging ? 0 : staggerDelay,
        type: isDragging ? 'spring' : 'tween',
        stiffness: isDragging ? 300 : 200,
        layoutId: undefined // Remove layout animation that causes scrolling
      }}
      whileHover={!isDragging ? {x: 2} : {}}
      exit={{opacity: 0, height: 0, marginBottom: 0, padding: 0}}
    >
      <div className="flex items-start gap-3 row-item-content relative">
        {/* Checkbox */}
        <motion.button
          onClick={handleCheckboxClick}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            item.completed ? 'bg-success-500 border-success-500 text-white' : 'border-gray-300 hover:border-success-400'
          }`}
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
        >
          {item.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
        </motion.button>

        {/* Content Container - relative positioning for overlay */}
        <div className="flex-1 min-w-0 relative">
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
              style={{pointerEvents: 'auto'}}
            />
          ) : (
            <>
              {/* Title and Chevron Container */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h4
                      ref={titleRef}
                      className={`text-base leading-tight ${
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      } ${isSelected ? 'font-semibold' : 'font-normal'} flex-grow pr-2`}
                    >
                      {item.title}
                    </h4>
                    {ragStatus && (
                      <div className="flex-shrink-0 ml-1" title={ragStatus.tooltip}>
                        <SafeIcon icon={ragStatus.icon} className={`${ragStatus.color}`} />
                      </div>
                    )}
                  </div>

                  {/* Show metadata based on type */}
                  {type === 'goal' && (
                    <div className="flex flex-col mt-1 text-xs text-gray-500">
                      {item.amount && (
                        <span>{item.amount}</span>
                      )}
                      {item.startDate && item.endDate && (
                        <div className="flex flex-col mt-1 w-full">
                          <span className="text-xs text-gray-500 mb-1">
                            {formatDate(item.startDate)} - {formatDate(item.endDate)}
                          </span>
                          {timelineProgress && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${timelineProgress.color}`}
                                style={{width: `${timelineProgress.percentage}%`}}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                      {item.nextReportDate && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-500">Next Report:</span>
                          <div className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                            nextReportStatus ? nextReportStatus.background : 'bg-gray-100 text-gray-700'
                          }`}>
                            {nextReportStatus?.icon && (
                              <SafeIcon icon={nextReportStatus.icon} className="text-xs" title={nextReportStatus.tooltip} />
                            )}
                            {formatDate(item.nextReportDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {type === 'step' && item.status && (
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  )}

                  {type === 'task' && item.progress && (
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getProgressColor(item.progress)}`}>
                        {item.progress}
                      </span>
                    </div>
                  )}

                  {type === 'initiative' && (
                    <div className="flex flex-col mt-1 text-xs text-gray-500">
                      {item.assignee && (
                        <span>Assignee: {item.assignee}</span>
                      )}
                      {item.priority && (
                        <span className={`mt-1 inline-block px-2 py-0.5 rounded ${
                          item.priority === 'High' ? 'bg-red-100 text-red-700' :
                          item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Improved visual indicator for navigation */}
                {(!isLeaf && onSelect) || (item.completed && onSelect) ? (
                  <div className="flex-shrink-0 p-1.5">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary-500 bg-primary-500 bg-opacity-80 text-white' : 'border-gray-300 text-gray-400'
                    }`}>
                      <SafeIcon
                        icon={isSelected ? FiChevronsRight : FiChevronRight}
                        className="transition-transform"
                        size={16}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Overlay Action Buttons - positioned absolutely */}
              {!editMode && showActions && (
                <motion.div
                  className="absolute top-0 right-0 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-gray-200 z-10"
                  initial={{opacity: 0, scale: 0.9, x: 10}}
                  animate={{opacity: 1, scale: 1, x: 0}}
                  exit={{opacity: 0, scale: 0.9, x: 10}}
                  transition={{duration: 0.15}}
                  style={{marginRight: (!isLeaf && onSelect) || (item.completed && onSelect) ? '44px' : '0px'}} // Increased offset for new button size
                >
                  <motion.button
                    onClick={handleEditClick}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    title="Edit"
                  >
                    <SafeIcon icon={FiEdit2} className="text-sm" />
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteClick}
                    className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-all"
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    title="Delete"
                  >
                    <SafeIcon icon={FiTrash2} className="text-sm" />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default RowItem;