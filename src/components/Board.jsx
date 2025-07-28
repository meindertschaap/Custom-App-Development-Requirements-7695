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
import {format} from 'date-fns';

const {FiGrid,FiStar}=FiIcons;

// Default empty template 
const emptyTemplate={
  columnHeaders: {
    goals: "Big Goals",
    steps: "Milestones",
    tasks: "Targets",
    initiatives: "Action Steps"
  },
  goals: []
};

function Board() {
  const [data,setData]=useLocalStorage('brainstorm-data',emptyTemplate);
  const [filter,setFilter]=useState('all'); // all,active,completed 
  const [searchQuery,setSearchQuery]=useState('');
  const [selectedGoal,setSelectedGoal]=useState(null);
  const [selectedStep,setSelectedStep]=useState(null);
  const [selectedTask,setSelectedTask]=useState(null);
  const [editingNewItem,setEditingNewItem]=useState(null); // Track newly added item being edited 
  const [showNewItemInputs,setShowNewItemInputs]=useState({goal: false,step: false,task: false,initiative: false});
  const [showStarredOnly,setShowStarredOnly]=useState(false);
  const [editingHeader,setEditingHeader]=useState(null); // Track which header is being edited 
  const [activeDragData,setActiveDragData]=useState(null);

  // Configure DnD sensors with longer delay for click-hold 
  const sensors=useSensors(
    useSensor(PointerSensor,{
      activationConstraint: {
        delay: 250, // 250ms delay for click-hold 
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

  // Memoized filter function to avoid recalculating on every render 
  const getFilteredItems=useCallback((items)=> {
    if (!items) return [];
    let filtered=items;

    // Apply completion filter 
    if (filter==='active') {
      filtered=filtered.filter(item=> !item.completed);
    } else if (filter==='completed') {
      filtered=filtered.filter(item=> item.completed);
    } 

    // Apply starred filter 
    if (showStarredOnly) {
      filtered=filtered.filter(item=> item.starred);
    } 

    // Apply search filter 
    if (searchQuery) {
      const query=searchQuery.toLowerCase();
      filtered=filtered.filter(item=> item.title.toLowerCase().includes(query)
      );
    } 

    return filtered;
  },[filter,searchQuery,showStarredOnly]);

  // Memoized filtered data 
  const goals=useMemo(()=> getFilteredItems(data?.goals || []),[data?.goals,getFilteredItems]
  );
  const steps=useMemo(()=> selectedGoal ? getFilteredItems(selectedGoal.steps || []) : [],[selectedGoal,getFilteredItems]
  );
  const tasks=useMemo(()=> selectedStep ? getFilteredItems(selectedStep.tasks || []) : [],[selectedStep,getFilteredItems]
  );
  const initiatives=useMemo(()=> selectedTask ? getFilteredItems(selectedTask.initiatives || []) : [],[selectedTask,getFilteredItems]
  );

  // Handle item selection 
  const handleGoalSelect=useCallback((goal)=> {
    setSelectedGoal(goal);
    setSelectedStep(null);
    setSelectedTask(null);
  },[]);

  const handleStepSelect=useCallback((step)=> {
    setSelectedStep(step);
    setSelectedTask(null);
  },[]);

  const handleTaskSelect=useCallback((task)=> {
    setSelectedTask(task);
  },[]);

  // Add new items - optimized with useCallback to prevent recreation 
  const addNewItem=useCallback((type,title=null,parentId=null)=> {
    setData(prevData=> {
      const updateData={...prevData};
      let newItemId=null;

      switch (type) {
        case 'goal': 
          const newGoal={
            id: uuidv4(),
            title: title || "New Goal",
            completed: false,
            starred: false,
            priority: (updateData.goals.length || 0) + 1,
            orderIndex: (updateData.goals.length || 0) + 1,
            steps: []
          };
          updateData.goals.push(newGoal);
          setSelectedGoal(newGoal); // Clear other selections when adding a new goal 
          setSelectedStep(null);
          setSelectedTask(null);
          newItemId=newGoal.id;
          // Keep the input field open for the next entry 
          setShowNewItemInputs(prev=> ({...prev,goal: true}));
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
            title: title || "New Milestone",
            completed: false,
            starred: false,
            priority: (updateData.goals[goalIndex].steps.length || 0) + 1,
            orderIndex: (updateData.goals[goalIndex].steps.length || 0) + 1,
            tasks: []
          };
          updateData.goals[goalIndex].steps.push(newStep);
          setSelectedStep(newStep);
          setSelectedTask(null);
          newItemId=newStep.id;
          // Keep the input field open for the next entry 
          setShowNewItemInputs(prev=> ({...prev,step: true}));
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
            title: title || "New Target",
            completed: false,
            starred: false,
            priority: (updateData.goals[gIndex].steps[sIndex].tasks.length || 0) + 1,
            orderIndex: (updateData.goals[gIndex].steps[sIndex].tasks.length || 0) + 1,
            initiatives: []
          };
          updateData.goals[gIndex].steps[sIndex].tasks.push(newTask);
          setSelectedTask(newTask);
          newItemId=newTask.id;
          // Keep the input field open for the next entry 
          setShowNewItemInputs(prev=> ({...prev,task: true}));
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
            title: title || "New Action Step",
            completed: false,
            starred: false,
            priority: (updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives.length || 0) + 1,
            orderIndex: (updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives.length || 0) + 1
          };
          updateData.goals[goalIdx].steps[stepIdx].tasks[taskIdx].initiatives.push(newInitiative);
          newItemId=newInitiative.id;
          // Keep the input field open for the next entry 
          setShowNewItemInputs(prev=> ({...prev,initiative: true}));
          break;
      } 

      // Set the newly created item as the one being edited if no title provided 
      if (newItemId && !title) {
        setEditingNewItem({id: newItemId,type: type});
      } 

      return updateData;
    });
  },[selectedGoal,selectedStep,selectedTask,setData]);

  // Edit item title - optimized to reduce unnecessary iterations 
  const editItemTitle=useCallback((id,type,newTitle)=> {
    setData(prevData=> {
      const updateData={...prevData};

      const findAndUpdate=(items,id)=> {
        const index=items.findIndex(i=> i.id===id);
        if (index !==-1) {
          items[index].title=newTitle;
          return true;
        } 
        return false;
      };

      switch (type) {
        case 'goal': 
          findAndUpdate(updateData.goals,id);
          break;
        case 'step': 
          for (const goal of updateData.goals) {
            if (goal.steps && findAndUpdate(goal.steps,id)) break;
          } 
          break;
        case 'task': 
          for (const goal of updateData.goals) {
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
          for (const goal of updateData.goals) {
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
  },[setData,editingNewItem]);

  // Edit column header title 
  const editColumnHeader=useCallback((type,newTitle)=> {
    setData(prevData=> {
      const updateData={...prevData};
      if (!updateData.columnHeaders) {
        updateData.columnHeaders={...emptyTemplate.columnHeaders};
      } 
      updateData.columnHeaders[type]=newTitle;
      return updateData;
    });
    setEditingHeader(null); // Clear editing state 
  },[setData]);

  // Toggle starred status with cascading to children 
  const toggleStarred=useCallback((itemId,type)=> {
    setData(prevData=> {
      const updateData={...prevData};

      const findAndToggle=(items,id)=> {
        const index=items.findIndex(i=> i.id===id);
        if (index !==-1) {
          const newStarredStatus=!items[index].starred;
          items[index].starred=newStarredStatus;

          // If removing star from parent,cascade to children 
          if (!newStarredStatus) {
            // Remove stars from all children based on type 
            if (type==='goal' && items[index].steps) {
              items[index].steps.forEach(step=> {
                step.starred=false;
                if (step.tasks) {
                  step.tasks.forEach(task=> {
                    task.starred=false;
                    if (task.initiatives) {
                      task.initiatives.forEach(initiative=> {
                        initiative.starred=false;
                      });
                    }
                  });
                }
              });
            } else if (type==='step' && items[index].tasks) {
              items[index].tasks.forEach(task=> {
                task.starred=false;
                if (task.initiatives) {
                  task.initiatives.forEach(initiative=> {
                    initiative.starred=false;
                  });
                }
              });
            } else if (type==='task' && items[index].initiatives) {
              items[index].initiatives.forEach(initiative=> {
                initiative.starred=false;
              });
            }
          } 
          return true;
        } 
        return false;
      };

      switch (type) {
        case 'goal': 
          findAndToggle(updateData.goals,itemId);
          break;
        case 'step': 
          for (const goal of updateData.goals) {
            if (goal.steps && findAndToggle(goal.steps,itemId)) break;
          } 
          break;
        case 'task': 
          for (const goal of updateData.goals) {
            if (!goal.steps) continue;
            let found=false;
            for (const step of goal.steps) {
              if (step.tasks && findAndToggle(step.tasks,itemId)) {
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
                if (task.initiatives && findAndToggle(task.initiatives,itemId)) {
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
  },[setData]);

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
  },[selectedGoal,selectedStep,selectedTask,setData]);

  // Export data 
  const handleExport=useCallback(()=> {
    // Simple filename prompt without embedded page message 
    const customFilename=prompt("Enter a name for your file:","brainstorm-planner-data");
    if (customFilename===null) return; // User cancelled 

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
  },[data]);

  // Import data 
  const handleImport=useCallback((event)=> {
    const file=event.target.files[0];
    if (file) {
      const reader=new FileReader();
      reader.onload=(e)=> {
        try {
          const importedData=JSON.parse(e.target.result);
          setData(importedData);
          setSelectedGoal(null);
          setSelectedStep(null);
          setSelectedTask(null);
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    }
  },[setData]);

  // Reset to empty template 
  const handleReset=useCallback(()=> {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setData(emptyTemplate);
      setSelectedGoal(null);
      setSelectedStep(null);
      setSelectedTask(null);
    }
  },[setData]);

  // Toggle starred items filter 
  const handleToggleStarredFilter=useCallback(()=> {
    setShowStarredOnly(prev=> !prev);
  },[]);

  // Copy data to clipboard as indented outline (no bullets) 
  const handleCopy=useCallback(()=> {
    const generateIndentedOutline=(data)=> {
      let outline='';
      (data?.goals || []).forEach(goal=> {
        outline +=`${goal.title}${goal.completed ? ' ✓' : ''}${goal.starred ? ' ★' : ''}\n`;
        (goal.steps || []).forEach(step=> {
          outline +=` ${step.title}${step.completed ? ' ✓' : ''}${step.starred ? ' ★' : ''}\n`;
          (step.tasks || []).forEach(task=> {
            outline +=` ${task.title}${task.completed ? ' ✓' : ''}${task.starred ? ' ★' : ''}\n`;
            (task.initiatives || []).forEach(initiative=> {
              outline +=` ${initiative.title}${initiative.completed ? ' ✓' : ''}${initiative.starred ? ' ★' : ''}\n`;
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
      const newData=JSON.parse(JSON.stringify(prevData)); // Deep clone to ensure all references are updated 

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
  },[selectedGoal,selectedStep,selectedTask,setData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={{}}
        onExport={handleExport}
        onImport={handleImport}
        onCopy={handleCopy}
        onReset={handleReset}
        onShowStarred={handleToggleStarredFilter}
        showStarredOnly={showStarredOnly}
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
              title={data?.columnHeaders?.goals || "Big Goals"}
              items={goals}
              onSelect={handleGoalSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'goal')}
              onToggleStarred={(id)=> toggleStarred(id,'goal')}
              onAdd={(title)=> addNewItem('goal',title)}
              onEdit={(id,title)=> editItemTitle(id,'goal',title)}
              onDelete={(id)=> deleteItem(id,'goal')}
              selectedId={selectedGoal?.id}
              type="goal"
              editingNewItemId={editingNewItem && editingNewItem.type==='goal' ? editingNewItem.id : null}
              parentStarred={true}
              isEditingHeader={editingHeader==='goals'}
              onEditHeader={(newTitle)=> editColumnHeader('goals',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('goals')}
            />
            <Column 
              title={data?.columnHeaders?.steps || "Milestones"}
              items={steps}
              onSelect={handleStepSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'step')}
              onToggleStarred={(id)=> toggleStarred(id,'step')}
              onAdd={(title)=> addNewItem('step',title)}
              onEdit={(id,title)=> editItemTitle(id,'step',title)}
              onDelete={(id)=> deleteItem(id,'step')}
              selectedId={selectedStep?.id}
              type="step"
              disabled={!selectedGoal}
              editingNewItemId={editingNewItem && editingNewItem.type==='step' ? editingNewItem.id : null}
              parentStarred={selectedGoal?.starred || false}
              isEditingHeader={editingHeader==='steps'}
              onEditHeader={(newTitle)=> editColumnHeader('steps',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('steps')}
            />
            <Column 
              title={data?.columnHeaders?.tasks || "Targets"}
              items={tasks}
              onSelect={handleTaskSelect}
              onToggleCompletion={(id)=> toggleCompletion(id,'task')}
              onToggleStarred={(id)=> toggleStarred(id,'task')}
              onAdd={(title)=> addNewItem('task',title)}
              onEdit={(id,title)=> editItemTitle(id,'task',title)}
              onDelete={(id)=> deleteItem(id,'task')}
              selectedId={selectedTask?.id}
              type="task"
              disabled={!selectedStep}
              editingNewItemId={editingNewItem && editingNewItem.type==='task' ? editingNewItem.id : null}
              parentStarred={selectedStep?.starred || false}
              isEditingHeader={editingHeader==='tasks'}
              onEditHeader={(newTitle)=> editColumnHeader('tasks',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('tasks')}
            />
            <Column 
              title={data?.columnHeaders?.initiatives || "Action Steps"}
              items={initiatives}
              onToggleCompletion={(id)=> toggleCompletion(id,'initiative')}
              onToggleStarred={(id)=> toggleStarred(id,'initiative')}
              onAdd={(title)=> addNewItem('initiative',title)}
              onEdit={(id,title)=> editItemTitle(id,'initiative',title)}
              onDelete={(id)=> deleteItem(id,'initiative')}
              type="initiative"
              disabled={!selectedTask}
              isLeaf={true}
              editingNewItemId={editingNewItem && editingNewItem.type==='initiative' ? editingNewItem.id : null}
              parentStarred={selectedTask?.starred || false}
              isEditingHeader={editingHeader==='initiatives'}
              onEditHeader={(newTitle)=> editColumnHeader('initiatives',newTitle)}
              onStartEditingHeader={()=> setEditingHeader('initiatives')}
            />
          </motion.div>
        </DndContext>
      </div>
      <div className="py-4 px-6 bg-white border-t border-gray-200 text-center text-xs text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753623889058-WWSC%20Logo%20Transparent.png" alt="WWSC Logo" className="h-6 w-auto" />
          <p>Brainstorm Planner App © {new Date().getFullYear()} - StreetRise International</p>
        </div>
      </div>
    </div>
  );
}

export default Board;