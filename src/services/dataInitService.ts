import { facultyService } from './facultyService';
import { courseService } from './courseService';
import { roomService } from './roomService';
import { timeSlotService } from './timeSlotService';
import { scheduleService } from './scheduleService';
import { cacheService } from './cacheService';
import { localDataService } from './localDataService';
import apiClient from './api';

export const dataInitService = {
  // Initialize all data on app startup
  async initializeAppData(): Promise<void> {
    try {
      console.log('Initializing application data...');
      
      // Check if cache is expired
      if (cacheService.isCacheExpired()) {
        console.log('Cache expired or not found, fetching fresh data...');
        
        try {
          // Try to fetch from API first
          console.log('Attempting to fetch data from API...');
          
          // Test API connection
          await apiClient.get('/test');
          
          // Load all data in parallel from API (services will handle caching)
          await Promise.all([
            facultyService.getAllFaculty(true),
            courseService.getAllCourses(true),
            roomService.getAllRooms(true),
            timeSlotService.getAllTimeSlots(true),
            scheduleService.getScheduleView(true)
          ]);
          
          console.log('All application data initialized successfully from API');
        } catch (apiError) {
          console.error('API error, falling back to local data:', apiError);
          
          // Fall back to local data if API fails
          localDataService.initializeData();
          
          console.log('All application data initialized successfully from local JSON');
        }
      } else {
        console.log('Using cached data, cache is still valid');
      }
    } catch (error) {
      console.error('Error initializing application data:', error);
      throw error;
    }
  },
  
  // Force refresh all data
  async refreshAllData(): Promise<void> {
    try {
      console.log('Force refreshing all application data...');
      
      try {
        // Try to fetch from API first
        console.log('Attempting to fetch data from API...');
        
        // Test API connection
        await apiClient.get('/test');
        
        // Load all data in parallel from API (services will handle caching)
        await Promise.all([
          facultyService.getAllFaculty(true),
          courseService.getAllCourses(true),
          roomService.getAllRooms(true),
          timeSlotService.getAllTimeSlots(true),
          scheduleService.getScheduleView(true)
        ]);
        
        console.log('All application data refreshed successfully from API');
      } catch (apiError) {
        console.error('API error, falling back to local data:', apiError);
        
        // Fall back to local data if API fails
        localDataService.initializeData();
        
        console.log('All application data refreshed successfully from local JSON');
      }
    } catch (error) {
      console.error('Error refreshing application data:', error);
      throw error;
    }
  }
};