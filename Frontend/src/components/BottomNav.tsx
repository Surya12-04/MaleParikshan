import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

const items = [
  { to: '/dashboard', icon: '🏠', label: 'dashboard' },
  { to: '/modules', icon: '📚', label: 'modules' },
  { to: '/chat', icon: '💬', label: 'chat' },
]

export default function BottomNav() {
  const location = useLocation()
  const { t } = useTranslation()

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
            <span className="mt-1">{t(`nav.${item.label}`)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
