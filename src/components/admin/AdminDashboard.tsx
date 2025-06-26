import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { courseService } from '../../services/courseService';
import { roomService } from '../../services/roomService';
import { timeSlotService } from '../../services/timeSlotService';
import { scheduleService } from '../../services/scheduleService';
import { Faculty, Course, Room, TimeSlot, CourseSchedule } from '../../types/database';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Move all these hooks inside the component
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  
  // New state for form inputs
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});
  const [newTimeSlot, setNewTimeSlot] = useState<Partial<TimeSlot>>({});
  const [newSchedule, setNewSchedule] = useState<Partial<CourseSchedule>>({});
  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({});
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [editFaculty, setEditFaculty] = useState<Partial<Faculty>>({});
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<Partial<Course>>({});
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [editingRoomNumber, setEditingRoomNumber] = useState<string | null>(null);
  const [editRoom, setEditRoom] = useState<Partial<Room>>({});
  const [editingTimeSlotId, setEditingTimeSlotId] = useState<string | null>(null);
  const [editTimeSlot, setEditTimeSlot] = useState<Partial<TimeSlot>>({});
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editSchedule, setEditSchedule] = useState<Partial<CourseSchedule>>({});
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultyData, courseData, roomData, timeSlotData, scheduleData] = await Promise.all([
          facultyService.getAllFaculty(),
          courseService.getAllCourses(),
          roomService.getAllRooms(),
          timeSlotService.getAllTimeSlots(),
          scheduleService.getAllSchedules()
        ]);
        
        setFaculties(facultyData);
        setCourses(courseData);
        setRooms(roomData);
        setTimeSlots(timeSlotData);
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Room handlers
  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedRoom = await roomService.createRoom(newRoom as Room);
      setRooms(prev => [...prev, savedRoom]);
      setNewRoom({});
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };
  
  // Time slot handlers
  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTimeSlot(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTimeSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedTimeSlot = await timeSlotService.createTimeSlot(newTimeSlot as TimeSlot);
      setTimeSlots(prev => [...prev, savedTimeSlot]);
      setNewTimeSlot({});
    } catch (error) {
      console.error('Error saving time slot:', error);
    }
  };
  
  // Schedule handlers
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };
  
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedSchedule = await scheduleService.createSchedule(newSchedule as Omit<CourseSchedule, 'schedule_id'>);
      setSchedules(prev => [...prev, savedSchedule]);
      setNewSchedule({});
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Faculty handlers
  const handleFacultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFaculty(prev => ({ ...prev, [name]: value }));
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save to backend and update cache
      const savedFaculty = await facultyService.createFaculty(newFaculty as Faculty); // <-- send full Faculty object
      setFaculties(prev => [...prev, savedFaculty]);
      setNewFaculty({});
    } catch (error) {
      console.error('Error saving faculty:', error);
    }
  };

  const handleDeleteFaculty = async (faculty_id: string) => {
    try {
      await facultyService.deleteFaculty(faculty_id);
      setFaculties(prev => prev.filter(f => f.faculty_id !== faculty_id));
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingFacultyId(faculty.faculty_id);
    setEditFaculty({ ...faculty });
  };

  const handleEditFacultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFaculty(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await facultyService.updateFaculty(editFaculty as Faculty);
      setFaculties(prev => prev.map(f => f.faculty_id === updated.faculty_id ? updated : f));
      setEditingFacultyId(null);
      setEditFaculty({});
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingFacultyId(null);
    setEditFaculty({});
  };

  // Course handlers
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedCourse = await courseService.createCourse(newCourse as Omit<Course, 'course_id'>);
      setCourses(prev => [...prev, savedCourse]);
      setNewCourse({});
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (course_code: string) => {
    try {
      await courseService.deleteCourse(course_code);
      setCourses(prev => prev.filter(c => c.course_code !== course_code));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEditCourseClick = (course: Course) => {
    setEditingCourseId(course.course_code);
    setEditCourse({ ...course });
  };

  const handleEditCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await courseService.updateCourse(editCourse as Course);
      setCourses(prev => prev.map(c => c.course_code === updated.course_code ? updated : c));
      setEditingCourseId(null);
      setEditCourse({});
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleEditCourseCancel = () => {
    setEditingCourseId(null);
    setEditCourse({});
  };

  // Room handlers
  const handleEditRoomClick = (room: Room) => {
    setEditingRoomNumber(room.room_number);
    setEditRoom({ ...room });
  };

  const handleEditRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleEditRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await roomService.updateRoom(editRoom as Room);
      setRooms(prev => prev.map(r => r.room_number === updated.room_number ? updated : r));
      setEditingRoomNumber(null);
      setEditRoom({});
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleEditRoomCancel = () => {
    setEditingRoomNumber(null);
    setEditRoom({});
  };

  const handleDeleteRoom = async (room_number: string) => {
    try {
      await roomService.deleteRoom(room_number);
      setRooms(prev => prev.filter(r => r.room_number !== room_number));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Time slot handlers
  const handleEditTimeSlotClick = (slot: TimeSlot) => {
    setEditingTimeSlotId(slot.slot_id);
    setEditTimeSlot({ ...slot });
  };
  const handleEditTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditTimeSlot(prev => ({ ...prev, [name]: value }));
  };
  const handleEditTimeSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await timeSlotService.updateTimeSlot(editTimeSlot as TimeSlot);
      setTimeSlots(prev => prev.map(t => t.slot_id === updated.slot_id ? updated : t));
      setEditingTimeSlotId(null);
      setEditTimeSlot({});
    } catch (error) {
      console.error('Error updating timeslot:', error);
    }
  };
  const handleEditTimeSlotCancel = () => {
    setEditingTimeSlotId(null);
    setEditTimeSlot({});
  };
  const handleDeleteTimeSlot = async (slot_id: string) => {
    try {
      await timeSlotService.deleteTimeSlot(slot_id);
      setTimeSlots(prev => prev.filter(t => t.slot_id !== slot_id));
    } catch (error) {
      console.error('Error deleting timeslot:', error);
    }
  };

  const handleEditScheduleClick = (schedule: CourseSchedule) => {
    setEditingScheduleId(schedule.schedule_id);
    setEditSchedule({ ...schedule });
  };
  const handleEditScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditSchedule(prev => ({ ...prev, [name]: value }));
  };
  const handleEditScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await scheduleService.updateSchedule(editSchedule as CourseSchedule);
      setSchedules(prev => prev.map(s => s.schedule_id === updated.schedule_id ? updated : s));
      setEditingScheduleId(null);
      setEditSchedule({});
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };
  const handleEditScheduleCancel = () => {
    setEditingScheduleId(null);
    setEditSchedule({});
  };
  const handleDeleteSchedule = async (schedule_id: string) => {
    try {
      await scheduleService.deleteSchedule(schedule_id);
      setSchedules(prev => prev.filter(s => s.schedule_id !== schedule_id));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'courses', label: 'Courses', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: MapPin },
    { id: 'timeslots', label: 'Time Slots', icon: Clock },
    { id: 'schedules', label: 'Schedules', icon: Plus },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage faculty, courses, and schedules</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Faculty</p>
                    <p className="text-3xl font-bold">24</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Courses</p>
                    <p className="text-3xl font-bold">156</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Available Rooms</p>
                    <p className="text-3xl font-bold">45</p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Scheduled Classes</p>
                    <p className="text-3xl font-bold">89</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Faculty Management</h2>
                {/* Optionally, you can use this button to toggle the form */}
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleFacultySubmit}>
                  <input
                    type="text"
                    name="faculty_id"
                    placeholder="Faculty ID"
                    value={newFaculty.faculty_id || ''}
                    onChange={handleFacultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={newFaculty.name || ''}
                    onChange={handleFacultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={newFaculty.department || ''}
                    onChange={handleFacultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-black" 
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newFaculty.email || ''}
                    onChange={handleFacultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                  />
                  <input
                    type="tel"
                    name="contact_number"
                    placeholder="Contact Number"
                    value={newFaculty.contact_number || ''}
                    onChange={handleFacultyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors md:col-span-2"
                  >
                    Save Faculty
                  </button>
                </form>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Existing Faculty</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {faculties.map(faculty => (
                    <div key={faculty.faculty_id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        {editingFacultyId === faculty.faculty_id ? (
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleEditFacultySubmit}>
                            <input
                              type="text"
                              name="faculty_id"
                              value={editFaculty.faculty_id || ''}
                              onChange={handleEditFacultyChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg dark:text-black"
                              required
                              placeholder="Faculty ID"
                            />
                            <input
                              type="text"
                              name="name"
                              value={editFaculty.name || ''}
                              onChange={handleEditFacultyChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg dark:text-black"
                              required
                              placeholder="Full Name"
                            />
                            <input
                              type="text"
                              name="department"
                              value={editFaculty.department || ''}
                              onChange={handleEditFacultyChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg dark:text-black"
                              required
                              placeholder="Department"
                            />
                            <input
                              type="email"
                              name="email"
                              value={editFaculty.email || ''}
                              onChange={handleEditFacultyChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg dark:text-black"
                              placeholder="Email"
                            />
                            <input
                              type="tel"
                              name="contact_number"
                              value={editFaculty.contact_number || ''}
                              onChange={handleEditFacultyChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg dark:text-black"
                              placeholder="Contact Number"
                            /><div className="flex gap-5 mt-2">
                            <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">Save</button>
                            <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                            </div>

                          </form>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                            <p className="text-sm text-gray-500">{faculty.department} • {faculty.email}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleEditClick(faculty)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteFaculty(faculty.faculty_id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => setEditingCourseId(null)}>
                  <Plus className="h-4 w-4" />
                  <span>Add Course</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCourseSubmit}>
                  <input
                    type="text"
                    name="course_code"
                    placeholder="Course Code"
                    value={newCourse.course_code || ''}
                    onChange={handleCourseChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="course_name"
                    placeholder="Course Name"
                    value={newCourse.course_name || ''}
                    onChange={handleCourseChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <select
                    name="course_type"
                    value={newCourse.course_type || ''}
                    onChange={handleCourseChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  >
                    <option value="">Course Type</option>
                    <option value="lecture">Lecture</option>
                    <option value="lab">Laboratory</option>
                    <option value="seminar">Seminar</option>
                  </select>
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={newCourse.department || ''}
                    onChange={handleCourseChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors md:col-span-2"
                  >
                    Save Course
                  </button>
                </form>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Existing Courses</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {courses.map(course => (
                    <div key={course.course_code} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        {editingCourseId === course.course_code ? (
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleEditCourseSubmit}>
                            <input
                              type="text"
                              name="course_code"
                              value={editCourse.course_code || ''}
                              onChange={handleEditCourseChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Course Code"
                            />
                            <input
                              type="text"
                              name="course_name"
                              value={editCourse.course_name || ''}
                              onChange={handleEditCourseChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Course Name"
                            />
                            <select
                              name="course_type"
                              value={editCourse.course_type || ''}
                              onChange={handleEditCourseChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                            >
                              <option value="">Course Type</option>
                              <option value="lecture">Lecture</option>
                              <option value="lab">Laboratory</option>
                              <option value="seminar">Seminar</option>
                            </select>
                            <input
                              type="text"
                              name="department"
                              value={editCourse.department || ''}
                              onChange={handleEditCourseChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Department"
                            />
                            <div className="flex gap-5 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">Save</button>
                              <button type="button" onClick={handleEditCourseCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-900">{course.course_name}</h4>
                            <p className="text-sm text-gray-500">{course.course_code} • {course.course_type} • {course.department}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleEditCourseClick(course)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteCourse(course.course_code)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Room Management</h2>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => setEditingRoomNumber(null)}>
                  <Plus className="h-4 w-4" />
                  <span>Add Room</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRoomSubmit}>
                  <input
                    type="text"
                    name="room_number"
                    placeholder="Room Number"
                    value={newRoom.room_number || ''}
                    onChange={handleRoomChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="building"
                    placeholder="Building"
                    value={newRoom.building || ''}
                    onChange={handleRoomChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={newRoom.capacity || ''}
                    onChange={handleRoomChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="equipment"
                    placeholder="Equipment"
                    value={newRoom.equipment || ''}
                    onChange={handleRoomChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors md:col-span-2"
                  >
                    Save Room
                  </button>
                </form>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Existing Rooms</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {rooms.map(room => (
                    <div key={room.room_number} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        {editingRoomNumber === room.room_number ? (
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleEditRoomSubmit}>
                            <input
                              type="text"
                              name="room_number"
                              value={editRoom.room_number || ''}
                              onChange={handleEditRoomChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Room Number"
                            />
                            <input
                              type="text"
                              name="building"
                              value={editRoom.building || ''}
                              onChange={handleEditRoomChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Building"
                            />
                            <input
                              type="number"
                              name="capacity"
                              value={editRoom.capacity || ''}
                              onChange={handleEditRoomChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Capacity"
                            />
                            <input
                              type="text"
                              name="equipment"
                              value={editRoom.equipment || ''}
                              onChange={handleEditRoomChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Equipment"
                            />
                            <div className="flex gap-5 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">Save</button>
                              <button type="button" onClick={handleEditRoomCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-900">{room.room_number}</h4>
                            <p className="text-sm text-gray-500">{room.building} • Capacity: {room.capacity} • {room.equipment}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleEditRoomClick(room)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteRoom(room.room_number)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeslots' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Time Slot Management</h2>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => setEditingTimeSlotId(null)}>
                  <Plus className="h-4 w-4" />
                  <span>Add Time Slot</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleTimeSlotSubmit}>
                  <input
                    type="text"
                    name="slot_id"
                    placeholder="Slot ID"
                    value={newTimeSlot.slot_id || ''}
                    onChange={handleTimeSlotChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="start_time"
                    placeholder="Start Time"
                    value={newTimeSlot.start_time || ''}
                    onChange={handleTimeSlotChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="end_time"
                    placeholder="End Time"
                    value={newTimeSlot.end_time || ''}
                    onChange={handleTimeSlotChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors md:col-span-2"
                  >
                    Save Time Slot
                  </button>
                </form>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Existing Time Slots</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {timeSlots.map(slot => (
                    <div key={slot.slot_id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        {editingTimeSlotId === slot.slot_id ? (
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleEditTimeSlotSubmit}>
                            <input
                              type="text"
                              name="slot_id"
                              value={editTimeSlot.slot_id || ''}
                              onChange={handleEditTimeSlotChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Slot ID"
                            />
                            <input
                              type="text"
                              name="start_time"
                              value={editTimeSlot.start_time || ''}
                              onChange={handleEditTimeSlotChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Start Time"
                            />
                            <input
                              type="text"
                              name="end_time"
                              value={editTimeSlot.end_time || ''}
                              onChange={handleEditTimeSlotChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="End Time"
                            />
                            <div className="flex gap-5 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">Save</button>
                              <button type="button" onClick={handleEditTimeSlotCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-900">{slot.slot_id}</h4>
                            <p className="text-sm text-gray-500">{slot.start_time} - {slot.end_time}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleEditTimeSlotClick(slot)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteTimeSlot(slot.slot_id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Schedule Management</h2>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => setEditingScheduleId(null)}>
                  <Plus className="h-4 w-4" />
                  <span>Add Schedule</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleScheduleSubmit}>
                  <input
                    type="text"
                    name="schedule_id"
                    placeholder="Schedule ID"
                    value={newSchedule.schedule_id || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                    required
                  />
                  <input
                    type="text"
                    name="course_code"
                    placeholder="Course Code"
                    value={newSchedule.course_code || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="faculty_id"
                    placeholder="Faculty ID"
                    value={newSchedule.faculty_id || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="room_number"
                    placeholder="Room Number"
                    value={newSchedule.room_number || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="day_of_week"
                    placeholder="Day of Week"
                    value={newSchedule.day_of_week || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="time_slot_id"
                    placeholder="Time Slot ID"
                    value={newSchedule.time_slot_id || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="semester"
                    placeholder="Semester"
                    value={newSchedule.semester || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <input
                    type="text"
                    name="academic_year"
                    placeholder="Academic Year"
                    value={newSchedule.academic_year || ''}
                    onChange={handleScheduleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black dark:text-black"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors md:col-span-2"
                  >
                    Save Schedule
                  </button>
                </form>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Existing Schedules</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {schedules.map(schedule => (
                    <div key={schedule.schedule_id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        {editingScheduleId === schedule.schedule_id ? (
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleEditScheduleSubmit}>
                            <input
                              type="text"
                              name="schedule_id"
                              value={editSchedule.schedule_id || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              required
                              placeholder="Schedule ID"
                            />
                            <input
                              type="text"
                              name="course_code"
                              value={editSchedule.course_code || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Course Code"
                            />
                            <input
                              type="text"
                              name="faculty_id"
                              value={editSchedule.faculty_id || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Faculty ID"
                            />
                            <input
                              type="text"
                              name="room_number"
                              value={editSchedule.room_number || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Room Number"
                            />
                            <input
                              type="text"
                              name="day_of_week"
                              value={editSchedule.day_of_week || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Day of Week"
                            />
                            <input
                              type="text"
                              name="time_slot_id"
                              value={editSchedule.time_slot_id || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Time Slot ID"
                            />
                            <input
                              type="text"
                              name="semester"
                              value={editSchedule.semester || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Semester"
                            />
                            <input
                              type="text"
                              name="academic_year"
                              value={editSchedule.academic_year || ''}
                              onChange={handleEditScheduleChange}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-black dark:text-black"
                              placeholder="Academic Year"
                            />
                            <div className="flex gap-5 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">Save</button>
                              <button type="button" onClick={handleEditScheduleCancel} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <h4 className="font-medium text-gray-900">{schedule.schedule_id}</h4>
                            <p className="text-sm text-gray-500">{schedule.course_code} • {schedule.faculty_id} • {schedule.room_number} • {schedule.day_of_week} • {schedule.time_slot_id} • {schedule.semester} • {schedule.academic_year}</p>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleEditScheduleClick(schedule)}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteSchedule(schedule.schedule_id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
