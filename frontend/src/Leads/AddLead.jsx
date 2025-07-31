import React, { useState } from 'react';
import axios from 'axios';

const AddLead = () => {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    contactNumber: '',
    email: '',
    productName: '',
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

      alert('✅ Lead added successfully!');
      setForm({
        company: '',
        contact: '',
        contactNumber: '',
        email: '',
        productName: '',
        quantity: '',
        value: '',
      });
    } catch (error) {
      console.error('Error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <span>➕</span> Add New Lead
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700">🏢 Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Acme Corp"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">👤 Contact Name</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📞 Contact Number</label>
            <input
              type="number"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="9876543210"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📧 Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📦 Product Name</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Laptop"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">🔢 Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="10"
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700">💰 Deal Value</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="50000"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 w-full md:w-auto"
          >
            ➕ Submit Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLead;
