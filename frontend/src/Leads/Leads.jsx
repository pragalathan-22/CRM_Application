import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
      fetchLeads();
    }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: token,
        },
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedLeads = leads.map((lead) =>
      lead._id === id ? { ...lead, status: newStatus } : lead
    );
    setLeads(updatedLeads);
    // Optionally send status update to backend here
  };

  const handlePaymentChange = (id, newPaymentStatus) => {
    const updatedLeads = leads.map((lead) =>
      lead._id === id ? { ...lead, paymentStatus: newPaymentStatus } : lead
    );
    setLeads(updatedLeads);
    // Optionally send payment update to backend here
  };

  const filteredLeads =
    filterStatus === 'All'
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  const statusStyles = {
    New: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-800',
    Delay: 'bg-red-100 text-red-700',
    Completed: 'bg-green-100 text-green-700',
  };

  const paymentStyles = {
    'Not Yet': 'bg-gray-100 text-gray-700',
    'Advanced Paid': 'bg-orange-100 text-orange-700',
    Paid: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">
        {/* Header with Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">📊 Leads Pipeline</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Processing">Processing</option>
            <option value="Delay">Delay</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">Company</th>
                <th className="px-6 py-3 border-b">Contact</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Status</th>
                <th className="px-6 py-3 border-b">Quantity</th>
                <th className="px-6 py-3 border-b">Value</th>
                <th className="px-6 py-3 border-b">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{lead.company}</td>
                  <td className="px-6 py-4 border-b">{lead.contact}</td>
                  <td className="px-6 py-4 border-b">{lead.email}</td>
                  <td className="px-6 py-4 border-b">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-md font-medium text-xs ${statusStyles[lead.status] || ''} border-none`}
                    >
                      <option value="New">New</option>
                      <option value="Processing">Processing</option>
                      <option value="Delay">Delay</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 border-b">{lead.quantity}</td>
                  <td className="px-6 py-4 border-b font-semibold text-gray-800">
                    {lead.value}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <select
                      value={lead.paymentStatus || 'Not Yet'}
                      onChange={(e) =>
                        handlePaymentChange(lead._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-md font-medium text-xs ${
                        paymentStyles[lead.paymentStatus || 'Not Yet']
                      } border-none`}
                    >
                      <option value="Not Yet">Not Yet</option>
                      <option value="Advanced Paid">Advanced Paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No leads found for this status.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
