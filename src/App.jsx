import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Board from './components/Board';
import ChildApply from './components/ChildApply';
import MicroPlan from './components/MicroPlan';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/child-apply" element={<ChildApply />} />
            <Route path="/children/:childId/plan" element={<MicroPlan />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;