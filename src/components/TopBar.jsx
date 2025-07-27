import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiDownload, FiUpload, FiCopy, FiFilter } = FiIcons;

function TopBar({ filter, setFilter, searchQuery, setSearchQuery, counts, onExport, onImport, onCopy }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Logo */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616330596-WWSC%20Logo%20Transparent.png" 
                alt="WWSC Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Interactive Street Outreach & Rescue Guide
                </h1>
                <p className="text-sm text-primary-600">Worldwide Street Children</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'active', label: 'Active', count: counts.active },
              { key: 'completed', label: 'Completed', count: counts.completed }
            ].map(({ key, label, count }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === key
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === key
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={onExport}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download Data"
            >
              <SafeIcon icon={FiDownload} className="text-lg" />
            </motion.button>
            <motion.label
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Upload Data"
            >
              <SafeIcon icon={FiUpload} className="text-lg" />
              <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </motion.label>
            <motion.button
              onClick={onCopy}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Copy Data"
            >
              <SafeIcon icon={FiCopy} className="text-lg" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;