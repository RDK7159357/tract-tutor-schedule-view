import apiClient from './api';
import { Faculty } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';

export const facultyService = {
  async getAllFaculty(forceRefresh = false): Promise<Faculty[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<Faculty[]>(CACHE_KEYS.FACULTY);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached faculty data');
      return cachedData;
    }
    
    // Otherwise fetch from API
    try {
      console.log('Fetching faculty from:', apiClient.defaults.baseURL + '/faculty');
      const response = await apiClient.get('/faculty');
      console.log('Faculty data received:', response.data);
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.FACULTY, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty:', error);
      
      // Return cached data as fallback if available
      if (cachedData) {
        console.log('Using cached faculty data as fallback after API error');
        return cachedData;
      }
      
      throw error;
    }
  },
  
  async getFacultyByDepartment(department: string): Promise<Faculty[]> {
    // Get all faculty (potentially from cache)
    const allFaculty = await this.getAllFaculty();
    
    // Filter locally
    return allFaculty.filter(faculty => faculty.department === department);
  },
  
  async createFaculty(faculty: Omit<Faculty, 'faculty_id'>): Promise<Faculty> {
    try {
      const response = await apiClient.post('/faculty', faculty);
      
      // Update cache after successful creation
      const cachedFaculty = cacheService.getItem<Faculty[]>(CACHE_KEYS.FACULTY) || [];
      cachedFaculty.push(response.data);
      cacheService.setItem(CACHE_KEYS.FACULTY, cachedFaculty);
      
      return response.data;
    } catch (error) {
      console.error('Error creating faculty:', error);
      throw error;
    }
  },
  
  async updateFaculty(faculty: Faculty): Promise<Faculty> {
    try {
      const response = await apiClient.put(`/faculty/${faculty.faculty_id}`, faculty);
      
      // Update cache after successful update
      const cachedFaculty = cacheService.getItem<Faculty[]>(CACHE_KEYS.FACULTY) || [];
      const updatedCache = cachedFaculty.map(item => 
        item.faculty_id === faculty.faculty_id ? response.data : item
      );
      cacheService.setItem(CACHE_KEYS.FACULTY, updatedCache);
      
      return response.data;
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  },
  
  async deleteFaculty(facultyId: string): Promise<void> {
    try {
      await apiClient.delete(`/faculty/${facultyId}`);
      
      // Update cache after successful deletion
      const cachedFaculty = cacheService.getItem<Faculty[]>(CACHE_KEYS.FACULTY) || [];
      const updatedCache = cachedFaculty.filter(item => item.faculty_id !== facultyId);
      cacheService.setItem(CACHE_KEYS.FACULTY, updatedCache);
    } catch (error) {
      console.error('Error deleting faculty:', error);
      throw error;
    }
  }
};