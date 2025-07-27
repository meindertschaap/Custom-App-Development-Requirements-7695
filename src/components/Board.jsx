import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Column from './Column';
import DetailDrawer from './DetailDrawer';
import TopBar from './TopBar';
import FloatingActionButton from './FloatingActionButton';
import { sampleLibraryData } from '../data/sampleData';
import { useLocalStorage } from '../hooks/useLocalStorage';

const { FiGrid, FiFilter, FiSearch, FiDownload, FiUpload, FiCopy } = FiIcons;

function Board() {
  const [data, setData] = useLocalStorage('library-data', sampleLibraryData);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInitiatives, setSelectedInitiatives] = useState([]);

  // Get filtered data based on current filter
  const getFilteredItems = (items) => {
    if (!items) return [];
    let filtered = items;

    // Apply completion filter
    if (filter === 'active') {
      filtered = filtered.filter(item => !item.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(item => item.completed);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const goals = getFilteredItems(data?.goals || []);
  const steps = selectedGoal ? getFilteredItems(selectedGoal.steps || []) : [];
  const tasks = selectedStep ? getFilteredItems(selectedStep.tasks || []) : [];
  const initiatives = selectedTask ? getFilteredItems(selectedTask.initiatives || []) : [];

  // Handle item selection
  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setSelectedStep(null);
    setSelectedTask(null);
    setDrawerOpen(false);
  };

  const handleStepSelect = (step) => {
    setSelectedStep(step);
    setSelectedTask(null);
    setDrawerOpen(false);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setSelectedInitiatives(task.initiatives || []);
    setDrawerOpen(true);
  };

  const handleInitiativeSelect = (initiative) => {
    // Handle individual initiative selection if needed
  };

  // Handle completion toggle
  const toggleCompletion = (itemId, type, parentId = null) => {
    const updateData = { ...data };
    
    const findAndUpdate = (items, id) => {
      const item = items.find(i => i.id === id);
      if (item) {
        item.completed = !item.completed;
        return true;
      }
      return false;
    };

    switch (type) {
      case 'goal':
        findAndUpdate(updateData.goals, itemId);
        break;
      case 'step':
        updateData.goals.forEach(goal => {
          findAndUpdate(goal.steps || [], itemId);
        });
        break;
      case 'task':
        updateData.goals.forEach(goal => {
          (goal.steps || []).forEach(step => {
            findAndUpdate(step.tasks || [], itemId);
          });
        });
        break;
      case 'initiative':
        updateData.goals.forEach(goal => {
          (goal.steps || []).forEach(step => {
            (step.tasks || []).forEach(task => {
              findAndUpdate(task.initiatives || [], itemId);
            });
          });
        });
        break;
    }

    setData(updateData);
  };

  // Export data
  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'street-outreach-guide.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setData(importedData);
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Copy data to clipboard
  const handleCopy = () => {
    const dataStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('Data copied to clipboard');
    });
  };

  // Calculate counts for filter buttons
  const getCounts = () => {
    const allItems = [];
    (data?.goals || []).forEach(goal => {
      allItems.push(goal);
      (goal.steps || []).forEach(step => {
        allItems.push(step);
        (step.tasks || []).forEach(task => {
          allItems.push(task);
          (task.initiatives || []).forEach(initiative => {
            allItems.push(initiative);
          });
        });
      });
    });

    return {
      all: allItems.length,
      active: allItems.filter(item => !item.completed).length,
      completed: allItems.filter(item => item.completed).length
    };
  };

  const counts = getCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
        onExport={handleExport}
        onImport={handleImport}
        onCopy={handleCopy}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Column
            title={data?.columnHeaders?.goals || "Big Goals"}
            items={goals}
            onSelect={handleGoalSelect}
            onToggleCompletion={(id) => toggleCompletion(id, 'goal')}
            selectedId={selectedGoal?.id}
            type="goal"
          />

          <Column
            title={data?.columnHeaders?.steps || "Milestones"}
            items={steps}
            onSelect={handleStepSelect}
            onToggleCompletion={(id) => toggleCompletion(id, 'step')}
            selectedId={selectedStep?.id}
            type="step"
            disabled={!selectedGoal}
          />

          <Column
            title={data?.columnHeaders?.tasks || "Targets"}
            items={tasks}
            onSelect={handleTaskSelect}
            onToggleCompletion={(id) => toggleCompletion(id, 'task')}
            selectedId={selectedTask?.id}
            type="task"
            disabled={!selectedStep}
          />

          <Column
            title={data?.columnHeaders?.initiatives || "Action Steps"}
            items={initiatives}
            onSelect={handleInitiativeSelect}
            onToggleCompletion={(id) => toggleCompletion(id, 'initiative')}
            type="initiative"
            disabled={!selectedTask}
            isLeaf={true}
          />
        </motion.div>
      </div>

      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        task={selectedTask}
        initiatives={selectedInitiatives}
        onToggleCompletion={(id) => toggleCompletion(id, 'initiative')}
      />

      <FloatingActionButton />
      
      <div className="py-4 px-6 bg-white border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Interactive Street Outreach & Rescue Guide © {new Date().getFullYear()} Worldwide Street Children</p>
      </div>
    </div>
  );
}

export default Board;