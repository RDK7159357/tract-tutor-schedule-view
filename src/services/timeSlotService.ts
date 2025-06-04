import apiClient from './api';
import { TimeSlot } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';

export const timeSlotService = {
  async getAllTimeSlots(forceRefresh = false): Promise<TimeSlot[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<TimeSlot[]>(CACHE_KEYS.TIMESLOTS);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached time slots data');
      return cachedData;
    }
    
    // Otherwise fetch from API
    try {
      const response = await apiClient.get('/timeslots');
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.TIMESLOTS, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      
      // Return cached data as fallback if available
      if (cachedData) {
        console.log('Using cached time slots data as fallback after API error');
        return cachedData;
      }
      
      throw error;
    }
  },
  
  async createTimeSlot(timeSlot: TimeSlot): Promise<TimeSlot> {
    try {
      const response = await apiClient.post('/timeslots', timeSlot);
      
      // Update cache after successful creation
      const cachedTimeSlots = cacheService.getItem<TimeSlot[]>(CACHE_KEYS.TIMESLOTS) || [];
      cachedTimeSlots.push(response.data);
      cacheService.setItem(CACHE_KEYS.TIMESLOTS, cachedTimeSlots);
      
      return response.data;
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },
  
  async updateTimeSlot(timeSlot: TimeSlot): Promise<TimeSlot> {
    try {
      const response = await apiClient.put(`/timeslots/${timeSlot.slot_id}`, timeSlot);
      
      // Update cache after successful update
      const cachedTimeSlots = cacheService.getItem<TimeSlot[]>(CACHE_KEYS.TIMESLOTS) || [];
      const updatedCache = cachedTimeSlots.map(item => 
        item.slot_id === timeSlot.slot_id ? response.data : item
      );
      cacheService.setItem(CACHE_KEYS.TIMESLOTS, updatedCache);
      
      return response.data;
    } catch (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
  },
  
  async deleteTimeSlot(slot_id: string): Promise<void> {
    try {
      await apiClient.delete(`/timeslots/${slot_id}`);
      
      // Update cache after successful deletion
      const cachedTimeSlots = cacheService.getItem<TimeSlot[]>(CACHE_KEYS.TIMESLOTS) || [];
      const updatedCache = cachedTimeSlots.filter(item => item.slot_id !== slot_id);
      cacheService.setItem(CACHE_KEYS.TIMESLOTS, updatedCache);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  }
};