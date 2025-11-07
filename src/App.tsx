import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import ActiveCampaigns from './pages/ActiveCampaigns';
import CenterWiseData from './pages/CenterWiseData';
import Mapping from './pages/Mapping';
import Chat from './pages/Chat';
import UserActivity from './pages/UserActivity';
import UserAccess from './pages/UserAccess';
import UserManagement from './pages/UserManagement';
import UserDetails from './pages/UserDetails';
import UserProfile from './pages/UserProfile';
import Tools from './pages/Tools';
import Admin from './pages/Admin';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div>
      {user && (
        <>
          <Navigation />
          <Sidebar />
        </>
      )}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <ActiveCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/center-wise"
          element={
            <ProtectedRoute>
              <CenterWiseData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapping"
          element={
            <ProtectedRoute>
              <Mapping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <UserActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-access"
          element={
            <ProtectedRoute requireAdmin>
              <UserAccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute requireAdmin>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-details"
          element={
            <ProtectedRoute requireAdmin>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
