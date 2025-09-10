import api from './api';

export const ordersAPI = {
  getById: (id) => api.get(`/orders/${id}`),
};
