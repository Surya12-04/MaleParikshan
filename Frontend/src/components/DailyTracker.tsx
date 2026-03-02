import { moodService } from '../services/moodService'
import type { MoodType } from '../types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

const MOOD_ICONS: Record<MoodType, string> = {
  calm: '😌',
  angry: '😠',
  low: '😢',
  confident: '😄',
  neutral: '😐',
}

export default function DailyTracker() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClick = async (mood: MoodType) => {
    setLoading(true)
    try {
      await moodService.log(mood)
      navigate('/mood')
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4 animate-fade-up">
      <h2 className="font-display text-lg font-semibold text-white mb-2">
        {t('dashboard.dailyTracker')}
      </h2>
      <div className="flex justify-between text-2xl">
        {Object.entries(MOOD_ICONS).map(([mood, icon]) => (
          <button
            key={mood}
            disabled={loading}
            onClick={() => handleClick(mood as MoodType)}
            className="p-2 rounded-lg hover:bg-elevated transition-colors duration-150"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  )
}
