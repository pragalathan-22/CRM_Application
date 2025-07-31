import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contactList = response.data.map((lead) => ({
        id: lead._id,
        name: lead.contact,
        email: lead.email,
        contactNumber: lead.contactNumber,
      }));

      setContacts(contactList);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const toggleCheckbox = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      const allIds = contacts.map((contact) => contact.id);
      setSelectedContacts(allIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (contacts.length > 0) {
      setSelectAll(selectedContacts.length === contacts.length);
    }
  }, [selectedContacts, contacts]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📇 All Contacts
            {selectedContacts.length > 0 && (
              <span className="ml-2 text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {selectedContacts.length} selected
              </span>
            )}
          </h2>
          {contacts.length > 0 && (
            <label className="inline-flex items-center gap-2 mt-4 md:mt-0">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm font-medium">Select All</span>
            </label>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No contacts found. Please add leads first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Contact Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`transition hover:bg-blue-50 ${
                      selectedContacts.includes(contact.id) ? 'bg-blue-100' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleCheckbox(contact.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 text-gray-700">{contact.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {contact.contactNumber || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContacts;
