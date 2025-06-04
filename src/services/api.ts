import axios from 'axios';

// For production deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://ec2-13-201-28-122.ap-south-1.compute.amazonaws.com:3000/api' 
  : 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;