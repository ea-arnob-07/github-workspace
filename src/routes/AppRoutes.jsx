import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/Layout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Search from '../pages/Search';
import UserDetails from '../pages/UserDetails';
import RepositoryDetails from '../pages/RepositoryDetails';
import Favorites from '../pages/Favorites';
import Collections from '../pages/Collections';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import MyProfile from '../pages/MyProfile';
import CreateRepository from '../pages/CreateRepository';
import MyRepositoryManager from '../pages/MyRepositoryManager';

/**
 * AppRoutes — Central route definitions.
 * Public routes: /login, /register
 * Protected routes: everything else (wrapped in Layout)
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes — wrapped in Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/users/:username" element={<UserDetails />} />
        <Route path="/repos/:owner/:repo" element={<RepositoryDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* GitHub Integrated Routes */}
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-profile/create-repository" element={<CreateRepository />} />
        <Route path="/my-profile/repos/:owner/:repo" element={<MyRepositoryManager />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
