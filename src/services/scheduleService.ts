import apiClient from './api';
import { CourseSchedule, ScheduleView } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';
import { localDataService } from './localDataService';

export const scheduleService = {
  async getAllSchedules(forceRefresh = false): Promise<CourseSchedule[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<CourseSchedule[]>(CACHE_KEYS.SCHEDULES);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached schedules data');
      return cachedData;
    }
    
    // Try to fetch from API first
    try {
      console.log('Fetching schedules from API...');
      const response = await apiClient.get('/schedules');
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.SCHEDULES, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (apiError) {
      console.error('API error fetching schedules:', apiError);
      console.log('Falling back to local data...');
      
      // Fall back to local data if API fails
      try {
        const schedules = localDataService.getCourseSchedules();
        
        // Store in cache
        cacheService.setItem(CACHE_KEYS.SCHEDULES, schedules);
        cacheService.updateLastUpdated();
        
        return schedules;
      } catch (localError) {
        console.error('Error getting schedules from local data:', localError);
        
        // Return cached data as last resort if available
        if (cachedData) {
          console.log('Using cached schedules data as last resort');
          return cachedData;
        }
        
        throw localError;
      }
    }
  },
  
  async getScheduleView(forceRefresh = false): Promise<ScheduleView[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<ScheduleView[]>(CACHE_KEYS.SCHEDULE_VIEWS);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached schedule views data');
      return cachedData;
    }
    
    // Try to fetch from API first
    try {
      console.log('Fetching schedule views from API...');
      const response = await apiClient.get('/schedules/view');
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.SCHEDULE_VIEWS, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (apiError) {
      console.error('API error fetching schedule views:', apiError);
      console.log('Falling back to local data...');
      
      // Fall back to local data if API fails
      try {
        const scheduleViews = localDataService.getScheduleViews();
        
        // Store in cache
        cacheService.setItem(CACHE_KEYS.SCHEDULE_VIEWS, scheduleViews);
        cacheService.updateLastUpdated();
        
        return scheduleViews;
      } catch (localError) {
        console.error('Error getting schedule views from local data:', localError);
        
        // Return cached data as last resort if available
        if (cachedData) {
          console.log('Using cached schedule views data as last resort');
          return cachedData;
        }
        
        throw localError;
      }
    }
  },
  
  async getScheduleViewByDepartment(department: string): Promise<ScheduleView[]> {
    try {
      // Try to fetch from API first
      console.log(`Fetching schedule views for department ${department} from API...`);
      const response = await apiClient.get(`/schedules/view/department/${department}`);
      
      // Store in cache (all schedule views)
      const allViews = cacheService.getItem<ScheduleView[]>(CACHE_KEYS.SCHEDULE_VIEWS) || [];
      const departmentViews = response.data;
      
      // Update only this department's views in the cache
      const otherDeptViews = allViews.filter(view => view.department !== department);
      const updatedViews = [...otherDeptViews, ...departmentViews];
      
      cacheService.setItem(CACHE_KEYS.SCHEDULE_VIEWS, updatedViews);
      cacheService.updateLastUpdated();
      
      return departmentViews;
    } catch (apiError) {
      console.error(`API error fetching schedule views for department ${department}:`, apiError);
      console.log('Falling back to local data...');
      
      // Try to get data from cache first
      const cachedData = cacheService.getItem<ScheduleView[]>(CACHE_KEYS.SCHEDULE_VIEWS);
      
      if (cachedData) {
        // Filter locally from cache
        const filteredData = cachedData.filter(schedule => schedule.department === department);
        if (filteredData.length > 0) {
          console.log('Using cached department schedule views');
          return filteredData;
        }
      }
      
      // Fall back to local data if API fails and cache is empty/expired
      try {
        const allScheduleViews = localDataService.getScheduleViews();
        const departmentViews = allScheduleViews.filter(view => view.department === department);
        
        // Store all views in cache
        cacheService.setItem(CACHE_KEYS.SCHEDULE_VIEWS, allScheduleViews);
        cacheService.updateLastUpdated();
        
        return departmentViews;
      } catch (localError) {
        console.error(`Error getting schedule views for department ${department} from local data:`, localError);
        throw localError;
      }
    }
  },

  async createSchedule(schedule: Omit<CourseSchedule, 'schedule_id'>): Promise<CourseSchedule> {
    try {
      console.log('Creating new schedule via API...');
      const response = await apiClient.post('/schedules', schedule);
      
      // Update cache with new schedule
      const cachedSchedules = cacheService.getItem<CourseSchedule[]>(CACHE_KEYS.SCHEDULES) || [];
      cachedSchedules.push(response.data);
      cacheService.setItem(CACHE_KEYS.SCHEDULES, cachedSchedules);
      
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async updateSchedule(schedule: CourseSchedule): Promise<CourseSchedule> {
    try {
      const { schedule_id, course_code, faculty_id, room_number, day_of_week, time_slot_id, semester, academic_year } = schedule;
      const response = await apiClient.put(`/schedules/${schedule_id}`, {
        course_code,
        faculty_id,
        room_number,
        day_of_week,
        time_slot_id,
        semester,
        academic_year
      });
      // Update cache
      const cachedSchedules = cacheService.getItem<CourseSchedule[]>(CACHE_KEYS.SCHEDULES) || [];
      const updatedSchedules = cachedSchedules.map(s => s.schedule_id === schedule_id ? response.data : s);
      cacheService.setItem(CACHE_KEYS.SCHEDULES, updatedSchedules);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  async deleteSchedule(schedule_id: string): Promise<void> {
    try {
      await apiClient.delete(`/schedules/${schedule_id}`);
      // Update cache
      const cachedSchedules = cacheService.getItem<CourseSchedule[]>(CACHE_KEYS.SCHEDULES) || [];
      const updatedSchedules = cachedSchedules.filter(s => s.schedule_id !== schedule_id);
      cacheService.setItem(CACHE_KEYS.SCHEDULES, updatedSchedules);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
};