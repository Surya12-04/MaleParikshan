import { useState } from 'react'
import { adultService } from '../services/adultService'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useTranslation'

interface Flashcard {
  id: number
  section: string
  icon: string
  question: string
  answer: string
}

const flashcards: Flashcard[] = [
  // Section 1: Consent Clarity
  {
    id: 1,
    section: 'CONSENT CLARITY',
    icon: '🧠',
    question: 'What is Consent?',
    answer: 'Consent is a clear, voluntary, and informed agreement between adults.\n\nIt must be:\n• Freely given\n• Reversible\n• Specific\n• Enthusiastic\n• Ongoing\n\nSilence is not consent. Assumption is not consent.'
  },
  {
    id: 2,
    section: 'CONSENT CLARITY',
    icon: '🧠',
    question: 'If Someone Doesn\'t Say "No," Is It Consent?',
    answer: 'No.\n\nConsent requires a clear "yes."\nLack of resistance does not mean agreement.\nFear, pressure, or confusion invalidate consent.'
  },
  {
    id: 3,
    section: 'CONSENT CLARITY',
    icon: '🧠',
    question: 'Can Consent Be Withdrawn?',
    answer: 'Yes.\n\nConsent can be withdrawn at any time.\nIf one person changes their mind, the interaction must stop immediately.\n\nRespecting this builds trust. Ignoring it causes harm.'
  },
  {
    id: 4,
    section: 'CONSENT CLARITY',
    icon: '🧠',
    question: 'Does Relationship Status Guarantee Consent?',
    answer: 'No.\n\nMarriage or dating does not automatically mean consent.\nEvery interaction requires mutual willingness.\n\nRespect does not expire inside relationships.'
  },
  // Section 2: Impulse & Self-Control
  {
    id: 5,
    section: 'IMPULSE & SELF-CONTROL',
    icon: '🧠',
    question: 'Why Do Urges Feel Strong Sometimes?',
    answer: 'Sexual impulses are influenced by dopamine — the brain\'s reward chemical.\n\nTriggers include:\n• Visual stimulation\n• Stress\n• Loneliness\n• Boredom\n\nUrges are biological. Actions are choices.'
  },
  {
    id: 6,
    section: 'IMPULSE & SELF-CONTROL',
    icon: '🧠',
    question: 'What Is Impulse Control?',
    answer: 'Impulse control is the ability to pause between desire and action.\n\nStrong men are not those who act instantly.\nStrong men regulate.\n\nThe brain strengthens self-control through repeated discipline.'
  },
  {
    id: 7,
    section: 'IMPULSE & SELF-CONTROL',
    icon: '🧠',
    question: 'Does Porn Represent Reality?',
    answer: 'No.\n\nPornography is scripted, edited, exaggerated content created for performance — not real-life intimacy.\n\nRepeated exposure may:\n• Distort expectations\n• Reduce satisfaction\n• Increase comparison anxiety\n\nAwareness protects perception.'
  },
  {
    id: 8,
    section: 'IMPULSE & SELF-CONTROL',
    icon: '🧠',
    question: 'Can Excessive Porn Use Affect the Brain?',
    answer: 'Yes.\n\nFrequent exposure can:\n• Increase dopamine tolerance\n• Reduce sensitivity to natural rewards\n• Create compulsive patterns\n\nBalance protects mental clarity.'
  },
  // Section 3: Emotional Accountability
  {
    id: 9,
    section: 'EMOTIONAL ACCOUNTABILITY',
    icon: '🧠',
    question: 'Is Anger a Justification for Harm?',
    answer: 'No.\n\nAnger explains emotion — not behavior.\n\nEmotional maturity means:\n• Feeling anger\n• Pausing\n• Choosing controlled action\n\nHarm is a decision, not an emotion.'
  },
  {
    id: 10,
    section: 'EMOTIONAL ACCOUNTABILITY',
    icon: '🧠',
    question: 'What Is Emotional Accountability?',
    answer: 'Taking responsibility for:\n\n• Your reactions\n• Your behavior\n• The impact of your actions\n\nBlaming others for your impulses weakens self-growth.'
  },
  {
    id: 11,
    section: 'EMOTIONAL ACCOUNTABILITY',
    icon: '🧠',
    question: 'Why Do Some Men Struggle With Boundaries?',
    answer: 'Possible factors:\n\n• Cultural entitlement beliefs\n• Lack of emotional education\n• Exposure to unhealthy models\n• Peer normalization\n\nAwareness allows correction.'
  },
  // Section 4: Harm Prevention Awareness
  {
    id: 12,
    section: 'HARM PREVENTION AWARENESS',
    icon: '🛡',
    question: 'What Causes Sexual Violence?',
    answer: 'Sexual violence is influenced by:\n\n• Power imbalance\n• Entitlement mindset\n• Poor impulse control\n• Lack of empathy\n• Substance abuse\n\nIt is never caused by attraction alone.'
  },
  {
    id: 13,
    section: 'HARM PREVENTION AWARENESS',
    icon: '🛡',
    question: 'What Is the Psychological Impact on Victims?',
    answer: 'Victims may experience:\n\n• Trauma\n• Anxiety\n• Depression\n• Long-term trust issues\n\nActions affect lives beyond the moment.'
  },
  {
    id: 14,
    section: 'HARM PREVENTION AWARENESS',
    icon: '🛡',
    question: 'What Are the Legal Consequences?',
    answer: 'Sexual offenses can lead to:\n\n• Criminal charges\n• Imprisonment\n• Social stigma\n• Permanent record\n\nMomentary loss of control can cause lifelong consequences.'
  },
  // Section 5: Self-Regulation & Growth
  {
    id: 15,
    section: 'SELF-REGULATION & GROWTH',
    icon: '🧠',
    question: 'How Can I Manage Strong Urges?',
    answer: 'Try:\n\n• 5-minute delay rule\n• Cold water splash\n• Deep breathing\n• Physical movement\n• Avoiding triggers\n\nUrges peak and pass if not fed.'
  },
  {
    id: 16,
    section: 'SELF-REGULATION & GROWTH',
    icon: '🧠',
    question: 'What Is Real Masculinity?',
    answer: 'Real masculinity is:\n\n• Self-control\n• Respect\n• Emotional strength\n• Protection of others\n• Responsibility\n\nDominance is not masculinity. Discipline is.'
  },
  {
    id: 17,
    section: 'SELF-REGULATION & GROWTH',
    icon: '🧠',
    question: 'Is Seeking Help a Weakness?',
    answer: 'No.\n\nSeeking help shows:\n• Self-awareness\n• Accountability\n• Growth mindset\n\nAvoidance is weakness. Responsibility is strength.'
  },
  {
    id: 18,
    section: 'REFLECTION',
    icon: '🔴',
    question: 'Before Acting, Ask Yourself:',
    answer: '• Is this mutual?\n• Is this respectful?\n• Would I accept this behavior toward someone I love?\n• Will I be proud of this decision tomorrow?\n\nPause creates power.'
  }
]

export default function AdultModePage() {
  const { user, updateUser } = useAuth()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({})

  // Age gate
  if (!user || user.age < 18) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="font-display text-2xl font-bold text-white mb-3">{t('adult.title')}</h1>
        <p className="text-muted font-body text-sm max-w-sm">{t('adult.ageRestricted')}</p>
      </div>
    )
  }

  const handleEnable = async () => {
    setLoading(true)
    setError('')
    try {
      await adultService.enable()
      updateUser({ adultModeEnabled: true })
      setShowModal(false)
    } catch {
      setError('Failed to enable adult mode. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    setError('')
    try {
      updateUser({ adultModeEnabled: false })
    } catch {
      setError('Failed to disable adult mode. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{t('adult.title')}</h1>
        <p className="text-muted font-body text-sm">Advanced health content for verified adults</p>
      </div>

      {user.adultModeEnabled ? (
        <div className="space-y-8">
          {/* Enabled state with toggle */}
          <div className="card border-gold/20 bg-gold/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-xl">✓</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-white">{t('adult.enabled')}</p>
                  <p className="text-muted text-sm font-body">Flashcard-based learning for personal growth and awareness</p>
                </div>
              </div>
              <button
                onClick={handleDisable}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex-shrink-0 font-body text-sm"
              >
                {loading ? '...' : '✕ Disable'}
              </button>
            </div>
          </div>

          {/* Flashcards by section */}
          {['CONSENT CLARITY', 'IMPULSE & SELF-CONTROL', 'EMOTIONAL ACCOUNTABILITY', 'HARM PREVENTION AWARENESS', 'SELF-REGULATION & GROWTH', 'REFLECTION'].map((section) => (
            <div key={section}>
              <h3 className="font-display text-lg font-bold text-gold mb-4">🔴 {section}</h3>
              <div className="space-y-4">
                {flashcards
                  .filter((card) => card.section === section)
                  .map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setFlipped({ ...flipped, [card.id]: !flipped[card.id] })}
                      className="cursor-pointer perspective h-64"
                    >
                      <div
                        className={`relative w-full h-full transition-transform duration-500 transform-gpu`}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: flipped[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* Front - Question */}
                        <div
                          className="absolute w-full h-full card flex flex-col items-center justify-center p-6 text-center"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <span className="text-4xl mb-4">{card.icon}</span>
                          <p className="font-display font-bold text-white text-lg">{card.question}</p>
                          <p className="text-muted text-xs font-body mt-4">Click to reveal answer</p>
                        </div>

                        {/* Back - Answer */}
                        <div
                          className="absolute w-full h-full card flex flex-col items-center justify-center p-6"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <p className="font-body text-white text-sm leading-relaxed whitespace-pre-line">
                            {card.answer}
                          </p>
                          <p className="text-muted text-xs font-body mt-6">Click to see question</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="card border-accent/20 bg-accent/5 mt-8">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📱</span>
              <div>
                <h4 className="font-display font-semibold text-white mb-2">18 Educational Flashcards</h4>
                <p className="text-muted text-sm font-body leading-relaxed">
                  📚 Educational • 🚫 No explicit content • 🛡️ Prevention-focused • 🧠 Psychological framing • 💙 Respect-based
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card max-w-lg">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-3xl mx-auto mb-6">
              🔞
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-3">{t('adult.title')}</h2>
            <p className="text-muted font-body text-sm leading-relaxed mb-8">
              {t('adult.description')}
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary px-8 py-4">
              {t('adult.enable')}
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-elevated border border-border rounded-2xl p-8 max-w-md w-full animate-fade-up">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-4">⚠️</span>
              <h3 className="font-display text-xl font-bold text-white mb-2">Age Verification</h3>
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed mb-6">
              {t('adult.disclaimer')}
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-sm font-body">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1 py-3"
              >
                {t('adult.cancel')}
              </button>
              <button
                onClick={handleEnable}
                disabled={loading}
                className="btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {loading ? 'Enabling...' : t('adult.accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
