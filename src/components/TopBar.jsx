import React, { memo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiDownload, FiUpload, FiCopy, FiRefreshCw, FiGrid, FiChevronDown, FiArrowLeft, FiX } = FiIcons;

// Memoized TopBar component to prevent unnecessary re-renders
const TopBar = memo(function TopBar({
  title = "Donor Promises GET DONE!",
  subtitle = "Track your promises to donors and then deliver on them",
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  criticalFilter,
  setCriticalFilter,
  counts,
  onExport,
  onImport,
  onCopy,
  onReset,
  showingFilterResults = false,
  showingSearchResults = false,
  onReturnToFilterResults,
  onReturnToSearchResults,
  showingCompletedHierarchy = false,
  onReturnFromCompletedHierarchy
}) {
  // Critical filter options with intelligent filtering
  const criticalOptions = [
    { key: 'all', label: 'Show Everything' },
    { key: 'still-building', label: 'SHOW Still Building...' },
    { key: 'doing-well', label: 'Show ONLY Donors/Grants Doing Well (check!)' },
    { key: 'ending-soon', label: 'Show ONLY Donors/Grants Ending Soon' },
    { key: 'report-dates', label: 'Show ONLY Almost-Due/Overdue Report Dates' },
    { key: 'not-started-promises', label: 'Show ONLY Not-Started Promises' },
    { key: 'at-risk-promises', label: 'Show ONLY At-Risk Promises' },
    { key: 'struggling-initiatives', label: 'Show ONLY Struggling Initiatives' },
    { key: 'completed', label: 'SHOW Everything Completed' },
  ];

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Title and Logo */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753623889058-WWSC%20Logo%20Transparent.png"
                alt="WWSC Logo"
                className="h-12 w-auto"
                loading="lazy"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {title}
                </h1>
                <div className="flex items-center">
                  <p className="text-base text-primary-600">{subtitle}</p>
                  {/* Return to Filter Results - MODIFIED: Positioned more to the right */}
                  <div className="flex-1 flex justify-center ml-8 mr-4">
                    {showingFilterResults === false && criticalFilter !== 'all' && (
                      <motion.button
                        onClick={onReturnToFilterResults}
                        className="text-sm text-primary-500 hover:text-primary-700 transition-colors cursor-pointer flex flex-col"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center">
                          <SafeIcon icon={FiArrowLeft} className="mr-1" /> back to
                        </span>
                        <span>filter results</span>
                      </motion.button>
                    )}
                  </div>
                  {/* NEW: Return to Search Results */}
                  {showingSearchResults === false && searchQuery.trim() && (
                    <motion.button
                      onClick={onReturnToSearchResults}
                      className="text-sm text-primary-500 hover:text-primary-700 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ← back to search results
                    </motion.button>
                  )}
                  {/* REMOVED: The redundant "back to completed items" button is removed here */}
                </div>
              </div>
            </div>
            <div className="relative max-w-md">
              <SafeIcon
                icon={FiSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
              />
              <input
                type="text"
                placeholder="Search any text or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
              />
              {searchQuery && (
                <motion.button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <SafeIcon icon={FiX} className="text-lg" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Two-line control section */}
          <div className="flex flex-col gap-3">
            {/* Line 1: Action Buttons */}
            <div className="flex items-center gap-2 justify-end">
              <motion.button
                onClick={onExport}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download Data"
              >
                <SafeIcon icon={FiDownload} className="text-xl" />
              </motion.button>
              <motion.label
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Upload Data"
              >
                <SafeIcon icon={FiUpload} className="text-xl" />
                <input
                  type="file"
                  accept=".json"
                  onChange={onImport}
                  className="hidden"
                />
              </motion.label>
              <motion.button
                onClick={onCopy}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Copy Data"
              >
                <SafeIcon icon={FiCopy} className="text-xl" />
              </motion.button>
              <motion.button
                onClick={onReset}
                className="p-2 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Reset Data"
              >
                <SafeIcon icon={FiRefreshCw} className="text-xl" />
              </motion.button>
            </div>

            {/* Line 2: Filter Pills and Critical Dropdown */}
            <div className="flex items-center gap-4">
              {/* Filter Pills - Modified: Changed "Hide All Completed" to "Hide Completed" */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Hide Completed' } // Changed from "Hide All Completed"
                ].map(({ key, label }) => (
                  <motion.button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all text-base ${
                      filter === key
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Critical Filter Dropdown */}
              <div className="relative">
                <select
                  value={criticalFilter}
                  onChange={(e) => setCriticalFilter(e.target.value)}
                  className="appearance-none bg-gray-100 text-gray-700 px-4 py-2 pr-8 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-base hover:bg-gray-200"
                >
                  {criticalOptions.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <SafeIcon
                  icon={FiChevronDown}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TopBar;