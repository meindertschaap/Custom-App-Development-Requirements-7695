import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { challengeOptions, joyOptions, dreamPresets, sampleLibraryData } from '../data/sampleData';
import { generateMicroPlan } from '../utils/scoring';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const { FiArrowLeft, FiArrowRight, FiUser, FiHeart, FiTarget, FiStar, FiCheck } = FiIcons;

function ChildApply() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    challenges: [],
    joys: [],
    closeness: 25,
    dream: ''
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: FiUser },
    { id: 2, title: 'Challenges', icon: FiTarget },
    { id: 3, title: 'Joys', icon: FiHeart },
    { id: 4, title: 'Relationship', icon: FiStar },
    { id: 5, title: 'Dreams', icon: FiCheck }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const generatePlan = () => {
    // Get all initiatives from the sample data
    const allInitiatives = [];
    (sampleLibraryData.goals || []).forEach(goal => {
      (goal.steps || []).forEach(step => {
        (step.tasks || []).forEach(task => {
          (task.initiatives || []).forEach(initiative => {
            allInitiatives.push({
              ...initiative,
              taskId: task.id,
              taskTitle: task.title
            });
          });
        });
      });
    });

    // Generate micro-plan
    const microPlan = generateMicroPlan(allInitiatives, {
      age: parseInt(formData.age),
      challenges: formData.challenges,
      joys: formData.joys,
      closeness: formData.closeness,
      dream: formData.dream
    });

    // Create child record
    const childId = uuidv4();
    const planId = uuidv4();

    // Store in localStorage (in real app, this would be API calls)
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');

    children.push({
      id: childId,
      ...formData,
      createdAt: new Date().toISOString()
    });

    plans.push({
      id: planId,
      childId,
      items: microPlan,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('children', JSON.stringify(children));
    localStorage.setItem('plans', JSON.stringify(plans));

    // Navigate to plan view
    navigate(`/children/${childId}/plan`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.challenges.length > 0;
      case 3:
        return formData.joys.length > 0;
      case 4:
        return true; // Closeness has default value
      case 5:
        return formData.dream.trim().length > 0;
      default:
        return false;
    }
  };

  const toggleArrayItem = (array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter child's name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select age</option>
                  {Array.from({ length: 18 }, (_, i) => i + 6).map(age => (
                    <option key={age} value={age}>{age} years old</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">What are the biggest challenges this child faces?</p>
            <div className="grid grid-cols-1 gap-3">
              {challengeOptions.map((challenge) => (
                <motion.button
                  key={challenge.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      challenges: toggleArrayItem(formData.challenges, challenge.value)
                    })
                  }
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.challenges.includes(challenge.value)
                      ? 'border-danger-500 bg-danger-50 text-danger-900'
                      : 'border-gray-200 hover:border-danger-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{challenge.label}</span>
                    {formData.challenges.includes(challenge.value) && (
                      <SafeIcon icon={FiCheck} className="text-danger-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">What does this child enjoy or show interest in?</p>
            <div className="grid grid-cols-1 gap-3">
              {joyOptions.map((joy) => (
                <motion.button
                  key={joy.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      joys: toggleArrayItem(formData.joys, joy.value)
                    })
                  }
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.joys.includes(joy.value)
                      ? 'border-success-500 bg-success-50 text-success-900'
                      : 'border-gray-200 hover:border-success-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{joy.label}</span>
                    {formData.joys.includes(joy.value) && (
                      <SafeIcon icon={FiCheck} className="text-success-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                How close is your relationship with this child?
              </p>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.closeness}
                  onChange={(e) => setFormData({ ...formData, closeness: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Stranger</span>
                  <span>New</span>
                  <span>Warming</span>
                  <span>Trusted</span>
                </div>
                <div className="text-center">
                  <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-xl font-medium">
                    {formData.closeness < 25
                      ? 'Stranger'
                      : formData.closeness < 50
                      ? 'New relationship'
                      : formData.closeness < 75
                      ? 'Warming up'
                      : 'Trusted relationship'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is their dream for the next 2 weeks?
              </label>
              <textarea
                value={formData.dream}
                onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Describe what they hope to achieve..."
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Or choose from common dreams:</p>
              <div className="grid grid-cols-2 gap-2">
                {dreamPresets.map((preset, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setFormData({ ...formData, dream: preset })}
                    className="p-2 text-sm border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616330596-WWSC%20Logo%20Transparent.png" 
              alt="WWSC Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Child-Apply Wizard</h1>
          <p className="text-gray-600">Interactive Street Outreach & Rescue Guide</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <SafeIcon icon={step.icon} className="text-sm" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {steps[currentStep - 1]?.title}
          </h2>
          {renderStep()}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiArrowLeft} />
            {currentStep === 1 ? 'Back to Board' : 'Previous'}
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
              canProceed()
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canProceed() ? { scale: 1.02 } : {}}
            whileTap={canProceed() ? { scale: 0.98 } : {}}
          >
            {currentStep === 5 ? 'Generate Plan' : 'Next'}
            <SafeIcon icon={FiArrowRight} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ChildApply;