import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { NavigationSidebar } from '@/components/layout/NavigationSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { InboxPage } from '@/pages/InboxPage';
import { QuickCapturePage } from '@/pages/QuickCapturePage';
import { ClarifyPage } from '@/pages/ClarifyPage';
import { OrganizePage } from '@/pages/OrganizePage';
import { EngagePage } from '@/pages/EngagePage';
import { ReviewPage } from '@/pages/ReviewPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ShopPage } from '@/pages/ShopPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { TeamPage } from '@/pages/TeamPage';
import { NotificationPage } from '@/pages/NotificationPage';
import { TaskDetailsPage } from '@/pages/TaskDetailsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background-light">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden relative">
        <NavigationSidebar />
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          {children}
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/inbox" element={<InboxPage />} />
                      <Route path="/capture" element={<QuickCapturePage />} />
                      <Route path="/clarify" element={<ClarifyPage />} />
                      <Route path="/organize" element={<OrganizePage />} />
                      <Route path="/engage" element={<EngagePage />} />
                      <Route path="/review" element={<ReviewPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/achievements" element={<AchievementsPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/team" element={<TeamPage />} />
                      <Route path="/notifications" element={<NotificationPage />} />
                      <Route path="/task-details" element={<TaskDetailsPage />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

