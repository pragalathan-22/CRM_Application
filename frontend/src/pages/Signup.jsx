import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || password !== confirmPassword) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        username,
        password,
      });

      alert(response.data.message);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="background-container">
      {/* Top Right Login Button */}
      <div className="top-right">
        <Link to="/login" className="top-signup-button">
          Login
        </Link>
      </div>

      {/* Signup Form */}
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleRegister}>
          <h2 className="form-title">Create Account</h2>

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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button className="submit-button" type="submit">
            Register
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

export default Signup;
