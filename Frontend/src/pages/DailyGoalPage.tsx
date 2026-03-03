import { useEffect, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'

interface DailyGoal {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function DailyGoalPage() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<DailyGoal[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [loading, setLoading] = useState(false)

  // Load goals from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const savedGoals = localStorage.getItem(`goals-${today}`)
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Save goals to localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`goals-${today}`, JSON.stringify(goals))
  }, [goals])

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.trim()) return

    const goal: DailyGoal = {
      id: Date.now().toString(),
      title: newGoal,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setGoals([...goals, goal])
    setNewGoal('')
  }

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const completedCount = goals.filter(g => g.completed).length
  const totalCount = goals.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">{t('dailygoal.title')} 🎯</h1>
        <p className="text-muted font-body text-sm">{t('dailygoal.subtitle')}</p>
      </div>

      {/* Progress Summary */}
      <div className="card bg-gradient-to-br from-accent/5 to-gold/5 border border-accent/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">{t('dailygoal.progress')}</p>
            <p className="font-display text-3xl font-bold text-white">
              {completedCount} <span className="text-muted text-lg">of {totalCount}</span>
            </p>
          </div>
          <div className="text-5xl text-gold opacity-50">{totalCount > 0 ? '✓' : '○'}</div>
        </div>

        {totalCount > 0 && (
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/50">
            <div
              className="h-full bg-gradient-to-r from-accent to-gold rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Add Goal Form */}
      <div className="card">
        <form onSubmit={handleAddGoal} className="flex gap-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder={t('dailygoal.addGoal')}
            className="input-field flex-1"
            maxLength={60}
          />
          <button
            type="submit"
            disabled={!newGoal.trim()}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('dailygoal.add')}
          </button>
        </form>
      </div>

      {/* Goals List */}
      {totalCount > 0 ? (
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="card p-4 flex items-center gap-4 group hover:bg-surface/80 transition-all"
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggleGoal(goal.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  goal.completed
                    ? 'bg-accent border-accent text-white'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                {goal.completed && <span>✓</span>}
              </button>

              {/* Goal Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-body text-sm transition-all ${
                    goal.completed ? 'text-muted line-through' : 'text-white'
                  }`}
                >
                  {goal.title}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">📝</p>
          <h3 className="font-display text-lg font-semibold text-white mb-2">{t('dailygoal.noGoals')}</h3>
          <p className="text-muted font-body text-sm">{t('dailygoal.noGoalsDesc')}</p>
        </div>
      )}

      {/* Tips */}
      {totalCount > 0 && (
        <div className="card bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
          <p className="font-display text-sm font-semibold text-accent mb-3">{t('dailygoal.tips')}</p>
          <ul className="space-y-2 text-sm font-body text-muted">
            <li className="flex gap-2">
              <span>✓</span>
              <span>{t('dailygoal.tip1')}</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>{t('dailygoal.tip2')}</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>{t('dailygoal.tip3')}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
