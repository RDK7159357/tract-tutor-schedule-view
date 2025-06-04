import { useState } from 'react';
import { dataInitService } from '../services/dataInitService';

export function useDataRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  
  const refreshData = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await dataInitService.refreshAllData();
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return {
    isRefreshing,
    lastRefreshed,
    refreshData
  };
}