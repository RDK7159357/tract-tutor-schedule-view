
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScheduleView } from '../../types/database';
import { Search, Calendar, Clock, MapPin, User } from 'lucide-react';
import { scheduleService } from '../../services/scheduleService';
import { dataInitService } from '../../services/dataInitService';

// Mock data - replace with real API calls
// const mockScheduleData: ScheduleView[] = [
//   {
//     schedule_id: '1',
//     faculty_name: 'Dr. John Smith',
//     faculty_id: 'FAC001',
//     department: 'Computer Science',
//     course_name: 'Data Structures',
//     room_number: 'CS101',
//     building: 'Computer Science Building',
//     day_of_week: 'Monday',
//     start_time: '09:00',
//     end_time: '10:30',
//     semester: 'Fall',
//     academic_year: '2024'
//   },
//   {
//     schedule_id: '2',
//     faculty_name: 'Prof. Sarah Johnson',
//     faculty_id: 'FAC002',
//     department: 'Computer Science',
//     course_name: 'Database Systems',
//     room_number: 'CS102',
//     building: 'Computer Science Building',
//     day_of_week: 'Tuesday',
//     start_time: '11:00',
//     end_time: '12:30',
//     semester: 'Fall',
//     academic_year: '2024'
//   },
//   {
//     schedule_id: '3',
//     faculty_name: 'Dr. Michael Brown',
//     faculty_id: 'FAC003',
//     department: 'Computer Science',
//     course_name: 'Software Engineering',
//     room_number: 'CS103',
//     building: 'Computer Science Building',
//     day_of_week: 'Wednesday',
//     start_time: '14:00',
//     end_time: '15:30',
//     semester: 'Fall',
//     academic_year: '2024'
//   }
// ];

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleView[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleView[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // In the useEffect for fetching schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.department) {
        console.warn("User department not set. Skipping fetch.");
        return;
      }
  
      setLoading(true);
      try {
        // Initialize data first to ensure it's available
        await dataInitService.initializeAppData();
        
        // Then get from cache via the service
        const departmentSchedules = await scheduleService.getScheduleViewByDepartment(user.department);
        console.log("Fetched schedules:", departmentSchedules);
        setSchedules(departmentSchedules);
        setFilteredSchedules(departmentSchedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setSchedules([]);
        setFilteredSchedules([]);
      } finally {
        setLoading(false);
      }
    };
  
    console.log("Current user:", user);
    fetchSchedules();
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Schedules</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {user?.department} Department • Today is {currentDay}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Schedules</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{schedules.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faculty Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Faculty
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type faculty name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border-l-4 p-6 hover:shadow-md transition-shadow ${
                schedule.day_of_week === currentDay
                  ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-l-indigo-500 dark:border-l-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{schedule.faculty_name}</h3>
                </div>
                {schedule.day_of_week === currentDay && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {schedule.course_name && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 dark:text-gray-400" />
                    <span>{schedule.course_name}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 dark:text-gray-400" />
                  <span>{schedule.day_of_week}</span>
                  {schedule.start_time && schedule.end_time && (
                    <span>• {schedule.start_time} - {schedule.end_time}</span>
                  )}
                </div>

                {schedule.room_number && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 dark:text-gray-400" />
                    <span>
                      Room {schedule.room_number}
                      {schedule.building && ` (${schedule.building})`}
                    </span>
                  </div>
                )}
              </div>

              {schedule.faculty_id && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">ID: {schedule.faculty_id}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 p-6">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No schedules found</h3>
            <p className="text-gray-500 dark:text-gray-400">
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
