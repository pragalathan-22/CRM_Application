// src/pages/Leads/AddLead.jsx
import React, { useState } from 'react';

const AddLead = () => {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    status: '',
    value: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Lead:', form);
    setForm({ company: '', contact: '', email: '', status: '', value: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Person"
            value={form.contact}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="value"
            placeholder="Deal Value"
            value={form.value}
            onChange={handleChange}
            required
            className="block w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
