import api from './api'

/* ── Demo accounts (bypass backend entirely) ── */
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

const DEMO_PASSWORDS = {
  'admin@yu.edu.jo': 'admin123',
  'doctor@yu.edu.jo': 'doctor123',
}

export const authService = {
  login: async (email, password) => {
    // For demo accounts, bypass backend entirely
    if (DEMO_USERS[email] && DEMO_PASSWORDS[email] === password) {
      return DEMO_USERS[email]
    }

    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  register: async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data
  },
}
