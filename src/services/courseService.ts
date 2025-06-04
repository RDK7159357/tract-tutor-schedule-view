import apiClient from './api';
import { Course } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';

export const courseService = {
  async getAllCourses(forceRefresh = false): Promise<Course[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<Course[]>(CACHE_KEYS.COURSES);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached courses data');
      return cachedData;
    }
    
    // Otherwise fetch from API
    try {
      const response = await apiClient.get('/courses');
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.COURSES, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      
      // Return cached data as fallback if available
      if (cachedData) {
        console.log('Using cached courses data as fallback after API error');
        return cachedData;
      }
      
      throw error;
    }
  },
  
  async getCoursesByDepartment(department: string): Promise<Course[]> {
    // Get all courses (potentially from cache)
    const allCourses = await this.getAllCourses();
    
    // Filter locally
    return allCourses.filter(course => course.department === department);
  },
  
  async createCourse(course: Course): Promise<Course> {
    try {
      const response = await apiClient.post('/courses', course);
      
      // Update cache after successful creation
      const cachedCourses = cacheService.getItem<Course[]>(CACHE_KEYS.COURSES) || [];
      cachedCourses.push(response.data);
      cacheService.setItem(CACHE_KEYS.COURSES, cachedCourses);
      
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  
  async updateCourse(course: Course): Promise<Course> {
    try {
      const response = await apiClient.put(`/courses/${course.course_code}`, course);
      
      // Update cache after successful update
      const cachedCourses = cacheService.getItem<Course[]>(CACHE_KEYS.COURSES) || [];
      const updatedCache = cachedCourses.map(item => 
        item.course_code === course.course_code ? response.data : item
      );
      cacheService.setItem(CACHE_KEYS.COURSES, updatedCache);
      
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },
  
  async deleteCourse(courseCode: string): Promise<void> {
    try {
      await apiClient.delete(`/courses/${courseCode}`);
      
      // Update cache after successful deletion
      const cachedCourses = cacheService.getItem<Course[]>(CACHE_KEYS.COURSES) || [];
      const updatedCache = cachedCourses.filter(item => item.course_code !== courseCode);
      cacheService.setItem(CACHE_KEYS.COURSES, updatedCache);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};