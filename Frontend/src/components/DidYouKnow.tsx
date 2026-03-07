import { useEffect, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useMode } from '../context/ModeContext'

export default function DidYouKnow() {
  const { t, language } = useTranslation()
  const { isAdultMode } = useMode()
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  // Get facts from translation keys
  const factsKey = isAdultMode ? 'facts.adultMode' : 'facts.normalMode'
  const factsArray: string[] = []
  
  // Using a trick to get array from translation
  for (let i = 0; i < 8; i++) {
    const fact = t(`${factsKey}.${i}`)
    // If translation doesn't exist, it returns the key itself, so we break
    if (!fact.includes('facts.')) {
      factsArray.push(fact)
    }
  }

  useEffect(() => {
    if (factsArray.length === 0) return

    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % factsArray.length)
        setIsChanging(false)
      }, 300)
    }, 5000) // Change fact every 5 seconds

    return () => clearInterval(interval)
  }, [factsArray.length])

  // Reset index when mode changes
  useEffect(() => {
    setCurrentFactIndex(0)
  }, [isAdultMode])

  const fact = factsArray[currentFactIndex] || ''

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 ${isAdultMode 
      ? 'bg-gradient-to-br from-red-950/30 via-zinc-950 to-black border border-red-900/30' 
      : 'bg-gradient-to-br from-blue-950/20 via-slate-950 to-slate-950 border border-blue-500/20'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <h2 className={`font-display text-lg font-semibold ${isAdultMode ? 'text-red-300' : 'text-blue-300'}`}>
          {t('dashboard.didYouKnow')}
        </h2>
        <div className="flex gap-1">
          {factsArray.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentFactIndex 
                  ? isAdultMode ? 'bg-red-500 w-6' : 'bg-blue-400 w-6'
                  : 'bg-white/20 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
      <p className={`text-sm leading-relaxed transition-opacity duration-300 ${isChanging ? 'opacity-0' : 'opacity-100'} ${
        isAdultMode ? 'text-red-200/90' : 'text-blue-100/90'
      }`}>
        {fact}
      </p>
    </div>
  )
}
