import api from './api'
import type { Streak } from '../types'

interface StreakStats extends Streak {
  badges?: {
    earned: Array<{ days: number; label: string; icon: string; color: string; description: string }>
    next: { days: number; label: string; icon: string; color: string; description: string } | null
    total: number
  }
  progress?: {
    percentage: number
    daysRemaining: number
  }
}

export const streakService = {
  setup: async (targetDays: number) => {
    const res = await api.post('/streak/setup', { targetDays })
    return res.data.data as Streak
  },

  checkin: async (option: 'stayed_consistent' | 'resisted_urges' | 'relapsed') => {
    const res = await api.post('/streak/checkin', { option })
    return res.data.data as Streak
  },

  get: async () => {
    const res = await api.get('/streak')
    return res.data.data as Streak
  },

  getStats: async () => {
    const res = await api.get('/streak/stats')
    return res.data.data as StreakStats
  },
}
