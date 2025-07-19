import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './login.css';

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

    // Store token and role
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);

    dispatch({ type: 'LOGIN', payload: response.data.token });

    // Redirect based on role
    if (response.data.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/home');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};


  return (
    <div className="background-container">
      {/* Top Right Signup Button */}
      <div className="top-right">
        <Link to="/signup" className="top-signup-button">
          Signup
        </Link>
      </div>

      {/* Login Form */}
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="form-title">Login</h2>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="submit-button" type="submit">
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
