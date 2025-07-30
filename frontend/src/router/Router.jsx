// src/router/AppRouter.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// User & Admin Pages
import Overview from '../pages/Dashboard/Overview';
import KPIs from '../pages/Dashboard/KPIs';
import Home from '../pages/Home';
import AllContacts from '../pages/Contacts/AllContacts';
import AddContact from '../pages/Contacts/AddContact';

// Context
import { AuthContext } from '../context/AuthContext';

// Admin Sidebar Layout
import Sidebar from '../components/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem('role');

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'admin') return <Navigate to="/home" replace />;

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem('role');

  if (user) {
    return role === 'admin'
      ? <Navigate to="/dashboard/overview" replace />
      : <Navigate to="/home" replace />;
  }

  return children;
};

// Admin Layout Wrapper
const AdminLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto h-screen">{children}</main>
  </div>
);

const AppRouter = () => {
  const renderAdminRoute = (Component) => (
    <ProtectedRoute adminOnly>
      <AdminLayout><Component /></AdminLayout>
    </ProtectedRoute>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/dashboard/overview" element={renderAdminRoute(Overview)} />
        <Route path="/dashboard/kpis" element={renderAdminRoute(KPIs)} />
        <Route path="/contacts/all" element={renderAdminRoute(AllContacts)} />
        <Route path="/contacts/add" element={renderAdminRoute(AddContact)} />

        {/* User Route */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={
          <ProtectedRoute>
            <Navigate to={localStorage.getItem('role') === 'admin' ? "/dashboard/overview" : "/home"} replace />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
