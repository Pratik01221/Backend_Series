import api from './axios'

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Crops
export const cropAPI = {
  getAll: (params) => api.get('/crops', { params }),
  getById: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post('/crops', data), // Let axios set Content-Type automatically for FormData
  update: (id, data) => api.put(`/crops/${id}`, data),
  delete: (id) => api.delete(`/crops/${id}`),
  getMyCrops: () => api.get('/crops/my/listings'),
}

// Orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

// Bids
export const bidAPI = {
  place: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my'),
  getForCrop: (cropId) => api.get(`/bids/crop/${cropId}`),
  respond: (id, status) => api.put(`/bids/${id}/respond`, { status }),
}

// Payments
export const paymentAPI = {
  create: (data) => api.post('/payments', data),
  getMy: () => api.get('/payments/my'),
}

// Reviews
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getFarmerReviews: (id) => api.get(`/reviews/farmer/${id}`),
}

// Messages
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getConversation: (userId) => api.get(`/messages/${userId}`),
  getList: () => api.get('/messages/conversations/list'),
  getUnreadCount: () => api.get('/messages/unread/count'),
}

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  getCrops: () => api.get('/admin/crops'),
  getOrders: () => api.get('/admin/orders'),
}

// Profiles
export const farmerAPI = {
  getProfile: (id) => api.get(`/farmers/${id}`),
  updateProfile: (data) => api.put('/farmers/profile/update', data),
}

export const traderAPI = {
  getProfile: (id) => api.get(`/traders/${id}`),
  updateProfile: (data) => api.put('/traders/profile/update', data),
}

// Traders
export const traderListAPI = {
  getAll: () => api.get('/traders/list'),
  getById: (id) => api.get(`/traders/${id}`),
}

// Farmers
export const farmerListAPI = {
  getAll: () => api.get('/farmers/list'),
  getById: (id) => api.get(`/farmers/${id}`),
}
