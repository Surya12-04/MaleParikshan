export interface Badge {
  days: number
  label: string
  icon: string
  color: string
  description: string
}

export const BADGES: Badge[] = [
  {
    days: 3,
    label: 'Bronze Badge',
    icon: '🥉',
    color: 'bronze',
    description: 'First Steps',
  },
  {
    days: 7,
    label: 'Silver Badge',
    icon: '🥈',
    color: 'silver',
    description: 'One Week Strong',
  },
  {
    days: 30,
    label: 'Gold Badge',
    icon: '🏆',
    color: 'gold',
    description: 'One Month Discipline',
  },
  {
    days: 90,
    label: 'Diamond Badge',
    icon: '💎',
    color: 'diamond',
    description: 'Three Month Mastery',
  },
]

export const calculateEarnedBadges = (currentStreak: number, longestStreak: number): Badge[] => {
  return BADGES.filter((badge) => currentStreak >= badge.days || longestStreak >= badge.days)
}

export const getNextBadge = (currentStreak: number, longestStreak: number): Badge | null => {
  return BADGES.find((badge) => currentStreak < badge.days && longestStreak < badge.days) || null
}

export const getBadgeProgress = (
  currentStreak: number,
  longestStreak: number
): { earned: Badge[]; next: Badge | null } => {
  return {
    earned: calculateEarnedBadges(currentStreak, longestStreak),
    next: getNextBadge(currentStreak, longestStreak),
  }
}
