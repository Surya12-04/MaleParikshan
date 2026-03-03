import { useEffect, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useMode } from '../context/ModeContext'

const NORMAL_MODE_FACTS = [
  "Laughing can increase blood flow by 20%, improving cardiovascular function. So, laughter really can be good medicine!",
  "Men who talk about their emotions have 23% lower stress levels than those who suppress them.",
  "Exercise increases serotonin production by up to 300%, naturally improving mood and reducing depression.",
  "Quality sleep improves emotional regulation. Men sleeping 7-9 hours process emotions 40% better.",
  "Deep breathing activates the parasympathetic nervous system, reducing stress hormones within 5 minutes.",
  "Social connections reduce mortality risk by 50% — talking to friends is medicine for the mind.",
  "Practicing gratitude daily increases dopamine and serotonin levels, improving overall mental health.",
  "Cold water exposure can reduce anxiety and boost resilience by activating the body's stress response system.",
]

const ADULT_MODE_FACTS = [
  "Pornography consumption can reduce dopamine sensitivity over time, affecting motivation and satisfaction in real-world relationships.",
  "Poor impulse control often stems from weak prefrontal cortex activation — practice delays strengthen decision-making.",
  "Consent violations damage not only victims but also perpetrators' long-term psychological health and relationships.",
  "Accountability for one's actions triggers neuroplasticity — the brain rewires through conscious behavioral change.",
  "Emotional regulation skills reduce harmful behaviors by 70% — that's why self-awareness saves lives.",
  "Boundary violations often escalate — respecting limits in small moments prevents serious harm later.",
  "Self-control is like a muscle — exercising it daily strengthens willpower and reduces impulsive behavior.",
  "Genuine intimacy requires vulnerability and trust — neither can exist without respect and consent.",
]

export default function DidYouKnow() {
  const { t } = useTranslation()
  const { isAdultMode } = useMode()
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  const facts = isAdultMode ? ADULT_MODE_FACTS : NORMAL_MODE_FACTS

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length)
        setIsChanging(false)
      }, 300)
    }, 5000) // Change fact every 5 seconds

    return () => clearInterval(interval)
  }, [facts.length])

  // Reset index when mode changes
  useEffect(() => {
    setCurrentFactIndex(0)
  }, [isAdultMode])

  const fact = facts[currentFactIndex]

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
          {facts.map((_, i) => (
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
