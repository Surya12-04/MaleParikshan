import { useEffect, useState } from 'react'
import { streakService } from '../services/streakService'
import type { Streak } from '../types'
import { useTranslation } from '../hooks/useTranslation'

type CheckinStatus = 'stayed_consistent' | 'resisted_urges' | 'relapsed'

interface BadgeData {
  days: number
  label: string
  icon: string
  color: string
  description: string
}

const BADGES: BadgeData[] = [
  { days: 3, label: 'Bronze Badge', icon: '🥉', color: 'bronze', description: 'First Steps' },
  { days: 7, label: 'Silver Badge', icon: '🥈', color: 'silver', description: 'One Week Strong' },
  { days: 30, label: 'Gold Badge', icon: '🏆', color: 'gold', description: 'One Month Discipline' },
  { days: 90, label: 'Diamond Badge', icon: '💎', color: 'diamond', description: 'Three Month Mastery' },
]

const MOTIVATIONAL_QUOTES = {
  stayed_consistent: [
    '🔥 Perfect execution. That\'s what greatness looks like.',
    '⚡ Day by day. You\'re building an unbreakable foundation.',
    '💪 Discipline equals freedom. You\'ve earned today.',
  ],
  resisted_urges: [
    '🛡️ You faced the urge and chose strength. That\'s real power.',
    '🎯 Resistance built. Willpower strengthened.',
    '🔥 Urges are tests. You passed.',
  ],
  relapsed: [
    '💚 Everyone stumbles. Champions get back up immediately.',
    '🔄 Reset. Learn. Come back stronger.',
    '🎯 This doesn\'t define your journey. Your next move does.',
  ],
}

export default function StreakPage() {
  const { t } = useTranslation()
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupMode, setSetupMode] = useState(false)
  const [targetDays, setTargetDays] = useState('30')
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState('')
  const [showCheckinDetails, setShowCheckinDetails] = useState(false)

  useEffect(() => {
    streakService.get()
      .then(setStreak)
      .catch(() => setSetupMode(true))
      .finally(() => setLoading(false))
  }, [])

  const hasCheckedInToday = (() => {
    if (!streak?.lastCheckDate) return false
    const last = new Date(streak.lastCheckDate)
    const today = new Date()
    last.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return last.getTime() === today.getTime()
  })()

  const getBadgesEarned = (): BadgeData[] => {
    if (!streak) return []
    return BADGES.filter((b) => (streak.currentStreak >= b.days || streak.longestStreak >= b.days))
  }

  const getNextBadge = (): BadgeData | null => {
    if (!streak) return null
    const unearned = BADGES.find((b) => streak.currentStreak < b.days && streak.longestStreak < b.days)
    return unearned || null
  }

  const getMotivationQuote = (status: CheckinStatus): string => {
    const quotes = MOTIVATIONAL_QUOTES[status]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  const handleSetup = async () => {
    setError('')
    setLoading(true)
    try {
      const s = await streakService.setup(Number(targetDays))
      setStreak(s)
      setSetupMode(false)
    } catch {
      setError('Failed to setup streak. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async (status: CheckinStatus) => {
    setCheckinLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const updated = await streakService.checkin(status)
      setStreak(updated)
      setSuccessMsg(getMotivationQuote(status))
      setShowCheckinDetails(true)
      setTimeout(() => {
        setSuccessMsg('')
        setShowCheckinDetails(false)
      }, 4000)
    } catch {
      setError('Failed to record check-in.')
    } finally {
      setCheckinLoading(false)
    }
  }

  const progress = streak ? Math.min((streak.currentStreak / streak.targetDays) * 100, 100) : 0
  const daysRemaining = streak ? (streak.targetDays - streak.currentStreak) : 0
  const earnedBadges = getBadgesEarned()
  const nextBadge = getNextBadge()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (setupMode) {
    return (
      <div className="max-w-md mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-3">NoFap Tracker</h1>
          <p className="text-muted font-body text-sm leading-relaxed">
            Choose your commitment target. Build discipline. Reclaim your power.
          </p>
        </div>

        <div className="card space-y-6">
          <div>
            <label className="label mb-4 block">{t('streak.targetDays')}</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['7', '30', '90'].map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetDays(d)}
                  className={`py-4 rounded-xl font-mono font-bold text-base transition-all duration-200 border ${
                    targetDays === d
                      ? 'bg-accent/15 border-accent text-accent shadow-lg shadow-accent/20'
                      : 'bg-surface border-border text-muted hover:border-accent/50 hover:text-white'
                  }`}
                >
                  {d} days
                </button>
              ))}
              <button
                onClick={() => setTargetDays('custom')}
                className={`py-4 rounded-xl font-mono font-bold text-base transition-all duration-200 border ${
                  targetDays === 'custom'
                    ? 'bg-accent/15 border-accent text-accent shadow-lg shadow-accent/20'
                    : 'bg-surface border-border text-muted hover:border-accent/50 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>

            {targetDays === 'custom' && (
              <input
                type="number"
                value={targetDays === 'custom' ? '30' : targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                placeholder="Enter days (1-365)"
                className="input-field mb-4 w-full"
                min="1"
                max="365"
              />
            )}

            <p className="text-muted text-xs font-body mt-3">
              💡 Shorter goals build momentum. Pick the timeframe that challenges you most.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm font-body">{error}</p>
            </div>
          )}

          <button onClick={handleSetup} className="btn-primary w-full py-4 font-display text-base font-semibold">
            Begin Journey
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold text-white mb-2">NoFap Tracker 🔥</h1>
        <p className="text-muted font-body text-sm">Self-control through discipline. Freedom through consistency.</p>
      </div>

      {/* Main Streak Display */}
      <div className="card bg-gradient-to-br from-accent/5 to-gold/5 border border-accent/20">
        <div className="text-center">
          <p className="text-muted text-xs uppercase tracking-widest font-body mb-4">Current Streak</p>
          <div className="font-display text-8xl font-extrabold text-gradient mb-2 leading-none">
            {streak?.currentStreak ?? 0}
          </div>
          <p className="text-lg text-white font-semibold mb-6">days without compromise</p>

          <div className="flex items-center justify-center gap-6 p-4 bg-surface/50 rounded-xl border border-border/50">
            <div className="text-center">
              <p className="text-muted text-xs uppercase tracking-widest mb-2">Longest</p>
              <p className="font-display text-3xl font-bold text-gold">{streak?.longestStreak ?? 0}</p>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="text-center">
              <p className="text-muted text-xs uppercase tracking-widest mb-2">Target</p>
              <p className="font-display text-3xl font-bold text-accent">{streak?.targetDays ?? 30}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-white">Progress Toward Goal</p>
          <p className="font-mono text-accent text-lg font-bold">{Math.round(progress)}%</p>
        </div>
        <div className="w-full h-4 bg-surface rounded-full overflow-hidden border border-border/50">
          <div
            className="h-full bg-gradient-to-r from-accent via-gold to-accent rounded-full transition-all duration-1000 ease-out shadow-lg shadow-accent/50"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted text-sm font-body mt-3">
          🎯 <span className="font-semibold text-white">{daysRemaining}</span> days remaining until you hit your goal
        </p>
      </div>

      {/* Daily Check-In Section */}
      <div className="card">
        <h2 className="font-display text-lg font-semibold text-white mb-2">Daily Check-in</h2>
        <p className="text-muted text-sm font-body mb-6">How was today? Be honest with yourself.</p>

        {successMsg && (
          <div className={`rounded-xl p-4 mb-6 border ${
            showCheckinDetails
              ? 'bg-accent/15 border-accent/50 text-accent'
              : 'bg-teal/10 border-teal/20 text-teal'
          }`}>
            <p className="text-sm font-body leading-relaxed">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm font-body">{error}</p>
          </div>
        )}

        {hasCheckedInToday && !showCheckinDetails && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-accent text-sm font-body font-semibold">✓ Check-in complete for today</p>
            <p className="text-muted text-xs font-body mt-1">Come back tomorrow to continue your journey.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleCheckin('stayed_consistent')}
            disabled={checkinLoading || hasCheckedInToday}
            className="group py-6 rounded-xl border-2 border-teal/40 bg-teal/5 hover:bg-teal/15 text-teal font-display font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform">✓</span>
            Stayed<br/>Consistent
          </button>
          <button
            onClick={() => handleCheckin('resisted_urges')}
            disabled={checkinLoading || hasCheckedInToday}
            className="group py-6 rounded-xl border-2 border-gold/40 bg-gold/5 hover:bg-gold/15 text-gold font-display font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform">🛡️</span>
            Resisted<br/>Urges
          </button>
          <button
            onClick={() => handleCheckin('relapsed')}
            disabled={checkinLoading || hasCheckedInToday}
            className="group py-6 rounded-xl border-2 border-red-400/40 bg-red-500/5 hover:bg-red-500/15 text-red-400 font-display font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <span className="text-3xl block mb-2 group-hover:scale-125 transition-transform">↩️</span>
            Relapsed
          </button>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="card bg-gradient-to-br from-gold/10 to-accent/5 border border-gold/30">
          <h2 className="font-display text-lg font-semibold text-white mb-4">🏆 Earned Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {earnedBadges.map((badge) => (
              <div key={badge.days} className="p-4 rounded-xl bg-surface/50 border border-gold/30 text-center">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-display font-bold text-gold text-sm">{badge.label}</div>
                <div className="text-xs text-muted mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Badge */}
      {nextBadge && (
        <div className="card border border-border/50">
          <h2 className="font-display text-sm font-semibold text-muted uppercase tracking-widest mb-4">Next Milestone</h2>
          <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-xl">
            <div className="text-4xl">{nextBadge.icon}</div>
            <div className="flex-1">
              <p className="font-display font-bold text-white">{nextBadge.label}</p>
              <p className="text-accent text-sm font-semibold">{nextBadge.description}</p>
              <p className="text-muted text-xs mt-1">
                {nextBadge.days - (streak?.currentStreak ?? 0)} days away
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-gold">{nextBadge.days}</div>
              <p className="text-muted text-xs">days</p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Calendar */}
      <div className="card">
        <h2 className="font-display text-sm font-semibold text-muted uppercase tracking-widest mb-4">
          Last 30 Days Activity
        </h2>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const daysAgo = 29 - i
            const isActive = daysAgo < (streak?.currentStreak ?? 0)
            return (
              <div
                key={i}
                title={`${daysAgo} days ago`}
                className={`aspect-square rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-accent to-gold shadow-lg shadow-accent/50'
                    : 'bg-surface border border-border/50'
                }`}
              />
            )
          })}
        </div>
        <p className="text-muted text-xs font-body mt-4">
          Green blocks = days you stayed consistent. Empty blocks = reset days or before streak started.
        </p>
      </div>

      {/* Motivational Section */}
      <div className="card bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
        <p className="font-display text-sm font-semibold text-accent mb-3">💡 Remember</p>
        <ul className="space-y-2 text-sm font-body text-muted">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Every day you don't relapse strengthens your neural pathways of self-control.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Urges are temporary. Discipline is permanent.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>If you relapse, it's not failure—it's data. Learn and restart immediately.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
