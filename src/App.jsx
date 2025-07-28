import React, { lazy, Suspense, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import UseCaseSelector from './components/UseCaseSelector';
import { useLocalStorage } from './hooks/useLocalStorage';

// Lazy load the Board component for faster initial load
const Board = lazy(() => import('./components/Board'));
const ChildApply = lazy(() => import('./components/ChildApply'));
const MicroPlan = lazy(() => import('./components/MicroPlan'));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5 minutes
      cacheTime: 900000, // 15 minutes
    },
  },
});

// Default use case
const DEFAULT_USE_CASE = {
  id: 'goal-to-action',
  title: 'Goal-to-Action Planner',
  description: 'Break down big goals into actionable steps',
  columns: {
    goals: 'Big Goals',
    steps: 'Milestones',
    tasks: 'Metrics & Targets',
    initiatives: 'Action Steps'
  }
};

function App() {
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage('brainstorm-first-visit', true);
  const [showUseCaseSelector, setShowUseCaseSelector] = useState(false);
  const [useCase, setUseCase] = useLocalStorage('brainstorm-use-case', DEFAULT_USE_CASE);
  
  useEffect(() => {
    // Show use case selector on first visit
    if (isFirstVisit) {
      setShowUseCaseSelector(true);
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, setIsFirstVisit]);

  const handleSelectUseCase = (selectedUseCase) => {
    setUseCase(selectedUseCase);
    setShowUseCaseSelector(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Board useCase={useCase} onOpenUseCaseSelector={() => setShowUseCaseSelector(true)} />} />
              <Route path="/child-apply" element={<ChildApply />} />
              <Route path="/children/:childId/plan" element={<MicroPlan />} />
            </Routes>
          </Suspense>
          
          <UseCaseSelector 
            isOpen={showUseCaseSelector}
            onClose={() => setShowUseCaseSelector(false)}
            onSelectUseCase={handleSelectUseCase}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;