import React, { useState } from 'react';
import axios from 'axios';

const AddLead = () => {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    quantity: '',
    value: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in');
        return;
      }

      const response = await axios.post('http://localhost:3000/leads', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Lead added:', response.data);
      alert('Lead added successfully!');

      setForm({
        company: '',
        contact: '',
        email: '',
        quantity: '',
        value: '',
      });
    } catch (error) {
      console.error('Add lead error:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert(error.response?.data?.message || 'Error adding lead');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">➕ Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {['company', 'contact', 'email', 'quantity', 'value'].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                {field === 'value' ? 'Deal Value' : field}
              </label>
              <input
                type={field === 'quantity' ? 'number' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field === 'value' ? '$10,000' : `Enter ${field}`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            ➕ Add Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
