import api from './api'

/* ── Demo accounts (work without backend) ── */
const DEMO_USERS = {
  'admin@yu.edu.jo': {
    token: 'demo-admin-token',
    user: { id: 1, name: 'Admin Control', email: 'admin@yu.edu.jo', role: 'admin', department: 'IT Administration' },
  },
  'doctor@yu.edu.jo': {
    token: 'demo-doctor-token',
    user: { id: 2, name: 'Ahmad Al-Zoubi', email: 'doctor@yu.edu.jo', role: 'doctor', department: 'Computer Science Dept.' },
  },
}

export const authService = {
  login: async (email, password) => {
    try {
      // Try real backend first
      const res = await api.post('/auth/login', { email, password })
      return res.data
    } catch (err) {
      // Fallback to demo accounts if backend is unreachable
      if (DEMO_USERS[email] && (!err.response || err.code === 'ERR_NETWORK')) {
        return DEMO_USERS[email]
      }
      throw err
    }
  },

  register: async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data
  },
}
