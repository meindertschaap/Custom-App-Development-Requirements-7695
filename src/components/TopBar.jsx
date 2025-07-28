import React, { memo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiDownload, FiUpload, FiCopy, FiRefreshCw, FiStar } = FiIcons;

// Memoized TopBar component to prevent unnecessary re-renders
const TopBar = memo(function TopBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  counts,
  onExport,
  onImport,
  onCopy,
  onReset,
  onShowStarred,
  showStarredOnly
}) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                  Brainstorm Planner App
                </h1>
                <p className="text-base text-primary-600">Break big ideas into clear steps - your way</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <SafeIcon
                icon={FiSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
              />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' }
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={onShowStarred}
              className={`p-2 ${
                showStarredOnly
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-gray-600 hover:text-amber-500 hover:bg-amber-50'
              } rounded-xl transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={showStarredOnly ? "Show All Items" : "Show Starred Items"}
            >
              <SafeIcon
                icon={FiStar}
                className={`text-xl ${showStarredOnly ? 'fill-current' : ''}`}
              />
            </motion.button>
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
        </div>
      </div>
    </div>
  );
});

export default TopBar;