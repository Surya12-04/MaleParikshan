import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

const setupSchema = z.object({
  targetDays: z.number().int().min(1).max(365).default(30),
});

const checkinSchema = z.object({
  option: z.enum(['stayed_consistent', 'resisted_urges', 'relapsed']),
});

export const setupStreak = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { targetDays } = setupSchema.parse(req.body);

    const streak = await prisma.streak.upsert({
      where: { userId },
      create: { userId, targetDays, currentStreak: 0, longestStreak: 0 },
      update: { targetDays },
    });

    sendSuccess(res, streak, 'Streak tracker setup complete');
  } catch (err) {
    next(err);
  }
};

export const dailyCheckin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { option } = checkinSchema.parse(req.body);

    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (!streak) {
      sendError(res, 'Streak tracker not set up. Call /streak/setup first.', 400);
      return;
    }

    // Prevent double check-in on same day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (streak.lastCheckDate && streak.lastCheckDate >= today) {
      sendError(res, 'Already checked in today', 400);
      return;
    }

    let newCurrent = streak.currentStreak;
    if (option === 'relapsed') {
      newCurrent = 0;
    } else {
      newCurrent = streak.currentStreak + 1;
    }

    const newLongest = Math.max(newCurrent, streak.longestStreak);

    const [updated] = await prisma.$transaction([
      prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrent,
          longestStreak: newLongest,
          lastCheckDate: new Date(),
        },
      }),
      prisma.streakCheckin.create({
        data: { streakId: streak.id, option },
      }),
    ]);

    sendSuccess(res, updated, 'Check-in recorded');
  } catch (err) {
    next(err);
  }
};

export const getStreak = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const streak = await prisma.streak.findUnique({
      where: { userId },
      include: {
        checkins: { orderBy: { date: 'desc' }, take: 10 },
      },
    });

    if (!streak) {
      sendError(res, 'No streak tracker found', 404);
      return;
    }

    sendSuccess(res, streak, 'Streak data fetched');
  } catch (err) {
    next(err);
  }
};

export const getStreakStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const streak = await prisma.streak.findUnique({
      where: { userId },
      include: {
        checkins: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!streak) {
      sendError(res, 'No streak tracker found', 404);
      return;
    }

    const badges = [
      { days: 3, label: 'Bronze Badge', icon: '🥉', color: 'bronze', description: 'First Steps' },
      { days: 7, label: 'Silver Badge', icon: '🥈', color: 'silver', description: 'One Week Strong' },
      { days: 30, label: 'Gold Badge', icon: '🏆', color: 'gold', description: 'One Month Discipline' },
      { days: 90, label: 'Diamond Badge', icon: '💎', color: 'diamond', description: 'Three Month Mastery' },
    ];

    const earnedBadges = badges.filter(
      (b) => streak.currentStreak >= b.days || streak.longestStreak >= b.days
    );
    const nextBadge = badges.find(
      (b) => streak.currentStreak < b.days && streak.longestStreak < b.days
    ) || null;

    const stats = {
      ...streak,
      badges: {
        earned: earnedBadges,
        next: nextBadge,
        total: badges.length,
      },
      progress: {
        percentage: Math.min((streak.currentStreak / streak.targetDays) * 100, 100),
        daysRemaining: Math.max(streak.targetDays - streak.currentStreak, 0),
      },
    };

    sendSuccess(res, stats, 'Streak stats fetched');
  } catch (err) {
    next(err);
  }
};
