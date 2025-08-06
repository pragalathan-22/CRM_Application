import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEdit = (id) => {
    // Replace this with your route or modal logic
    alert(`Edit contact with ID: ${id}`);
  };

  const filteredContacts = contacts.filter((contact) => {
    const search = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(search) ||
      contact.email?.toLowerCase().includes(search) ||
      contact.contactNumber?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📇 All Contacts
          </h2>

          <input
            type="text"
            placeholder="Search name, email, or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {contacts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No contacts found. Please add leads first.
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No matching contacts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Contact Number</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="transition hover:bg-blue-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 text-gray-700">{contact.email}</td>
                    <td className="px-6 py-4 text-gray-700">{contact.contactNumber || 'N/A'}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(contact.id)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                      >
                        Delete
                      </button>
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
