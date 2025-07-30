// src/pages/Home.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CalendarDays,
  TrendingUp,
  Contact,
  LogOut,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-1">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-gray-600">Here’s what’s happening with your CRM today.</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-5 border-t-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold">Assigned Tasks</h3>
              <p className="text-2xl font-bold text-blue-800 mt-1">12</p>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold">Upcoming Meetings</h3>
              <p className="text-2xl font-bold text-green-700 mt-1">3</p>
            </div>
            <CalendarDays className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-t-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold">New Contacts</h3>
              <p className="text-2xl font-bold text-yellow-700 mt-1">7</p>
            </div>
            <Contact className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-semibold">Monthly Growth</h3>
              <p className="text-2xl font-bold text-purple-700 mt-1">+18%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between items-center">
            <span className="text-gray-700">🗓️ Meeting scheduled with client "ABC Corp"</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span className="text-gray-700">📌 Task "Follow up on proposal" marked as completed</span>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span className="text-gray-700">👤 New contact "Jane Smith" added</span>
            <span className="text-sm text-gray-500">Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
