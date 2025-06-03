
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, Building } from 'lucide-react';

const departments = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Psychology',
  'Economics',
  'Business Administration'
];

const DepartmentSelector: React.FC = () => {
  const { setUserDepartment } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setUserDepartment(department);
    setIsOpen(false);
  };

  if (selectedDepartment) {
    return null; // Hide selector once department is chosen
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Select Your Department</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">Choose your department to view faculty schedules</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
            >
              <span className="text-gray-700 dark:text-gray-200 transition-colors duration-300">
                {selectedDepartment || 'Choose a department...'}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto backdrop-blur-sm transition-colors duration-300">
                {departments.map((department) => (
                  <button
                    key={department}
                    onClick={() => handleDepartmentSelect(department)}
                    className="w-full text-left px-4 py-3 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    {department}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelector;
