import React,{useState,useEffect,useMemo,useCallback} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Column from './Column';
import TopBar from './TopBar';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {v4 as uuidv4} from 'uuid';
import {DndContext,closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors} from '@dnd-kit/core';
import {arrayMove,sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {format,differenceInDays} from 'date-fns';

const {FiGrid,FiArrowLeft}=FiIcons;

// Default donor promise template
const defaultTemplate={
  columnHeaders: {
    goals: "Donor",
    steps: "Promises",
    tasks: "Initiatives",
    initiatives: "Next Actions"
  },
  goals: []
};

function Board() {
  const [data,setData]=useLocalStorage('donor-promise-data',defaultTemplate);
  const [filter,setFilter]=useState('all');// all,active,completed
  const [searchQuery,setSearchQuery]=useState('');
  const [selectedGoal,setSelectedGoal]=useState(null);
  const [selectedStep,setSelectedStep]=useState(null);
  const [selectedTask,setSelectedTask]=useState(null);
  const [editingNewItem,setEditingNewItem]=useState(null);// Track newly added item being edited
  const [editingHeader,setEditingHeader]=useState(null);// Track which header is being edited
  const [activeDragData,setActiveDragData]=useState(null);
  const [forceRefresh,setForceRefresh]=useState(0);// Force refresh counter
  const [lastExportFilename,setLastExportFilename]=useLocalStorage('last-export-filename','');
  const [criticalFilter,setCriticalFilter]=useState('all');// all,critical-01,critical-02,etc.

  // New state for intelligent filtering
  const [intelligentFilterResults,setIntelligentFilterResults]=useState(null);
  const [showingFilterResults,setShowingFilterResults]=useState(false);
  const [originalSelections,setOriginalSelections]=useState({
    goal: null,
    step: null,
    task: null
  });

  // State to track when we're viewing a specific filtered item's hierarchy
  const [viewingFilteredItemHierarchy,setViewingFilteredItemHierarchy]=useState(false);

  // NEW: Store the selected filtered item hierarchy
  const [selectedFilteredHierarchy,setSelectedFilteredHierarchy]=useState({
    goal: null,
    step: null,
    task: null
  });

  // NEW: State for search results functionality
  const [showingSearchResults,setShowingSearchResults]=useState(false);
  const [viewingSearchItemHierarchy,setViewingSearchItemHierarchy]=useState(false);
  const [selectedSearchHierarchy,setSelectedSearchHierarchy]=useState({
    goal: null,
    step: null,
    task: null
  });
  const [searchResults,setSearchResults]=useState({
    goals: [],
    steps: [],
    tasks: [],
    initiatives: []
  });

  // Configure DnD sensors with longer delay for click-hold
  const sensors=useSensors(
    useSensor(PointerSensor,{
      activationConstraint: {
        delay: 250,// 250ms delay for click-hold
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor,{
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // When selected items change,update them from the data to ensure they're fresh
  useEffect(()=> {
    if (selectedGoal) {
      const freshGoal=data.goals.find(g=> g.id===selectedGoal.id);
      if (freshGoal) {
        setSelectedGoal(freshGoal);
      } else {
        setSelectedGoal(null);
      }
    }
  },[data.goals,selectedGoal]);

  useEffect(()=> {
    if (selectedGoal && selectedStep) {
      const freshGoal=data.goals.find(g=> g.id===selectedGoal.id);
      if (freshGoal && freshGoal.steps) {
        const freshStep=freshGoal.steps.find(s=> s.id===selectedStep.id);
        if (freshStep) {
          setSelectedStep(freshStep);
        } else {
          setSelectedStep(null);
        }
      } else {
        setSelectedStep(null);
      }
    }
  },[data.goals,selectedGoal,selectedStep]);

  useEffect(()=> {
    if (selectedGoal && selectedStep && selectedTask) {
      const freshGoal=data.goals.find(g=> g.id===selectedGoal.id);
      if (freshGoal && freshGoal.steps) {
        const freshStep=freshGoal.steps.find(s=> s.id===selectedStep.id);
        if (freshStep && freshStep.tasks) {
          const freshTask=freshStep.tasks.find(t=> t.id===selectedTask.id);
          if (freshTask) {
            setSelectedTask(freshTask);
          } else {
            setSelectedTask(null);
          }
        } else {
          setSelectedTask(null);
        }
      } else {
        setSelectedTask(null);
      }
    }
  },[data.goals,selectedGoal,selectedStep,selectedTask]);

  // Enhanced search function that searches through all user-added data fields
  const searchInAllFields=useCallback((item,query)=> {
    if (!query || !item) return true;

    try {
      const searchQuery=query.toLowerCase();

      // Search in basic fields - with null checks
      if (item.title && typeof item.title==='string' && item.title.toLowerCase().includes(searchQuery)) return true;
      if (item.amount && typeof item.amount==='string' && item.amount.toLowerCase().includes(searchQuery)) return true;
      if (item.status && typeof item.status==='string' && item.status.toLowerCase().includes(searchQuery)) return true;
      if (item.team && typeof item.team==='string' && item.team.toLowerCase().includes(searchQuery)) return true;
      if (item.assignee && typeof item.assignee==='string' && item.assignee.toLowerCase().includes(searchQuery)) return true;
      if (item.priority && typeof item.priority==='string' && item.priority.toLowerCase().includes(searchQuery)) return true;
      if (item.progress && typeof item.progress==='string' && item.progress.toLowerCase().includes(searchQuery)) return true;

      // Search in date fields (formatted) - with error handling
      if (item.startDate && typeof item.startDate==='string') {
        try {
          const formattedStartDate=format(new Date(item.startDate),'dd-MMM-yyyy');
          if (formattedStartDate.toLowerCase().includes(searchQuery)) return true;
        } catch (e) {
          if (item.startDate.toLowerCase().includes(searchQuery)) return true;
        }
      }

      if (item.endDate && typeof item.endDate==='string') {
        try {
          const formattedEndDate=format(new Date(item.endDate),'dd-MMM-yyyy');
          if (formattedEndDate.toLowerCase().includes(searchQuery)) return true;
        } catch (e) {
          if (item.endDate.toLowerCase().includes(searchQuery)) return true;
        }
      }

      if (item.nextReportDate && typeof item.nextReportDate==='string') {
        try {
          const formattedReportDate=format(new Date(item.nextReportDate),'dd-MMM-yyyy');
          if (formattedReportDate.toLowerCase().includes(searchQuery)) return true;
        } catch (e) {
          if (item.nextReportDate.toLowerCase().includes(searchQuery)) return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error in searchInAllFields:',error);
      return true;// Return true on error to avoid filtering out items
    }
  },[]);

  // NEW: Function to perform comprehensive search across all data
  const performComprehensiveSearch=useCallback((query)=> {
    if (!query || !query.trim()) {
      setSearchResults({goals: [],steps: [],tasks: [],initiatives: []});
      setShowingSearchResults(false);
      return;
    }

    const results={goals: [],steps: [],tasks: [],initiatives: []};

    data.goals?.forEach(goal=> {
      // Check goals
      if (searchInAllFields(goal,query)) {
        results.goals.push(goal);
      }

      // Check steps (promises)
      goal.steps?.forEach(step=> {
        if (searchInAllFields(step,query)) {
          results.steps.push({...step,parentGoal: goal});
        }

        // Check tasks (initiatives)
        step.tasks?.forEach(task=> {
          if (searchInAllFields(task,query)) {
            results.tasks.push({...task,parentGoal: goal,parentStep: step});
          }

          // Check initiatives (next actions)
          task.initiatives?.forEach(initiative=> {
            if (searchInAllFields(initiative,query)) {
              results.initiatives.push({...initiative,parentGoal: goal,parentStep: step,parentTask: task});
            }
          });
        });
      });
    });

    setSearchResults(results);
    setShowingSearchResults(true);
    setViewingSearchItemHierarchy(false);
    setSelectedSearchHierarchy({goal: null,step: null,task: null});

    // Clear selections when showing search results
    setSelectedGoal(null);
    setSelectedStep(null);
    setSelectedTask(null);
  },[data.goals,searchInAllFields]);

  // NEW: Function to expand search item and show its hierarchy
  const expandSearchItemHierarchy=useCallback((item,itemType)=> {
    setShowingSearchResults(false);
    setViewingSearchItemHierarchy(true);

    let goalToSet=null;
    let stepToSet=null;
    let taskToSet=null;

    if (itemType==='goal') {
      goalToSet=item;
      setSelectedGoal(item);
      setSelectedStep(null);
      setSelectedTask(null);
    } else if (itemType==='step') {
      if (item.parentGoal) {
        goalToSet=item.parentGoal;
        stepToSet=item;
        setSelectedGoal(item.parentGoal);
        setSelectedStep(item);
        setSelectedTask(null);
      }
    } else if (itemType==='task') {
      if (item.parentGoal && item.parentStep) {
        goalToSet=item.parentGoal;
        stepToSet=item.parentStep;
        taskToSet=item;
        setSelectedGoal(item.parentGoal);
        setSelectedStep(item.parentStep);
        setSelectedTask(item);
      }
    } else if (itemType==='initiative') {
      if (item.parentGoal && item.parentStep && item.parentTask) {
        goalToSet=item.parentGoal;
        stepToSet=item.parentStep;
        taskToSet=item.parentTask;
        setSelectedGoal(item.parentGoal);
        setSelectedStep(item.parentStep);
        setSelectedTask(item.parentTask);
      }
    }

    // Store the hierarchy for search view
    setSelectedSearchHierarchy({
      goal: goalToSet,
      step: stepToSet,
      task: taskToSet
    });
  },[]);

  // NEW: Function to return to search results
  const returnToSearchResults=useCallback(()=> {
    setSelectedGoal(null);
    setSelectedStep(null);
    setSelectedTask(null);
    setShowingSearchResults(true);
    setViewingSearchItemHierarchy(false);
    setSelectedSearchHierarchy({goal: null,step: null,task: null});
  },[]);

  // NEW: Update search when query changes
  useEffect(()=> {
    // Reset all search/filter states when search query changes
    if (searchQuery.trim()) {
      setShowingFilterResults(false);
      setViewingFilteredItemHierarchy(false);
      setSelectedFilteredHierarchy({goal: null,step: null,task: null});
      setIntelligentFilterResults(null);
      performComprehensiveSearch(searchQuery);
    } else {
      setSearchResults({goals: [],steps: [],tasks: [],initiatives: []});
      setShowingSearchResults(false);
      setViewingSearchItemHierarchy(false);
      setSelectedSearchHierarchy({goal: null,step: null,task: null});
    }
  },[searchQuery,performComprehensiveSearch]);

  // Helper functions for intelligent filtering
  const getTimelineProgress=(item)=> {
    if (item.startDate && item.endDate) {
      try {
        const startDate=new Date(item.startDate);
        const endDate=new Date(item.endDate);
        const today=new Date();

        const totalDuration=endDate.getTime() - startDate.getTime();
        const elapsedTime=today.getTime() - startDate.getTime();

        const percentage=Math.max(0,Math.min(100,(elapsedTime / totalDuration) * 100));

        return {
          percentage,
          isOrangeOrRed: percentage > 70
        };
      } catch (e) {
        return {percentage: 0,isOrangeOrRed: false};
      }
    }
    return {percentage: 0,isOrangeOrRed: false};
  };

  const getNextReportStatus=(item)=> {
    if (item.nextReportDate) {
      try {
        const reportDate=new Date(item.nextReportDate);
        const today=new Date();
        const daysUntilReport=differenceInDays(reportDate,today);

        return {
          isAlmostDueOrOverdue: daysUntilReport < 60,// Less than 60 days (orange or red)
          isRedOverdue: daysUntilReport < 0
        };
      } catch (e) {
        return {isAlmostDueOrOverdue: false,isRedOverdue: false};
      }
    }
    return {isAlmostDueOrOverdue: false,isRedOverdue: false};
  };

  // Function to check if a goal is "doing well"
  const isGoalDoingWell=useCallback((goal)=> {
    try {
      const today=new Date();

      // Check if end date has not passed
      if (goal.endDate) {
        const endDate=new Date(goal.endDate);
        if (endDate < today) {
          return false;// End date has passed
        }
      }

      // Check if report date has not passed
      if (goal.nextReportDate) {
        const reportDate=new Date(goal.nextReportDate);
        if (reportDate < today) {
          return false;// Report date has passed
        }
      }

      // Check that no promises are "At risk"
      if (goal.steps && goal.steps.length > 0) {
        for (const step of goal.steps) {
          if (step.status === 'At risk') {
            return false;// Has at-risk promise
          }

          // Check that all initiatives under all promises are "Going well" OR "Going OK-ish"
          if (step.tasks && step.tasks.length > 0) {
            for (const task of step.tasks) {
              if (task.initiatives && task.initiatives.length > 0) {
                for (const initiative of task.initiatives) {
                  // For initiatives, check the progress field - now accepts both "Going well" and "Going OK-ish"
                  if (initiative.progress && initiative.progress !== 'Going well' && initiative.progress !== 'Going OK-ish') {
                    return false;// Has initiative not going well or OK-ish
                  }
                }
              }
            }
          }
        }
      }

      return true;// All criteria met
    } catch (e) {
      console.error('Error checking if goal is doing well:',e);
      return false;
    }
  },[]);
  
  // Function to check if a goal is "still building"
  const isGoalStillBuilding = useCallback((goal) => {
    try {
      // Check if the goal has at least 2 promises (steps)
      const hasAtLeastTwoPromises = goal.steps && goal.steps.length >= 2;
      if (!hasAtLeastTwoPromises) {
        return true; // Still building if doesn't have at least 2 promises
      }
      
      // Check if each promise has at least 1 initiative
      let allPromisesHaveInitiatives = true;
      if (goal.steps) {
        for (const step of goal.steps) {
          if (!step.tasks || step.tasks.length === 0) {
            allPromisesHaveInitiatives = false;
            break;
          }
        }
      }
      if (!allPromisesHaveInitiatives) {
        return true; // Still building if not all promises have initiatives
      }
      
      // Count total UNCOMPLETED next actions across all branches
      let totalUncompletedNextActions = 0;
      if (goal.steps) {
        for (const step of goal.steps) {
          if (step.tasks) {
            for (const task of step.tasks) {
              if (task.initiatives) {
                // Only count initiatives that are NOT completed
                totalUncompletedNextActions += task.initiatives.filter(initiative => !initiative.completed).length;
              }
            }
          }
        }
      }
      
      // Check if there are at least 2 uncompleted next actions total
      if (totalUncompletedNextActions < 2) {
        return true; // Still building if less than 2 uncompleted next actions total
      }
      
      return false; // Not still building if meets all criteria
    } catch (e) {
      console.error('Error checking if goal is still building:', e);
      return true; // Assume still building on error
    }
  }, []);

  // Intelligent filter function
  const applyIntelligentFilter=useCallback((filterType)=> {
    if (filterType==='all') {
      setIntelligentFilterResults(null);
      setShowingFilterResults(false);
      setViewingFilteredItemHierarchy(false);// Reset hierarchy view
      setSelectedFilteredHierarchy({goal: null,step: null,task: null});// Reset hierarchy
      return;
    }

    const results={goals: [],steps: [],tasks: [],initiatives: []};

    data.goals?.forEach(goal=> {
      // Check goals for ending soon or overdue reports
      if (filterType==='ending-soon') {
        const timeline=getTimelineProgress(goal);
        if (timeline.isOrangeOrRed) {
          results.goals.push(goal);
        }
      } else if (filterType==='report-dates') {
        const reportStatus=getNextReportStatus(goal);
        if (reportStatus.isAlmostDueOrOverdue) {
          results.goals.push(goal);
        }
      } else if (filterType==='doing-well') {
        // Check if goal is doing well
        if (isGoalDoingWell(goal)) {
          results.goals.push(goal);
        }
      } else if (filterType==='still-building') {
        // Check if goal is still building
        if (isGoalStillBuilding(goal)) {
          results.goals.push(goal);
        }
      }

      // Check steps (promises)
      goal.steps?.forEach(step=> {
        if (filterType==='not-started-promises' && step.status==='Not started') {
          results.steps.push({...step,parentGoal: goal});
        } else if (filterType==='at-risk-promises' && step.status==='At risk') {
          results.steps.push({...step,parentGoal: goal});
        }

        // Check tasks (initiatives)
        step.tasks?.forEach(task=> {
          if (filterType==='struggling-initiatives' && task.progress==='Struggling') {
            results.tasks.push({...task,parentGoal: goal,parentStep: step});
          }
        });
      });
    });

    setIntelligentFilterResults(results);
    setShowingFilterResults(true);
    setViewingFilteredItemHierarchy(false);// Reset hierarchy view
    setSelectedFilteredHierarchy({goal: null,step: null,task: null});// Reset hierarchy

    // Store original selections to restore later
    setOriginalSelections({
      goal: selectedGoal,
      step: selectedStep,
      task: selectedTask
    });

    // Clear selections when showing filter results
    setSelectedGoal(null);
    setSelectedStep(null);
    setSelectedTask(null);
  },[data.goals,selectedGoal,selectedStep,selectedTask,isGoalDoingWell,isGoalStillBuilding]);

  // MODIFIED: Handle critical filter changes with priority override
  const handleCriticalFilterChange=useCallback((newFilterValue)=> {
    // PRIORITY OVERRIDE: Reset ALL view states when filter changes
    setShowingFilterResults(false);
    setViewingFilteredItemHierarchy(false);
    setSelectedFilteredHierarchy({goal: null,step: null,task: null});
    setShowingSearchResults(false);
    setViewingSearchItemHierarchy(false);
    setSelectedSearchHierarchy({goal: null,step: null,task: null});
    setSelectedGoal(null);
    setSelectedStep(null);
    setSelectedTask(null);
    setIntelligentFilterResults(null);

    // Set the new filter value
    setCriticalFilter(newFilterValue);

    // Apply the new filter immediately
    setTimeout(()=> {
      applyIntelligentFilter(newFilterValue);
    },0);
  },[applyIntelligentFilter]);

  // Function to return to filter results
  const returnToFilterResults=useCallback(()=> {
    setSelectedGoal(null);
    setSelectedStep(null);
    setSelectedTask(null);
    setShowingFilterResults(true);
    setViewingFilteredItemHierarchy(false);// Reset hierarchy view
    setSelectedFilteredHierarchy({goal: null,step: null,task: null});// Reset hierarchy
  },[]);

  // MODIFIED: Function to expand item and show its hierarchy
  const expandItemHierarchy=useCallback((item,itemType)=> {
    setShowingFilterResults(false);
    setViewingFilteredItemHierarchy(true);// Set that we're viewing filtered item hierarchy

    let goalToSet=null;
    let stepToSet=null;
    let taskToSet=null;

    if (itemType==='goal') {
      goalToSet=item;
      setSelectedGoal(item);
      setSelectedStep(null);
      setSelectedTask(null);
    } else if (itemType==='step') {
      // Find parent goal - first check if it's already included in the item
      if (item.parentGoal) {
        goalToSet=item.parentGoal;
        stepToSet=item;
        setSelectedGoal(item.parentGoal);
        setSelectedStep(item);
        setSelectedTask(null);
      } else {
        // Otherwise search for it
        const parentGoal=data.goals?.find(goal=> 
          goal.steps?.some(step=> step.id===item.id)
        );
        if (parentGoal) {
          goalToSet=parentGoal;
          stepToSet=item;
          setSelectedGoal(parentGoal);
          setSelectedStep(item);
          setSelectedTask(null);
        }
      }
    } else if (itemType==='task') {
      // Check if parent references are already included
      if (item.parentGoal && item.parentStep) {
        goalToSet=item.parentGoal;
        stepToSet=item.parentStep;
        taskToSet=item;
        setSelectedGoal(item.parentGoal);
        setSelectedStep(item.parentStep);
        setSelectedTask(item);
      } else {
        // Otherwise search for them
        let parentGoal=null;
        let parentStep=null;

        data.goals?.forEach(goal=> {
          goal.steps?.forEach(step=> {
            if (step.tasks?.some(task=> task.id===item.id)) {
              parentGoal=goal;
              parentStep=step;
            }
          });
        });

        if (parentGoal && parentStep) {
          goalToSet=parentGoal;
          stepToSet=parentStep;
          taskToSet=item;
          setSelectedGoal(parentGoal);
          setSelectedStep(parentStep);
          setSelectedTask(item);
        }
      }
    }

    // Store the hierarchy for filtered view
    setSelectedFilteredHierarchy({
      goal: goalToSet,
      step: stepToSet,
      task: taskToSet
    });
  },[data.goals]);

  // Memoized filter function to avoid recalculating on every render
  const getFilteredItems=useCallback((items)=> {
    if (!items || !Array.isArray(items)) return [];

    try {
      let filtered=[...items];// Create a copy to avoid mutating original

      // Apply completion filter
      if (filter==='active') {
        filtered=filtered.filter(item=> item && !item.completed);
      } else if (filter==='completed') {
        filtered=filtered.filter(item=> item && item.completed);
      }

      // NOTE: Search filtering is now handled separately in performComprehensiveSearch
      // Only apply search filter if we're not showing search results
      if (searchQuery && searchQuery.trim() && !showingSearchResults && !viewingSearchItemHierarchy) {
        filtered=filtered.filter(item=> searchInAllFields(item,searchQuery.trim()));
      }

      return filtered;
    } catch (error) {
      console.error('Error in getFilteredItems:',error);
      return items || [];// Return original items on error
    }
  },[filter,searchQuery,searchInAllFields,showingSearchResults,viewingSearchItemHierarchy]);

  // MODIFIED: Memoized filtered data - consider all view states
  const goals=useMemo(()=> {
    try {
      // Search results view
      if (showingSearchResults && !viewingSearchItemHierarchy) {
        return getFilteredItems(searchResults.goals || []);
      }

      // Search item hierarchy view
      if (viewingSearchItemHierarchy && selectedSearchHierarchy.goal) {
        return getFilteredItems([selectedSearchHierarchy.goal]);
      }

      // Filter results view
      if (showingFilterResults && intelligentFilterResults && !viewingFilteredItemHierarchy) {
        return getFilteredItems(intelligentFilterResults.goals || []);
      }

      // Filter item hierarchy view
      if (viewingFilteredItemHierarchy && selectedFilteredHierarchy.goal) {
        return getFilteredItems([selectedFilteredHierarchy.goal]);
      }

      // Normal view
      return getFilteredItems(data?.goals || []);
    } catch (error) {
      console.error('Error filtering goals:',error);
      return data?.goals || [];
    }
  },[data?.goals,getFilteredItems,forceRefresh,showingFilterResults,intelligentFilterResults,viewingFilteredItemHierarchy,selectedFilteredHierarchy,showingSearchResults,searchResults,viewingSearchItemHierarchy,selectedSearchHierarchy]);

  const steps=useMemo(()=> {
    try {
      // Search results view
      if (showingSearchResults && !viewingSearchItemHierarchy) {
        return getFilteredItems(searchResults.steps || []);
      }

      // Search item hierarchy view
      if (viewingSearchItemHierarchy) {
        if (selectedSearchHierarchy.step) {
          return getFilteredItems([selectedSearchHierarchy.step]);
        } else if (selectedSearchHierarchy.goal) {
          return getFilteredItems(selectedSearchHierarchy.goal.steps || []);
        }
      }

      // Filter results view
      if (showingFilterResults && intelligentFilterResults && !viewingFilteredItemHierarchy) {
        return getFilteredItems(intelligentFilterResults.steps || []);
      }

      // Filter item hierarchy view
      if (viewingFilteredItemHierarchy) {
        if (selectedFilteredHierarchy.step) {
          return getFilteredItems([selectedFilteredHierarchy.step]);
        } else if (selectedFilteredHierarchy.goal) {
          return getFilteredItems(selectedFilteredHierarchy.goal.steps || []);
        }
      }

      // Normal view
      return selectedGoal ? getFilteredItems(selectedGoal.steps || []) : [];
    } catch (error) {
      console.error('Error filtering steps:',error);
      return selectedGoal?.steps || [];
    }
  },[selectedGoal,getFilteredItems,forceRefresh,showingFilterResults,intelligentFilterResults,viewingFilteredItemHierarchy,selectedFilteredHierarchy,showingSearchResults,searchResults,viewingSearchItemHierarchy,selectedSearchHierarchy]);

  const tasks=useMemo(()=> {
    try {
      // Search results view
      if (showingSearchResults && !viewingSearchItemHierarchy) {
        return getFilteredItems(searchResults.tasks || []);
      }

      // Search item hierarchy view
      if (viewingSearchItemHierarchy) {
        if (selectedSearchHierarchy.task) {
          return getFilteredItems([selectedSearchHierarchy.task]);
        } else if (selectedSearchHierarchy.step) {
          return getFilteredItems(selectedSearchHierarchy.step.tasks || []);
        }
      }

      // Filter results view
      if (showingFilterResults && intelligentFilterResults && !viewingFilteredItemHierarchy) {
        return getFilteredItems(intelligentFilterResults.tasks || []);
      }

      // Filter item hierarchy view
      if (viewingFilteredItemHierarchy) {
        if (selectedFilteredHierarchy.task) {
          return getFilteredItems([selectedFilteredHierarchy.task]);
        } else if (selectedFilteredHierarchy.step) {
          return getFilteredItems(selectedFilteredHierarchy.step.tasks || []);
        }
      }

      // Normal view
      return selectedStep ? getFilteredItems(selectedStep.tasks || []) : [];
    } catch (error) {
      console.error('Error filtering tasks:',error);
      return selectedStep?.tasks || [];
    }
  },[selectedStep,getFilteredItems,forceRefresh,showingFilterResults,intelligentFilterResults,viewingFilteredItemHierarchy,selectedFilteredHierarchy,showingSearchResults,searchResults,viewingSearchItemHierarchy,selectedSearchHierarchy]);

  const initiatives=useMemo(()=> {
    try {
      // Search results view
      if (showingSearchResults && !viewingSearchItemHierarchy) {
        return getFilteredItems(searchResults.initiatives || []);
      }

      // Search item hierarchy view
      if (viewingSearchItemHierarchy && selectedSearchHierarchy.task) {
        return getFilteredItems(selectedSearchHierarchy.task.initiatives || []);
      }

      // Filter results view
      if (showingFilterResults && intelligentFilterResults && !viewingFilteredItemHierarchy) {
        return getFilteredItems(intelligentFilterResults.initiatives || []);
      }

      // Filter item hierarchy view
      if (viewingFilteredItemHierarchy && selectedFilteredHierarchy.task) {
        return getFilteredItems(selectedFilteredHierarchy.task.initiatives || []);
      }

      // Normal view
      return selectedTask ? getFilteredItems(selectedTask.initiatives || []) : [];
    } catch (error) {
      console.error('Error filtering initiatives:',error);
      return selectedTask?.initiatives || [];
    }
  },[selectedTask,getFilteredItems,forceRefresh,showingFilterResults,intelligentFilterResults,viewingFilteredItemHierarchy,selectedFilteredHierarchy,showingSearchResults,searchResults,viewingSearchItemHierarchy,selectedSearchHierarchy]);

  // MODIFIED: Handle item selection - now considers search results too
  const handleGoalSelect=useCallback((goal)=> {
    if (showingSearchResults) {
      expandSearchItemHierarchy(goal,'goal');
    } else if (showingFilterResults) {
      expandItemHierarchy(goal,'goal');
    } else {
      setSelectedGoal(goal);
      setSelectedStep(null);
      setSelectedTask(null);
    }
  },[showingSearchResults,showingFilterResults,expandSearchItemHierarchy,expandItemHierarchy]);

  const handleStepSelect=useCallback((step)=> {
    if (showingSearchResults) {
      expandSearchItemHierarchy(step,'step');
    } else if (showingFilterResults) {
      expandItemHierarchy(step,'step');
    } else {
      setSelectedStep(step);
      setSelectedTask(null);
    }
  },[showingSearchResults,showingFilterResults,expandSearchItemHierarchy,expandItemHierarchy]);

  const handleTaskSelect=useCallback((task)=> {
    if (showingSearchResults) {
      expandSearchItemHierarchy(task,'task');
    } else if (showingFilterResults) {
      expandItemHierarchy(task,'task');
    } else {
      setSelectedTask(task);
    }
  },[showingSearchResults,showingFilterResults,expandSearchItemHierarchy,expandItemHierarchy]);

  // NEW: Handle initiative selection for search results
  const handleInitiativeSelect=useCallback((initiative)=> {
    if (showingSearchResults) {
      expandSearchItemHierarchy(initiative,'initiative');
    }
  },[showingSearchResults,expandSearchItemHierarchy]);

  // Force refresh helper
  const triggerForceRefresh=useCallback(()=> {
    setForceRefresh(prev=> prev + 1);
  },[]);

  // Default values for new items
  const getDefaultValues=useCallback((type)=> {
    const defaults={
      goal: {
        title: "",
        amount: "",
        startDate: format(new Date(),'yyyy-MM-dd'),
        endDate: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)),'yyyy-MM-dd'),
        nextReportDate: format(new Date(new Date().setMonth(new Date().getMonth() + 3)),'yyyy-MM-dd'),// Default to 3 months from now
      },
      step: {
        title: "New Promise",
        status: "Not started",
      },
      task: {
        title: "New Initiative",
        progress: "Going well",
      },
      initiative: {
        title: "New Next Action",
        assignee: "",
        priority: "Medium",
      }
    };

    return defaults[type] || {title: `New ${type}`};
  },[]);

  // Add new items - optimized with useCallback to prevent recreation
  const addNewItem=useCallback((type,title=null,additionalData={})=> {
    try {
      setData(prevData=> {
        const updateData={...prevData};
        let newItemId=null;
        const defaultValues=getDefaultValues(type);

        switch (type) {
          case 'goal':
            // Make sure end date is after start date
            let startDate=additionalData.startDate || defaultValues.startDate;
            let endDate=additionalData.endDate || defaultValues.endDate;

            const startDateObj=new Date(startDate);
            const endDateObj=new Date(endDate);

            if (endDateObj <=startDateObj) {
              // If end date is before or equal to start date,set it to one year after
              endDate=format(new Date(startDateObj.setFullYear(startDateObj.getFullYear() + 1)),'yyyy-MM-dd');
            }

            const newGoal={
              id: uuidv4(),
              title: title || defaultValues.title,
              completed: false,
              priority: (updateData.goals?.length || 0) + 1,
              orderIndex: (updateData.goals?.length || 0) + 1,
              steps: [],
              amount: additionalData.amount || defaultValues.amount,
              startDate: startDate,
              endDate: endDate,
              nextReportDate: additionalData.nextReportDate || defaultValues.nextReportDate,
            };

            // Ensure goals array exists
            if (!updateData.goals) {
              updateData.goals=[];
            }

            updateData.goals.push(newGoal);
            setSelectedGoal(newGoal);

            // Clear other selections when adding a new goal
            setSelectedStep(null);
            setSelectedTask(null);

            newItemId=newGoal.id;
            break;

          case 'step':
            if (!selectedGoal) return updateData;

            const goalIndex=updateData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (goalIndex===-1) return updateData;

            if (!updateData.goals[goalIndex].steps) {
              updateData.goals[goalIndex].steps=[];
            }

            const newStep={
              id: uuidv4(),
              goalId: selectedGoal.id,
              title: title || defaultValues.title,
              completed: false,
              priority: (updateData.goals[goalIndex].steps.length || 0) + 1,
              orderIndex: (updateData.goals[goalIndex].steps.length || 0) + 1,
              tasks: [],
              status: additionalData.status || defaultValues.status,
            };

            updateData.goals[goalIndex].steps.push(newStep);
            setSelectedStep(newStep);
            setSelectedTask(null);

            newItemId=newStep.id;
            break;

          case 'task':
            if (!selectedStep || !selectedGoal) return updateData;

            const gIndex=updateData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (gIndex===-1) return updateData;

            const sIndex=updateData.goals[gIndex].steps.findIndex(s=> s.id===selectedStep.id);
            if (sIndex===-1) return updateData;

            if (!updateData.goals[gIndex].steps[sIndex].tasks) {
              updateData.goals[gIndex].steps[sIndex].tasks=[];
            }

            const newTask={
              id: uuidv4(),
              stepId: selectedStep.id,
              title: title || defaultValues.title,
              completed: false,
              priority: (updateData.goals[gIndex].steps[sIndex].tasks.length || 0) + 1,
              orderIndex: (updateData.goals[gIndex].steps[sIndex].tasks.length || 0) + 1,
              initiatives: [],
              progress: additionalData.progress || defaultValues.progress,
            };

            updateData.goals[gIndex].steps[sIndex].tasks.push(newTask);
            setSelectedTask(newTask);

            newItemId=newTask.id;
            break;

          case 'initiative':
            if (!selectedTask || !selectedStep || !selectedGoal) return updateData;

            const goalIdx=updateData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (goalIdx===-1) return updateData;

            const stepIdx=updateData.goals[goalIdx].steps.findIndex(s=> s.id===selectedStep.id);
            if (stepIdx===-1) return updateData;

            const taskIdx=updateData.goals[goalIdx].steps[stepIdx].tasks.findIndex(t=> t.id===selectedTask.id);
            if (taskIdx===-1) return updateData;

            if (!updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives) {
              updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives=[];
            }

            const newInitiative={
              id: uuidv4(),
              taskId: selectedTask.id,
              title: title || defaultValues.title,
              completed: false,
              priority: additionalData.priority || defaultValues.priority,
              assignee: additionalData.assignee || defaultValues.assignee,
              orderIndex: (updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives.length || 0) + 1,
            };

            updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives.push(newInitiative);

            newItemId=newInitiative.id;
            break;
        }

        // Set the newly created item as the one being edited if no title provided
        if (newItemId && !title) {
          setEditingNewItem({id: newItemId,type: type});
        }

        return updateData;
      });

      // Force refresh to ensure immediate display
      setTimeout(()=> {
        triggerForceRefresh();
      },0);

    } catch (error) {
      console.error('Error adding new item:',error);
    }
  },[selectedGoal,selectedStep,selectedTask,setData,triggerForceRefresh,getDefaultValues]);

  // Edit item title - optimized to reduce unnecessary iterations
  const editItemTitle=useCallback((id,type,newTitle,additionalData={})=> {
    try {
      setData(prevData=> {
        const updateData={...prevData};

        const findAndUpdate=(items,id)=> {
          const index=items.findIndex(i=> i.id===id);
          if (index !==-1) {
            // For goal type,ensure end date is after start date
            if (type==='goal' && additionalData.startDate && additionalData.endDate) {
              const startDate=new Date(additionalData.startDate);
              const endDate=new Date(additionalData.endDate);

              if (endDate <=startDate) {
                // If end date is before or equal to start date,set it to one year after
                additionalData.endDate=format(
                  new Date(startDate.setFullYear(startDate.getFullYear() + 1)),
                  'yyyy-MM-dd'
                );
              }
            }

            items[index]={...items[index],title: newTitle,...additionalData};
            return true;
          }
          return false;
        };

        switch (type) {
          case 'goal':
            findAndUpdate(updateData.goals || [],id);
            break;

          case 'step':
            for (const goal of updateData.goals || []) {
              if (goal.steps && findAndUpdate(goal.steps,id)) break;
            }
            break;

          case 'task':
            for (const goal of updateData.goals || []) {
              if (!goal.steps) continue;
              let found=false;
              for (const step of goal.steps) {
                if (step.tasks && findAndUpdate(step.tasks,id)) {
                  found=true;
                  break;
                }
              }
              if (found) break;
            }
            break;

          case 'initiative':
            for (const goal of updateData.goals || []) {
              if (!goal.steps) continue;
              let found=false;
              for (const step of goal.steps) {
                if (!step.tasks) continue;
                for (const task of step.tasks) {
                  if (task.initiatives && findAndUpdate(task.initiatives,id)) {
                    found=true;
                    break;
                  }
                }
                if (found) break;
              }
              if (found) break;
            }
            break;
        }

        return updateData;
      });

      // Clear the editing state after saving
      if (editingNewItem && editingNewItem.id===id) {
        setEditingNewItem(null);
      }

      // Force refresh to ensure immediate display
      setTimeout(()=> {
        triggerForceRefresh();
      },0);

    } catch (error) {
      console.error('Error editing item title:',error);
    }
  },[setData,editingNewItem,triggerForceRefresh]);

  // Edit column header title
  const editColumnHeader=useCallback((type,newTitle)=> {
    setData(prevData=> {
      const updateData={...prevData};

      if (!updateData.columnHeaders) {
        updateData.columnHeaders={...defaultTemplate.columnHeaders};
      }

      // Update the column header with the new title
      updateData.columnHeaders[type]=newTitle;

      return updateData;
    });

    setEditingHeader(null);// Clear editing state
  },[setData]);

  // Handle completion toggle - optimized with early exits and cascading completion
  const toggleCompletion=useCallback((itemId,type)=> {
    setData(prevData=> {
      const updateData={...prevData};

      // Function to set completed status for an item and its children
      const setCompletionStatus=(item,status)=> {
        item.completed=status;

        // Recursively set completion status for children
        if (type==='goal' && item.steps) {
          item.steps.forEach(step=> {
            setCompletionStatus(step,status);
            if (step.tasks) {
              step.tasks.forEach(task=> {
                setCompletionStatus(task,status);
                if (task.initiatives) {
                  task.initiatives.forEach(initiative=> {
                    initiative.completed=status;
                  });
                }
              });
            }
          });
        } else if (type==='step' && item.tasks) {
          item.tasks.forEach(task=> {
            setCompletionStatus(task,status);
            if (task.initiatives) {
              task.initiatives.forEach(initiative=> {
                initiative.completed=status;
              });
            }
          });
        } else if (type==='task' && item.initiatives) {
          item.initiatives.forEach(initiative=> {
            initiative.completed=status;
          });
        }
      };

      switch (type) {
        case 'goal':
          const goalIndex=updateData.goals.findIndex(g=> g.id===itemId);
          if (goalIndex !==-1) {
            const newStatus=!updateData.goals[goalIndex].completed;
            setCompletionStatus(updateData.goals[goalIndex],newStatus);
          }
          break;

        case 'step':
          for (const goal of updateData.goals) {
            if (!goal.steps) continue;
            const stepIndex=goal.steps.findIndex(s=> s.id===itemId);
            if (stepIndex !==-1) {
              const newStatus=!goal.steps[stepIndex].completed;
              setCompletionStatus(goal.steps[stepIndex],newStatus);
              break;
            }
          }
          break;

        case 'task':
          for (const goal of updateData.goals) {
            if (!goal.steps) continue;
            let found=false;
            for (const step of goal.steps) {
              if (!step.tasks) continue;
              const taskIndex=step.tasks.findIndex(t=> t.id===itemId);
              if (taskIndex !==-1) {
                const newStatus=!step.tasks[taskIndex].completed;
                setCompletionStatus(step.tasks[taskIndex],newStatus);
                found=true;
                break;
              }
            }
            if (found) break;
          }
          break;

        case 'initiative':
          for (const goal of updateData.goals) {
            if (!goal.steps) continue;
            let found=false;
            for (const step of goal.steps) {
              if (!step.tasks) continue;
              for (const task of step.tasks) {
                if (!task.initiatives) continue;
                const initiativeIndex=task.initiatives.findIndex(i=> i.id===itemId);
                if (initiativeIndex !==-1) {
                  task.initiatives[initiativeIndex].completed=!task.initiatives[initiativeIndex].completed;
                  found=true;
                  break;
                }
              }
              if (found) break;
            }
            if (found) break;
          }
          break;
      }

      return updateData;
    });

    // Force refresh to ensure immediate display
    triggerForceRefresh();
  },[setData,triggerForceRefresh]);

  // Delete item - optimized with direct filtering
  const deleteItem=useCallback((itemId,type)=> {
    setData(prevData=> {
      const updateData={...prevData};

      switch (type) {
        case 'goal':
          updateData.goals=updateData.goals.filter(g=> g.id !==itemId);
          if (selectedGoal && selectedGoal.id===itemId) {
            setSelectedGoal(null);
            setSelectedStep(null);
            setSelectedTask(null);
          }
          break;

        case 'step':
          for (let i=0;i < updateData.goals.length;i++) {
            const goal=updateData.goals[i];
            if (goal.steps) {
              goal.steps=goal.steps.filter(s=> s.id !==itemId);
            }
          }
          if (selectedStep && selectedStep.id===itemId) {
            setSelectedStep(null);
            setSelectedTask(null);
          }
          break;

        case 'task':
          for (let i=0;i < updateData.goals.length;i++) {
            const goal=updateData.goals[i];
            if (!goal.steps) continue;
            for (let j=0;j < goal.steps.length;j++) {
              const step=goal.steps[j];
              if (step.tasks) {
                step.tasks=step.tasks.filter(t=> t.id !==itemId);
              }
            }
          }
          if (selectedTask && selectedTask.id===itemId) {
            setSelectedTask(null);
          }
          break;

        case 'initiative':
          for (let i=0;i < updateData.goals.length;i++) {
            const goal=updateData.goals[i];
            if (!goal.steps) continue;
            for (let j=0;j < goal.steps.length;j++) {
              const step=goal.steps[j];
              if (!step.tasks) continue;
              for (let k=0;k < step.tasks.length;k++) {
                const task=step.tasks[k];
                if (task.initiatives) {
                  task.initiatives=task.initiatives.filter(i=> i.id !==itemId);
                }
              }
            }
          }
          break;
      }

      return updateData;
    });

    // Force refresh to ensure immediate display
    triggerForceRefresh();
  },[selectedGoal,selectedStep,selectedTask,setData,triggerForceRefresh]);

  // Export data
  const handleExport=useCallback(()=> {
    // Use last filename as default,or fallback to default
    const defaultFilename=lastExportFilename || "donor-promises-data";
    const customFilename=prompt("Enter a name for your file:",defaultFilename);

    if (customFilename===null) return;// User cancelled

    // Save the filename for next time
    setLastExportFilename(customFilename);

    // Format the current date
    const currentDate=new Date();
    const formattedDate=format(currentDate,"dd-MMM-yyyy");

    // Create the full filename with date
    const fullFilename=`${customFilename}-${formattedDate}`;

    const dataStr=JSON.stringify(data,null,2);
    const dataBlob=new Blob([dataStr],{type: 'application/json'});

    const url=URL.createObjectURL(dataBlob);
    const link=document.createElement('a');
    link.href=url;
    link.download=`${fullFilename}.json`;
    link.click();

    URL.revokeObjectURL(url);
  },[data,lastExportFilename,setLastExportFilename]);

  // Import data
  const handleImport=useCallback((event)=> {
    const file=event.target.files[0];
    if (file) {
      const reader=new FileReader();
      reader.onload=(e)=> {
        try {
          const importedData=JSON.parse(e.target.result);
          setData(importedData);

          // Reset selections
          setSelectedGoal(null);
          setSelectedStep(null);
          setSelectedTask(null);

          // Force refresh to ensure immediate display
          triggerForceRefresh();
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    }
  },[setData,triggerForceRefresh]);

  // Reset to empty template
  const handleReset=useCallback(()=> {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setData(defaultTemplate);
      setSelectedGoal(null);
      setSelectedStep(null);
      setSelectedTask(null);

      // Force refresh to ensure immediate display
      triggerForceRefresh();
    }
  },[setData,triggerForceRefresh]);

  // Copy data to clipboard as indented outline (no bullets)
  const handleCopy=useCallback(()=> {
    const generateIndentedOutline=(data)=> {
      let outline='';

      (data?.goals || []).forEach(goal=> {
        outline +=`${goal.title}${goal.completed ? ' ✓' : ''}\n`;

        (goal.steps || []).forEach(step=> {
          outline +=`  ${step.title}${step.completed ? ' ✓' : ''}\n`;

          (step.tasks || []).forEach(task=> {
            outline +=`    ${task.title}${task.completed ? ' ✓' : ''}\n`;

            (task.initiatives || []).forEach(initiative=> {
              outline +=`      ${initiative.title}${initiative.completed ? ' ✓' : ''}\n`;
            });
          });
        });
      });

      return outline.trim();
    };

    const outline=generateIndentedOutline(data);
    navigator.clipboard.writeText(outline).then(()=> {
      alert('Indented outline copied to clipboard');
    });
  },[data]);

  // Handle DnD start event
  const handleDragStart=useCallback((event)=> {
    const {active}=event;
    setActiveDragData(active.data.current);
  },[]);

  // Handle DnD events
  const handleDragEnd=useCallback((event)=> {
    const {active,over}=event;

    setActiveDragData(null);

    if (!over || active.id===over.id) return;

    const activeId=active.id;
    const overId=over.id;
    const activeData=active.data.current;
    const overData=over.data.current;

    // Only allow reordering within the same type
    if (activeData.type !==overData.type) return;

    setData(prevData=> {
      const newData=JSON.parse(JSON.stringify(prevData));// Deep clone to ensure all references are updated

      switch (activeData.type) {
        case 'goal':
          // Find active and over item indices
          const goalActiveIndex=newData.goals.findIndex(g=> g.id===activeId);
          const goalOverIndex=newData.goals.findIndex(g=> g.id===overId);

          if (goalActiveIndex !==-1 && goalOverIndex !==-1) {
            // Reorder goals
            newData.goals=arrayMove(
              newData.goals,
              goalActiveIndex,
              goalOverIndex
            );

            // Update order indices
            newData.goals.forEach((goal,idx)=> {
              goal.orderIndex=idx + 1;
            });
          }
          break;

        case 'step':
          // Handle step reordering
          if (selectedGoal) {
            const goalIndex=newData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (goalIndex !==-1 && newData.goals[goalIndex].steps) {
              const steps=newData.goals[goalIndex].steps;
              const stepActiveIndex=steps.findIndex(s=> s.id===activeId);
              const stepOverIndex=steps.findIndex(s=> s.id===overId);

              if (stepActiveIndex !==-1 && stepOverIndex !==-1) {
                // Reorder steps
                newData.goals[goalIndex].steps=arrayMove(
                  steps,
                  stepActiveIndex,
                  stepOverIndex
                );

                // Update order indices
                newData.goals[goalIndex].steps.forEach((step,idx)=> {
                  step.orderIndex=idx + 1;
                });
              }
            }
          }
          break;

        case 'task':
          // Handle task reordering
          if (selectedGoal && selectedStep) {
            const goalIndex=newData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (goalIndex !==-1 && newData.goals[goalIndex].steps) {
              const stepIndex=newData.goals[goalIndex].steps.findIndex(s=> s.id===selectedStep.id);
              if (stepIndex !==-1 && newData.goals[goalIndex].steps[stepIndex].tasks) {
                const tasks=newData.goals[goalIndex].steps[stepIndex].tasks;
                const taskActiveIndex=tasks.findIndex(t=> t.id===activeId);
                const taskOverIndex=tasks.findIndex(t=> t.id===overId);

                if (taskActiveIndex !==-1 && taskOverIndex !==-1) {
                  // Reorder tasks
                  newData.goals[goalIndex].steps[stepIndex].tasks=arrayMove(
                    tasks,
                    taskActiveIndex,
                    taskOverIndex
                  );

                  // Update order indices
                  newData.goals[goalIndex].steps[stepIndex].tasks.forEach((task,idx)=> {
                    task.orderIndex=idx + 1;
                  });
                }
              }
            }
          }
          break;

        case 'initiative':
          // Handle initiative reordering
          if (selectedGoal && selectedStep && selectedTask) {
            const goalIndex=newData.goals.findIndex(g=> g.id===selectedGoal.id);
            if (goalIndex !==-1 && newData.goals[goalIndex].steps) {
              const stepIndex=newData.goals[goalIndex].steps.findIndex(s=> s.id===selectedStep.id);
              if (stepIndex !==-1 && newData.goals[goalIndex].steps[stepIndex].tasks) {
                const taskIndex=newData.goals[goalIndex].steps[stepIndex].tasks.findIndex(t=> t.id===selectedTask.id);
                if (taskIndex !==-1 && newData.goals[goalIndex].steps[stepIndex].tasks[taskIndex].initiatives) {
                  const initiatives=newData.goals[goalIndex].steps[stepIndex].tasks[taskIndex].initiatives;
                  const initiativeActiveIndex=initiatives.findIndex(i=> i.id===activeId);
                  const initiativeOverIndex=initiatives.findIndex(i=> i.id===overId);

                  if (initiativeActiveIndex !==-1 && initiativeOverIndex !==-1) {
                    // Reorder initiatives
                    newData.goals[goalIndex].steps[stepIndex].tasks[taskIndex].initiatives=arrayMove(
                      initiatives,
                      initiativeActiveIndex,
                      initiativeOverIndex
                    );

                    // Update order indices
                    newData.goals[goalIndex].steps[stepIndex].tasks[taskIndex].initiatives.forEach((initiative,idx)=> {
                      initiative.orderIndex=idx + 1;
                    });
                  }
                }
              }
            }
          }
          break;
      }

      return newData;
    });

    // Force refresh to ensure immediate display
    triggerForceRefresh();
  },[selectedGoal,selectedStep,selectedTask,setData,triggerForceRefresh]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Donor Promises GET DONE!"
        subtitle="Track your promises to donors and then deliver on them"
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        criticalFilter={criticalFilter}
        setCriticalFilter={handleCriticalFilterChange}
        counts={{}}
        onExport={handleExport}
        onImport={handleImport}
        onCopy={handleCopy}
        onReset={handleReset}
        showingFilterResults={showingFilterResults && !viewingFilteredItemHierarchy}
        showingSearchResults={showingSearchResults && !viewingSearchItemHierarchy}
        onReturnToFilterResults={returnToFilterResults}
        onReturnToSearchResults={returnToSearchResults}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            initial={{opacity: 0,y: 10}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.2}}
          >
            <Column
              title={data?.columnHeaders?.goals || "Donor"}
              items={goals}
              onSelect={handleGoalSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'goal')}
              onAdd={(title,additionalData)=> addNewItem('goal',title,additionalData)}
              onEdit={(id,title,additionalData)=> editItemTitle(id,'goal',title,additionalData)}
              onDelete={(id)=> deleteItem(id,'goal')}
              selectedId={selectedGoal?.id}
              type="goal"
              editingNewItemId={editingNewItem && editingNewItem.type==='goal' ? editingNewItem.id : null}
              isEditingHeader={editingHeader==='goals'}
              onEditHeader={(newTitle)=> editColumnHeader('goals',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('goals')}
              forceRefresh={forceRefresh}
              fields={[
                {name: 'amount',label: 'Total Amount',type: 'text'},
                {name: 'startDate',label: 'Start Date',type: 'date'},
                {name: 'endDate',label: 'End Date',type: 'date'},
                {name: 'nextReportDate',label: 'Next Report Date',type: 'date'}
              ]}
              useDonorNameLabel={true}
            />

            <Column
              title={data?.columnHeaders?.steps || "Promises"}
              items={steps}
              onSelect={handleStepSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'step')}
              onAdd={(title,additionalData)=> addNewItem('step',title,additionalData)}
              onEdit={(id,title,additionalData)=> editItemTitle(id,'step',title,additionalData)}
              onDelete={(id)=> deleteItem(id,'step')}
              selectedId={selectedStep?.id}
              type="step"
              disabled={!selectedGoal && !showingFilterResults && !selectedFilteredHierarchy.goal && !showingSearchResults && !selectedSearchHierarchy.goal}
              editingNewItemId={editingNewItem && editingNewItem.type==='step' ? editingNewItem.id : null}
              isEditingHeader={editingHeader==='steps'}
              onEditHeader={(newTitle)=> editColumnHeader('steps',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('steps')}
              forceRefresh={forceRefresh}
              fields={[
                {name: 'status',label: 'Status',type: 'select',options: [
                  {value: 'Not started',label: 'Not started'},
                  {value: 'On track',label: 'On track'},
                  {value: 'At risk',label: 'At risk'}
                ]}
              ]}
            />

            <Column
              title={data?.columnHeaders?.tasks || "Initiatives"}
              items={tasks}
              onSelect={handleTaskSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'task')}
              onAdd={(title,additionalData)=> addNewItem('task',title,additionalData)}
              onEdit={(id,title,additionalData)=> editItemTitle(id,'task',title,additionalData)}
              onDelete={(id)=> deleteItem(id,'task')}
              selectedId={selectedTask?.id}
              type="task"
              disabled={!selectedStep && !showingFilterResults && !selectedFilteredHierarchy.step && !showingSearchResults && !selectedSearchHierarchy.step}
              editingNewItemId={editingNewItem && editingNewItem.type==='task' ? editingNewItem.id : null}
              isEditingHeader={editingHeader==='tasks'}
              onEditHeader={(newTitle)=> editColumnHeader('tasks',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('tasks')}
              forceRefresh={forceRefresh}
              fields={[
                {name: 'progress',label: 'Progress',type: 'select',options: [
                  {value: 'Going well',label: 'Going well'},
                  {value: 'Going OK-ish',label: 'Going OK-ish'},
                  {value: 'Struggling',label: 'Struggling'}
                ]}
              ]}
            />

            <Column
              title={data?.columnHeaders?.initiatives || "Next Actions"}
              items={initiatives}
              onSelect={showingSearchResults ? handleInitiativeSelect : undefined}
              onToggleCompletion={(id)=> toggleCompletion(id,'initiative')}
              onAdd={(title,additionalData)=> addNewItem('initiative',title,additionalData)}
              onEdit={(id,title,additionalData)=> editItemTitle(id,'initiative',title,additionalData)}
              onDelete={(id)=> deleteItem(id,'initiative')}
              type="initiative"
              disabled={!selectedTask && !showingFilterResults && !selectedFilteredHierarchy.task && !showingSearchResults && !selectedSearchHierarchy.task}
              isLeaf={!showingSearchResults}
              editingNewItemId={editingNewItem && editingNewItem.type==='initiative' ? editingNewItem.id : null}
              isEditingHeader={editingHeader==='initiatives'}
              onEditHeader={(newTitle)=> editColumnHeader('initiatives',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('initiatives')}
              forceRefresh={forceRefresh}
              fields={[
                {name: 'assignee',label: 'Assignee',type: 'text'},
                {name: 'priority',label: 'Priority',type: 'select',options: [
                  {value: 'Low',label: 'Low'},
                  {value: 'Medium',label: 'Medium'},
                  {value: 'High',label: 'High'}
                ]}
              ]}
            />
          </motion.div>
        </DndContext>
      </div>

      <div className="py-4 px-6 bg-white border-t border-gray-200 text-center text-xs text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <img
            src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753623889058-WWSC%20Logo%20Transparent.png"
            alt="WWSC Logo"
            className="h-6 w-auto"
          />
          <p>Donor Promises App © {new Date().getFullYear()} - StreetRise International</p>
        </div>
      </div>
    </div>
  );
}

export default Board;