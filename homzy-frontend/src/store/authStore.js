// ============================================================
//  store/authStore.js  —  Zustand global auth state
// ============================================================
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('homzy_token') || null,
  user:  JSON.parse(localStorage.getItem('homzy_user') || 'null'),

  login: (token, user) => {
    localStorage.setItem('homzy_token', token)
    localStorage.setItem('homzy_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('homzy_token')
    localStorage.removeItem('homzy_user')
    set({ token: null, user: null })
  },

  isAuthenticated: () => !!localStorage.getItem('homzy_token'),
}))

export default useAuthStore
