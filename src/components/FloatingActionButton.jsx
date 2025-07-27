import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiUser } = FiIcons;

function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/child-apply')}
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    >
      <div className="flex items-center justify-center">
        <SafeIcon icon={FiUser} className="text-xl" />
        <SafeIcon icon={FiPlus} className="text-sm -ml-1 -mt-1" />
      </div>
    </motion.button>
  );
}

export default FloatingActionButton;