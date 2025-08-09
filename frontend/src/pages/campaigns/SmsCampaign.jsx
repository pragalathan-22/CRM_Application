import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquareText } from 'lucide-react';

const SmsCampaign = () => {
  const [mobileNumbers, setMobileNumbers] = useState([]);

  useEffect(() => {
    fetchMobileNumbers();
  }, []);

  const fetchMobileNumbers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const numbers = response.data
        .map((lead) => lead.contactNumber)
        .filter((num) => num); // Filter out null or undefined

      // Remove duplicates
      const uniqueNumbers = [...new Set(numbers)];

      setMobileNumbers(uniqueNumbers);
    } catch (error) {
      console.error('Error fetching mobile numbers:', error);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquareText className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">SMS Campaigns</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Manage and send your SMS campaigns effectively. Below are the available mobile numbers from your leads.
      </p>

      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">All Mobile Numbers</h2>

        {mobileNumbers.length === 0 ? (
          <p className="text-gray-500 italic">No mobile numbers available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mobileNumbers.map((number, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 transition"
              >
                {number}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsCampaign;
