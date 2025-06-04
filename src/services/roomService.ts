import apiClient from './api';
import { Room } from '../types/database';
import { cacheService, CACHE_KEYS } from './cacheService';

export const roomService = {
  async getAllRooms(forceRefresh = false): Promise<Room[]> {
    // Try to get data from cache first
    const cachedData = cacheService.getItem<Room[]>(CACHE_KEYS.ROOMS);
    
    // Return cached data if available and not forcing refresh
    if (cachedData && !forceRefresh && !cacheService.isCacheExpired()) {
      console.log('Using cached rooms data');
      return cachedData;
    }
    
    // Otherwise fetch from API
    try {
      const response = await apiClient.get('/rooms');
      
      // Store in cache
      cacheService.setItem(CACHE_KEYS.ROOMS, response.data);
      cacheService.updateLastUpdated();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      
      // Return cached data as fallback if available
      if (cachedData) {
        console.log('Using cached rooms data as fallback after API error');
        return cachedData;
      }
      
      throw error;
    }
  },
  
  async createRoom(room: Room): Promise<Room> {
    try {
      const response = await apiClient.post('/rooms', room);
      
      // Update cache after successful creation
      const cachedRooms = cacheService.getItem<Room[]>(CACHE_KEYS.ROOMS) || [];
      cachedRooms.push(response.data);
      cacheService.setItem(CACHE_KEYS.ROOMS, cachedRooms);
      
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  async updateRoom(room: Room): Promise<Room> {
    try {
      const response = await apiClient.put(`/rooms/${room.room_number}`, room);
      
      // Update cache after successful update
      const cachedRooms = cacheService.getItem<Room[]>(CACHE_KEYS.ROOMS) || [];
      const updatedCache = cachedRooms.map(item => 
        item.room_number === room.room_number ? response.data : item
      );
      cacheService.setItem(CACHE_KEYS.ROOMS, updatedCache);
      
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },
  
  async deleteRoom(room_number: string): Promise<void> {
    try {
      await apiClient.delete(`/rooms/${room_number}`);
      
      // Update cache after successful deletion
      const cachedRooms = cacheService.getItem<Room[]>(CACHE_KEYS.ROOMS) || [];
      const updatedCache = cachedRooms.filter(item => item.room_number !== room_number);
      cacheService.setItem(CACHE_KEYS.ROOMS, updatedCache);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};