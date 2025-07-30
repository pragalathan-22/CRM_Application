import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './login.css'; // for wave animation

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });

      const { token, role } = response.data;

      // Store token & role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      dispatch({ type: 'LOGIN', payload: token });

      // Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard/overview');
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gradient-to-b from-yellow-100 via-yellow-50 to-cyan-200 overflow-hidden">
      
      {/* Top-right links */}
      <div className="absolute top-4 right-6 flex items-center gap-4 z-10">
        <Link to="/about" className="text-gray-800 hover:text-blue-700 font-medium">About</Link>
        <Link to="/contact" className="text-gray-800 hover:text-blue-700 font-medium">Contact</Link>
        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-700 transition">
          Signup
        </Link>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>

      {/* Ocean Waves */}
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default Login;
