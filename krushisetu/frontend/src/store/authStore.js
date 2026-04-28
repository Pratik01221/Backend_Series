import { create } from 'zustand'
import { authAPI } from '../api/services'
import { disconnectSocket } from '../hooks/useSocket'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ks_user') || 'null'),
  token: localStorage.getItem('ks_token') || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const { data } = await authAPI.login(credentials)
      localStorage.setItem('ks_token', data.token)
      localStorage.setItem('ks_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return data.user
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      throw err
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await authAPI.register(formData)
      localStorage.setItem('ks_token', data.token)
      localStorage.setItem('ks_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return data.user
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('ks_token')
    localStorage.removeItem('ks_user')
    disconnectSocket()
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
