import api from './api'

export const reservationService = {
  getAll: (params) => api.get('/reservations', { params }).then(r => r.data),
  getMine: () => api.get('/reservations/mine').then(r => r.data),
  create: (data) => api.post('/reservations', data).then(r => r.data),
  updateStatus: (id, status, notes) => api.put(`/reservations/${id}/status`, { status, notes }).then(r => r.data),
  cancel: (id) => api.delete(`/reservations/${id}`).then(r => r.data),
}
