// src/pages/Leads.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const uniqueLeads = Array.from(new Map(response.data.map(lead => [lead._id, lead])).values());
      setLeads(uniqueLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/leads/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead);
      setLeads(updated);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePaymentChange = async (id, newPaymentStatus) => {
    if (!window.confirm(`Change payment status to "${newPaymentStatus}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/leads/${id}`, { paymentStatus: newPaymentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = leads.map(lead => lead._id === id ? { ...lead, paymentStatus: newPaymentStatus } : lead);
      setLeads(updated);
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Delete selected leads?')) return;
    try {
      const token = localStorage.getItem('token');
      await Promise.all(selectedLeads.map((id) =>
        axios.delete(`http://localhost:3000/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ));
      setLeads(leads.filter(lead => !selectedLeads.includes(lead._id)));
      setSelectedLeads([]);
    } catch (error) {
      alert('Failed to delete selected leads');
    }
  };

  const statusStyles = {
    New: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-800',
    Delay: 'bg-red-100 text-red-700',
    Completed: 'bg-green-100 text-green-700',
    Canceled: 'bg-gray-200 text-gray-800',
  };

  const paymentStyles = {
    'Not Yet': 'bg-gray-100 text-gray-700',
    'Advanced Paid': 'bg-orange-100 text-orange-700',
    Paid: 'bg-green-100 text-green-700',
  };

  const filteredLeads = leads
    .filter((lead, index, arr) => {
      if (!showDuplicates) return true;
      return arr.findIndex(l => l.email === lead.email) !== index;
    })
    .filter((lead) => {
      const statusMatch = filterStatus === 'All' || lead.status === filterStatus;
      const paymentMatch = filterPayment === 'All' || (lead.paymentStatus || 'Not Yet') === filterPayment;
      const searchMatch = [lead.company, lead.contact, lead.email].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const createdAt = new Date(lead.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const dateMatch = (!start || createdAt >= start) && (!end || createdAt <= end);
      return statusMatch && paymentMatch && searchMatch && dateMatch;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">📊 Leads Pipeline</h2>
          <input
            type="text"
            placeholder="Search company, contact, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDuplicates}
                onChange={(e) => setShowDuplicates(e.target.checked)}
              />
              Show Duplicates
            </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-1 rounded-md" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-1 rounded-md" />
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-4 py-2 rounded-md">
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Processing">Processing</option>
              <option value="Delay">Delay</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
            <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="border px-4 py-2 rounded-md">
              <option value="All">All Payments</option>
              <option value="Not Yet">Not Yet</option>
              <option value="Advanced Paid">Advanced Paid</option>
              <option value="Paid">Paid</option>
            </select>
            {selectedLeads.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete Selected ({selectedLeads.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 border-b">Company</th>
                <th className="px-6 py-3 border-b">Contact</th>
                <th className="px-6 py-3 border-b">Contact Number</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Address</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Quantity</th>
                <th className="px-6 py-3 border-b">Value</th>
                <th className="px-6 py-3 border-b">Payment</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectLead(lead._id)}
                    />
                  </td>
                  <td className="px-6 py-4 border-b">{lead.company}</td>
                  <td className="px-6 py-4 border-b">{lead.contact}</td>
                  <td className="px-6 py-4 border-b">{lead.contactNumber || '-'}</td>
                  <td className="px-6 py-4 border-b">{lead.email}</td>
                  <td className="px-6 py-4 border-b">{lead.address || '-'}</td>
                  <td className="px-6 py-4 border-b">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${statusStyles[lead.status] || ''} border-none`}
                    >
                      <option value="New">New</option>
                      <option value="Processing">Processing</option>
                      <option value="Delay">Delay</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 border-b">{lead.quantity}</td>
                  <td className="px-6 py-4 border-b font-semibold text-gray-800">{lead.value}</td>
                  <td className="px-6 py-4 border-b">
                    <select
                      value={lead.paymentStatus || 'Not Yet'}
                      onChange={(e) => handlePaymentChange(lead._id, e.target.value)}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${paymentStyles[lead.paymentStatus || 'Not Yet']} border-none`}
                    >
                      <option value="Not Yet">Not Yet</option>
                      <option value="Advanced Paid">Advanced Paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
<td className="px-6 py-4 border-b">
  <button
    onClick={() => navigate(`/leads/add?id=${lead._id}`)}
    className="text-blue-600 hover:underline"
  >
    Edit
  </button>
</td>


                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <p className="text-center text-gray-500 py-4">No leads found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
