import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import OnboardingPage from '../pages/OnboardingPage'
import DashboardPage from '../pages/DashboardPage'
import DailyGoalPage from '../pages/DailyGoalPage'
import StreakPage from '../pages/StreakPage'
import MoodPage from '../pages/MoodPage'
import ModulesPage from '../pages/ModulesPage'
import ChatPage from '../pages/ChatPage'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../layouts/AppLayout'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* App pages */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/dailygoal"  element={<ProtectedRoute><AppLayout><DailyGoalPage /></AppLayout></ProtectedRoute>} />
      <Route path="/streak"     element={<ProtectedRoute><AppLayout><StreakPage /></AppLayout></ProtectedRoute>} />
      <Route path="/mood"       element={<ProtectedRoute><AppLayout><MoodPage /></AppLayout></ProtectedRoute>} />
      <Route path="/modules"    element={<ProtectedRoute><AppLayout><ModulesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/chat"       element={<ProtectedRoute><AppLayout><ChatPage /></AppLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}