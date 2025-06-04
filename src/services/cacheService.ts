import { Faculty, Course, Room, TimeSlot, CourseSchedule, ScheduleView } from '../types/database';

const CACHE_KEYS = {
  FACULTY: 'faculty_data',
  COURSES: 'courses_data',
  ROOMS: 'rooms_data',
  TIMESLOTS: 'timeslots_data',
  SCHEDULES: 'schedules_data',
  SCHEDULE_VIEWS: 'schedule_views_data',
  LAST_UPDATED: 'cache_last_updated'
};

// Default cache expiry time (15 minutes in milliseconds)
const DEFAULT_CACHE_EXPIRY = 15 * 60 * 1000;

export const cacheService = {
  // Store data in localStorage
  setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error storing data in cache (${key}):`, error);
    }
  },

  // Retrieve data from localStorage
  getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving data from cache (${key}):`, error);
      return null;
    }
  },

  // Check if cache is expired
  isCacheExpired(expiryTime: number = DEFAULT_CACHE_EXPIRY): boolean {
    const lastUpdated = this.getItem(CACHE_KEYS.LAST_UPDATED) as number;
    if (!lastUpdated) return true;
    
    return Date.now() - lastUpdated > expiryTime;
  },

  // Update the last updated timestamp
  updateLastUpdated(): void {
    this.setItem(CACHE_KEYS.LAST_UPDATED, Date.now());
  },

  // Clear all cached data
  clearCache(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Filter schedules by department locally
  filterSchedulesByDepartment(department: string): ScheduleView[] {
    const scheduleViews = (this.getItem(CACHE_KEYS.SCHEDULE_VIEWS) as ScheduleView[]) || [];
    return scheduleViews.filter(schedule => schedule.department === department);
  }
};

export { CACHE_KEYS };