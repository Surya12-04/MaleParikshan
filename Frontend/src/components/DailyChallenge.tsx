import { useTranslation } from '../hooks/useTranslation'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function DailyChallenge() {
  const { t } = useTranslation()
  const [waterChecked, setWaterChecked] = useState(false)
  const [moodChecked, setMoodChecked] = useState(false)

  return (
    <div className="card p-4 animate-fade-up">
      <h2 className="font-display text-lg font-semibold text-white mb-2">
        {t('dashboard.dailyChallenge')}
      </h2>
      <ul className="space-y-2">
        <li className="flex items-center">
          <input
            type="checkbox"
            checked={waterChecked}
            onChange={() => setWaterChecked((v) => !v)}
            className="mr-2"
          />
          <span>{t('dashboard.drinkWater')}</span>
        </li>
        <li className="flex items-center">
          <input
            type="checkbox"
            checked={moodChecked}
            onChange={() => setMoodChecked((v) => !v)}
            className="mr-2"
          />
          <Link to="/mood" className="underline hover:text-accent">
            {t('dashboard.logMood')}
          </Link>
        </li>
      </ul>
    </div>
  )
}
