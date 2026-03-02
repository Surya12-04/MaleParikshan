import type { FC } from 'react'
import { useTranslation } from '../hooks/useTranslation'

interface Props {
  currentStreak: number
  days?: number
}

export const StreakGraph: FC<Props> = ({ currentStreak, days = 14 }) => {
  const { t } = useTranslation()
  // create array of days length
  const arr = Array.from({ length: days }).map((_, i) => i + 1)

  return (
    <div className="card p-4 animate-fade-up">
      <h2 className="font-display text-lg font-semibold text-white mb-2">{t('dashboard.loginStreak')}</h2>
      <div className="flex items-end gap-1">
        {arr.map((day) => {
          const active = day <= currentStreak
          return (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-2 h-10 rounded-full transition-all duration-200 ${
                  active ? 'bg-accent' : 'bg-border'
                }`}
              />
              {active && <span className="text-xs mt-1">🔥</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
