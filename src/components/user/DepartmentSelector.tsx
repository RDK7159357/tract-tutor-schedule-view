
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
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Select Your Department</h2>
            <p className="text-gray-600 mt-2">Choose your department to view faculty schedules</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <span className="text-gray-700">
                {selectedDepartment || 'Choose a department...'}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {departments.map((department) => (
                  <button
                    key={department}
                    onClick={() => handleDepartmentSelect(department)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-gray-100 last:border-b-0"
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
