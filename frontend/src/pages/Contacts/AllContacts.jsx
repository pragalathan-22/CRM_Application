import React from 'react';

const AllContacts = () => {
  const contacts = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">📇 All Contacts</h2>

        {contacts.length === 0 ? (
          <p className="text-gray-500">No contacts found.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition duration-200"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-1">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllContacts;
