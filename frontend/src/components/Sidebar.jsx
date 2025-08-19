// src/components/Sidebar.jsx
import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Flag,
  Handshake,
  Import,
  Mail,
  FileText,
  BarChart3,
  LifeBuoy,
  Settings,
  LogOut,
  CheckSquare,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState('');
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      key: 'dashboard',
      subRoutes: [
        { name: 'Overview', path: '/dashboard/overview' },
        { name: 'KPIs', path: '/dashboard/kpis' },
      ],
    },
    {
      name: 'Contacts',
      icon: <Users className="w-5 h-5" />,
      key: 'contacts',
      subRoutes: [
        { name: 'All Contacts', path: '/contacts/all' },
        { name: 'Add Contact', path: '/contacts/add' },
      ],
    },
    {
      name: 'Leads',
      icon: <Flag className="w-5 h-5" />,
      key: 'leads',
      subRoutes: [
        { name: 'Lead Pipeline', path: '/leads/all-Leads' },
        { name: 'Add Lead', path: '/leads/add' },
      ],
    },
    // {
    //   name: 'Deals',
    //   icon: <Handshake className="w-5 h-5" />,
    //   key: 'deals',
    //   subRoutes: [
    //     { name: 'All Deals', path: '/deals' },
    //     { name: 'New Deal', path: '/deals/add' },
    //   ],
    // },
    {
      name: 'Import',
      icon: <Import className="w-5 h-5" />,
      key: 'Import',
      subRoutes: [
        { name: 'Tasks', path: '/import/upload' },
        { name: 'Stored Files', path: '/Import/stored-files' },
      ],
    },
    {
      name: 'Campaigns',
      icon: <Mail className="w-5 h-5" />,
      key: 'campaigns',
      subRoutes: [
        { name: 'Email Campaigns', path: '/campaigns/email' },
        { name: 'SMS Campaigns', path: '/campaigns/sms' },
      ],
    },
    {
      name: 'Invoices',
      icon: <FileText className="w-5 h-5" />,
      key: 'invoices',
      subRoutes: [
        { name: 'All Invoices', path: '/invoices/all' },
        { name: 'Create Invoice', path: '/invoices/create' },
        { name: 'Challan', path: '/invoices/challan' },
      ],
    },
    {
  name: 'Team',
  icon: <CheckSquare className="w-5 h-5" />,
  key: 'team',
  subRoutes: [
    // { name: 'All Members', path: '/team/all-members' },
    { name: 'Team Member', path: '/team/add-members' },
  ],
},
    // {
    //   name: 'Reports',
    //   icon: <BarChart3 className="w-5 h-5" />,
    //   key: 'reports',
    //   subRoutes: [
    //     { name: 'Sales Reports', path: '/reports/sales' },
    //     { name: 'Activity Logs', path: '/reports/logs' },
    //   ],
    // },
    // {
    //   name: 'Support',
    //   icon: <LifeBuoy className="w-5 h-5" />,
    //   key: 'support',
    //   subRoutes: [
    //     { name: 'Tickets', path: '/support/tickets' },
    //     { name: 'FAQs', path: '/support/faqs' },
    //   ],
    // },
    {
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      key: 'settings',
      subRoutes: [
        { name: 'Profile', path: '/settings/profile' },
        { name: 'Notifications', path: '/settings/notifications' },
      ],
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <NavLink
        to="/dashboard/overview"
        className="p-6 font-extrabold text-2xl text-blue-700 border-b border-gray-100 tracking-tight select-none hover:text-blue-900 transition-colors"
      >
        CRM Admin
      </NavLink>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.key} className="mb-4">
            <button
              onClick={() =>
                setOpenMenu(openMenu === item.key ? '' : item.key)
              }
              className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none hover:bg-blue-50 text-gray-800 font-semibold ${
                openMenu === item.key ? 'bg-blue-100' : ''
              }`}
              aria-expanded={openMenu === item.key}
              aria-controls={`sidebar-menu-${item.key}`}
            >
              {item.icon}
              <span className="text-base">{item.name}</span>
              <svg
                className={`ml-auto w-4 h-4 transition-transform ${
                  openMenu === item.key ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {openMenu === item.key && (
              <div id={`sidebar-menu-${item.key}`} className="ml-7 mt-2 space-y-1">
                {item.subRoutes.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-md text-sm transition-colors duration-150 font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-2 text-red-600 font-semibold hover:bg-red-100 rounded-lg transition duration-150"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;