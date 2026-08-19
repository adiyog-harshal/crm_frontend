import api from './axiosConfig';

export const getDeals = () => api.get('deal/');
export const createDeal = (data) => api.post('deal/add/', dealData);