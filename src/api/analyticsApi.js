import api from './axiosConfig';

export const getDashboardStats = () => api.get('/analytics/dashboard/');