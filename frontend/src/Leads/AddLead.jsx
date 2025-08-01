import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AddLead = () => {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    contactNumber: '',
    email: '',
    productName: '',
    quantity: '',
    value: '',
    address: '',
  });

  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('id');
  const isEdit = Boolean(leadId);
  const navigate = useNavigate();

  // Fetch existing lead if in edit mode
  useEffect(() => {
    const fetchLead = async () => {
      if (isEdit) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:3000/leads/${leadId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setForm(res.data);
        } catch (err) {
          console.error(err);
          alert('❌ Failed to load lead for editing');
        }
      }
    };
    fetchLead();
  }, [isEdit, leadId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in');
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/leads/${leadId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('✅ Lead updated successfully!');
      } else {
        await axios.post('http://localhost:3000/leads', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('✅ Lead added successfully!');
      }

      // Reset and redirect
      setForm({
        company: '',
        contact: '',
        contactNumber: '',
        email: '',
        productName: '',
        quantity: '',
        value: '',
        address: '',
      });

      navigate('/leads/all-leads');
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert(error.response?.data?.message || 'Error saving lead');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <span>{isEdit ? '✏️' : '➕'}</span> {isEdit ? 'Edit Lead' : 'Add New Lead'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: '🏢 Company', name: 'company', type: 'text', placeholder: 'e.g. Acme Corp' },
            { label: '👤 Contact Name', name: 'contact', type: 'text', placeholder: 'John Doe' },
            { label: '📞 Contact Number', name: 'contactNumber', type: 'number', placeholder: '9876543210' },
            { label: '📧 Email', name: 'email', type: 'email', placeholder: 'example@gmail.com' },
            { label: '📦 Product Name', name: 'productName', type: 'text', placeholder: 'e.g. Laptop' },
            { label: '🔢 Quantity', name: 'quantity', type: 'number', placeholder: '10' },
            { label: '💰 Deal Value', name: 'value', type: 'number', placeholder: '50000' },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {/* Address - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">📍 Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter full address here"
            />
          </div>

          {/* Submit Button - Full Width */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200 w-full"
            >
              {isEdit ? '✏️ Update Lead' : '➕ Submit Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
