// src/router/AppRouter.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import About from '../About';
import Contact from '../Contact';


// Admin Pages
import Overview from '../pages/Dashboard/Overview';
import KPIs from '../pages/Dashboard/KPIs';
import Home from '../pages/Home';
import AllContacts from '../pages/Contacts/AllContacts';
import AddContact from '../pages/Contacts/AddContact';
import ImportFiles from '../pages/Import/ImportFiles';
import StoredFiles from '../pages/Import/StoredFiles';
import Leads from '../pages/Leads/Leads';
import AddLead from '../pages/Leads/AddLead';

// Context
import { AuthContext } from '../context/AuthContext';

// Admin Sidebar Layout
import Sidebar from '../components/Sidebar';
import EmailCampaign from '../pages/campaigns/EmailCampaign';
import SmsCampaign from '../pages/campaigns/SmsCampaign';
import AllInvoices from '../pages/invoices/AllInvoices';
import CreateInvoice from '../pages/invoices/CreateInvoice';
import profile from '../pages/Settings/profile';
import notifications from '../pages/Settings/notifications';
import AddMembers from '../pages/team/AddMembers';
import Challan from '../pages/invoices/Challan';



// 🔒 Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem('role');

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'admin') return <Navigate to="/home" replace />;

  return children;
};

// 🌐 Public Route Component
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

// 📦 Admin Layout Wrapper
const AdminLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto h-screen">{children}</main>
  </div>
);

// 📌 Main Router
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
        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/dashboard/overview" element={renderAdminRoute(Overview)} />
        <Route path="/dashboard/kpis" element={renderAdminRoute(KPIs)} />
        <Route path="/contacts/all" element={renderAdminRoute(AllContacts)} />
        <Route path="/contacts/add" element={renderAdminRoute(AddContact)} />
        <Route path="/import/upload" element={renderAdminRoute(ImportFiles)} />
        <Route path="/import/stored-files" element={renderAdminRoute(StoredFiles)} />
        <Route path="/leads/all-leads" element={renderAdminRoute(Leads)} />
        <Route path="/leads/add" element={renderAdminRoute(AddLead)} /> {/* ✅ Handles both add & edit */}
        <Route path="/campaigns/sms" element={renderAdminRoute(SmsCampaign)} />
        <Route path="/campaigns/email" element={renderAdminRoute(EmailCampaign)} />
        <Route path="/invoices/all" element={renderAdminRoute(AllInvoices)} />
        <Route path="/invoices/create" element={renderAdminRoute(CreateInvoice)} />
        <Route path="/settings/profile" element={renderAdminRoute(profile)} />
        <Route path="/settings/notifications" element={renderAdminRoute(notifications)} />\
        <Route path="/team/add-members" element={renderAdminRoute(AddMembers)} />
        <Route path="/invoices/challan" element={renderAdminRoute(Challan)} />

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
