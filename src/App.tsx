import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { CreateQuiz } from './pages/CreateQuiz';
import { EditQuiz } from './pages/EditQuiz';
import { TakeQuiz } from './pages/TakeQuiz';
import { QuizResults } from './pages/QuizResults';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { Analytics } from './pages/Analytics';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotFound } from './pages/NotFound';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#0A071E] text-slate-100 selection:bg-purple-600 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Marketing & Informational */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<PrivacyPolicy />} />

                {/* Public Quiz Taking Experience (No account required for friends!) */}
                <Route path="/quiz/:slug" element={<TakeQuiz />} />
                <Route path="/quiz/:slug/results" element={<QuizResults />} />
                <Route path="/quiz/:slug/leaderboard" element={<LeaderboardPage />} />

                {/* Protected Creator Studio & Management */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditQuiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics/:id"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
