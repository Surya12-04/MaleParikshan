import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { useMode } from '../context/ModeContext'

const normalItems = [
  { to: '/dashboard', icon: '🏠', label: 'dashboard' },
  { to: '/modules', icon: '📚', label: 'modules' },
  { to: '/dailygoal', icon: '🎯', label: 'dailygoal' },
  { to: '/mood', icon: '😊', label: 'mood' },
  { to: '/chat', icon: '💬', label: 'chat' },
]

const adultItems = [
  { to: '/dashboard', icon: '🏠', label: 'dashboard' },
  { to: '/modules', icon: '📚', label: 'modules' },
  { to: '/streak', icon: '🔥', label: 'streak' },
  { to: '/mood', icon: '😊', label: 'mood' },
  { to: '/chat', icon: '💬', label: 'chat' },
]

export default function BottomNav() {
  const location = useLocation()
  const { t } = useTranslation()
  const { isAdultMode } = useMode()

  const items = isAdultMode ? adultItems : normalItems

  const getLabel = (label: string) => {
    if (label === 'chat') {
      return isAdultMode ? 'MasterGogo' : 'BaalVeer'
    }
    return t(`nav.${label}`)
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-border flex justify-around py-2 md:hidden z-20">
      {items.map((item) => {
        const active = location.pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-xs transition-colors duration-150 ${
              active ? 'text-accent' : 'text-muted hover:text-white'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="mt-1">{getLabel(item.label)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
