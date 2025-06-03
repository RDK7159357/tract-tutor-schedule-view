
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScheduleView } from '../../types/database';
import { Search, Calendar, Clock, MapPin, User } from 'lucide-react';

// Mock data - replace with real API calls
const mockScheduleData: ScheduleView[] = [
  {
    schedule_id: '1',
    faculty_name: 'Dr. John Smith',
    faculty_id: 'FAC001',
    department: 'Computer Science',
    course_name: 'Data Structures',
    room_number: 'CS101',
    building: 'Computer Science Building',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:30',
    semester: 'Fall',
    academic_year: '2024'
  },
  {
    schedule_id: '2',
    faculty_name: 'Prof. Sarah Johnson',
    faculty_id: 'FAC002',
    department: 'Computer Science',
    course_name: 'Database Systems',
    room_number: 'CS102',
    building: 'Computer Science Building',
    day_of_week: 'Tuesday',
    start_time: '11:00',
    end_time: '12:30',
    semester: 'Fall',
    academic_year: '2024'
  },
  {
    schedule_id: '3',
    faculty_name: 'Dr. Michael Brown',
    faculty_id: 'FAC003',
    department: 'Computer Science',
    course_name: 'Software Engineering',
    room_number: 'CS103',
    building: 'Computer Science Building',
    day_of_week: 'Wednesday',
    start_time: '14:00',
    end_time: '15:30',
    semester: 'Fall',
    academic_year: '2024'
  }
];

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleView[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleView[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    // Mock API call - replace with real API
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter by user's department
        const departmentSchedules = mockScheduleData.filter(
          schedule => schedule.department === user?.department
        );
        
        setSchedules(departmentSchedules);
        setFilteredSchedules(departmentSchedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.department) {
      fetchSchedules();
    }
  }, [user?.department]);

  useEffect(() => {
    let filtered = schedules;

    // Filter by search term (faculty name)
    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected day
    if (selectedDay) {
      filtered = filtered.filter(schedule => schedule.day_of_week === selectedDay);
    }

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm, selectedDay]);

  const facultyNames = [...new Set(schedules.map(s => s.faculty_name))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Schedules</h1>
            <p className="text-gray-600 mt-1">
              {user?.department} Department • Today is {currentDay}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Schedules</div>
            <div className="text-2xl font-bold text-indigo-600">{schedules.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faculty Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Faculty
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type faculty name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                list="faculty-suggestions"
              />
              <datalist id="faculty-suggestions">
                {facultyNames.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Day Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div
              key={schedule.schedule_id}
              className={`bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow ${
                schedule.day_of_week === currentDay
                  ? 'border-l-green-500 bg-green-50'
                  : 'border-l-indigo-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{schedule.faculty_name}</h3>
                </div>
                {schedule.day_of_week === currentDay && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {schedule.course_name && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{schedule.course_name}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{schedule.day_of_week}</span>
                  {schedule.start_time && schedule.end_time && (
                    <span>• {schedule.start_time} - {schedule.end_time}</span>
                  )}
                </div>

                {schedule.room_number && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Room {schedule.room_number}
                      {schedule.building && ` (${schedule.building})`}
                    </span>
                  </div>
                )}
              </div>

              {schedule.faculty_id && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">ID: {schedule.faculty_id}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedDay
                ? 'Try adjusting your filters'
                : 'No schedules available for this department'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
