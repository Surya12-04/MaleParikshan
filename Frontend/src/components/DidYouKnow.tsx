import { useTranslation } from '../hooks/useTranslation'

// simple static fact card
export default function DidYouKnow() {
  const { t } = useTranslation()

  // can be replaced by dynamic content later
  const fact = "Laughing can increase blood flow by 20%, improving cardiovascular function. So, laughter really can be good medicine!"

  return (
    <div className="card p-4 animate-fade-up">
      <h2 className="font-display text-lg font-semibold text-white mb-2">
        {t('dashboard.didYouKnow')}
      </h2>
      <p className="text-muted text-sm leading-relaxed">{fact}</p>
    </div>
  )
}
