import axios from 'axios';
import { Audience } from '../types/Audience'; // Import the correct Audience type

// Fetch Audience Data
export const fetchAudienceData = async (): Promise<Audience[]> => {
  try {
    const response = await axios.get<Audience[]>('https://cartsaver.wckd.pk/api/audience');
    return response.data;
  } catch (error) {
    console.error('Error fetching audience data:', error);
    return [];
  }
};

// Fetch Stats Data
export const fetchStatsData = async (): Promise<{
  users_percentage_change: number;
  sessions_percentage_change: number;
  carts_percentage_change: number;
  users: number;
  sessions: number;
  active_carts: number;
}> => {
  try {
    const response = await axios.get<{
      users_percentage_change: number;
      sessions_percentage_change: number;
      carts_percentage_change: number; users: number; sessions: number; active_carts: number 
}>('https://cartsaver.wckd.pk/api/stats');

    // Add default values for percentage change fields if not present in the response
    return {
      ...response.data,
      users_percentage_change: response.data.users_percentage_change ?? 0,
      sessions_percentage_change: response.data.sessions_percentage_change ?? 0,
      carts_percentage_change: response.data.carts_percentage_change ?? 0,
    };
  } catch (error) {
    console.error('Error fetching stats data:', error);

    // Return default values in case of error
    return {
      users_percentage_change: 0,
      sessions_percentage_change: 0,
      carts_percentage_change: 0,
      users: 0,
      sessions: 0,
      active_carts: 0,
    };
  }
};

// Fetch Activity Log
export const fetchActivityLog = async (): Promise<{ time: string; event: string; user: string }[]> => {
  try {
    const response = await axios.get<{ time: string; event: string; user: string }[]>('https://cartsaver.wckd.pk/api/activity-log');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return []; // Return empty array in case of error
  }
};
