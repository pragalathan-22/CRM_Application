import React from 'react';

const Leads = () => {
  const leads = [
    {
      id: 1,
      company: 'Acme Corp',
      contact: 'John Doe',
      email: 'john@acme.com',
      status: 'New',
      value: '$10,000'
    },
    {
      id: 2,
      company: 'Beta Inc.',
      contact: 'Jane Smith',
      email: 'jane@beta.com',
      status: 'Contacted',
      value: '$7,500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Leads Pipeline</h2>
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Company</th>
              <th className="px-4 py-2 border-b">Contact</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{lead.company}</td>
                <td className="px-4 py-2 border-b">{lead.contact}</td>
                <td className="px-4 py-2 border-b">{lead.email}</td>
                <td className="px-4 py-2 border-b">{lead.status}</td>
                <td className="px-4 py-2 border-b">{lead.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;