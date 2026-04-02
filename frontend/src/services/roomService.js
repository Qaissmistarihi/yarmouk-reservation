import api from './api'

export const roomService = {
  getAll: (params) => api.get('/rooms', { params }).then(r => r.data),
  getAvailable: (params) => api.get('/rooms/available', { params }).then(r => r.data),
  create: (data) => api.post('/rooms', data).then(r => r.data),
  update: (id, data) => api.put(`/rooms/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/rooms/${id}`).then(r => r.data),
}

export const buildingService = {
  getAll: () => api.get('/buildings').then(r => r.data),
  create: (data) => api.post('/buildings', data).then(r => r.data),
  update: (id, data) => api.put(`/buildings/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/buildings/${id}`).then(r => r.data),
}
