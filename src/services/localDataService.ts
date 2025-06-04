import jsonData from '../data.json';
import { Faculty, Course, Room, TimeSlot, CourseSchedule, ScheduleView } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';

// Type for the JSON data structure
interface JsonDataStructure {
  Faculty: Faculty[];
  Courses: Course[];
  Rooms: Room[];
  TimeSlots: TimeSlot[];
  CourseSchedule: CourseSchedule[];
}

// Convert the imported JSON data to the correct type
const typedJsonData = jsonData as unknown as JsonDataStructure;

// Function to transform CourseSchedule data into ScheduleView format
const transformToScheduleView = (): ScheduleView[] => {
  const scheduleViews: ScheduleView[] = [];
  
  typedJsonData.CourseSchedule.forEach(schedule => {
    // Find the associated faculty
    const faculty = typedJsonData.Faculty.find(f => f.faculty_id === schedule.faculty_id);
    
    // Find the associated course
    const course = typedJsonData.Courses.find(c => c.course_code === schedule.course_code);
    
    // Find the associated room
    const room = typedJsonData.Rooms.find(r => r.room_number === schedule.room_number);
    
    // Find the associated time slot
    const timeSlot = typedJsonData.TimeSlots.find(t => t.slot_id.toString() === schedule.time_slot_id);
    
    if (faculty) {
      const scheduleView: ScheduleView = {
        schedule_id: schedule.schedule_id.toString(),
        faculty_name: faculty.name,
        faculty_id: faculty.faculty_id,
        department: faculty.department,
        course_name: course?.course_name,
        room_number: room?.room_number,
        building: room?.building,
        day_of_week: schedule.day_of_week,
        start_time: timeSlot?.start_time,
        end_time: timeSlot?.end_time,
        semester: schedule.semester,
        academic_year: schedule.academic_year
      };
      
      scheduleViews.push(scheduleView);
    }
  });
  
  return scheduleViews;
};

export const localDataService = {
  // Initialize all data from the JSON file
  initializeData(): void {
    console.log('Initializing data from local JSON file...');
    
    // Store faculty data in cache
    cacheService.setItem(CACHE_KEYS.FACULTY, typedJsonData.Faculty);
    
    // Store courses data in cache
    cacheService.setItem(CACHE_KEYS.COURSES, typedJsonData.Courses);
    
    // Store rooms data in cache
    cacheService.setItem(CACHE_KEYS.ROOMS, typedJsonData.Rooms);
    
    // Store time slots data in cache
    cacheService.setItem(CACHE_KEYS.TIMESLOTS, typedJsonData.TimeSlots);
    
    // Store schedules data in cache
    cacheService.setItem(CACHE_KEYS.SCHEDULES, typedJsonData.CourseSchedule);
    
    // Transform and store schedule views data in cache
    const scheduleViews = transformToScheduleView();
    cacheService.setItem(CACHE_KEYS.SCHEDULE_VIEWS, scheduleViews);
    
    // Update last updated timestamp
    cacheService.updateLastUpdated();
    
    console.log('Data initialization from JSON file complete');
  },
  
  // Get faculty data
  getFaculty(): Faculty[] {
    return typedJsonData.Faculty;
  },
  
  // Get courses data
  getCourses(): Course[] {
    return typedJsonData.Courses;
  },
  
  // Get rooms data
  getRooms(): Room[] {
    return typedJsonData.Rooms;
  },
  
  // Get time slots data
  getTimeSlots(): TimeSlot[] {
    return typedJsonData.TimeSlots;
  },
  
  // Get course schedules data
  getCourseSchedules(): CourseSchedule[] {
    return typedJsonData.CourseSchedule;
  },
  
  // Get schedule views data
  getScheduleViews(): ScheduleView[] {
    return transformToScheduleView();
  },
  
  // Get schedule views by department
  getScheduleViewsByDepartment(department: string): ScheduleView[] {
    const allViews = this.getScheduleViews();
    return allViews.filter(view => view.department === department);
  }
};