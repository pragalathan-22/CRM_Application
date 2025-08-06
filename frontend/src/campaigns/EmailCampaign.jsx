import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail } from 'lucide-react';

const EmailCampaign = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const emailList = [
        ...new Set(
          response.data
            .map((lead) => lead.email?.toLowerCase())
            .filter((email) => email)
        ),
      ];

      setEmails(emailList);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Email Campaigns</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Manage and send your email campaigns effectively. Below are the unique email addresses from your leads.
      </p>

      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">All Email Addresses</h2>

        {emails.length === 0 ? (
          <p className="text-gray-500 italic">No emails available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {emails.map((email, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 transition"
              >
                {email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaign;
