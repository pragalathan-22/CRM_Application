// ✅ StoredFiles.jsx (Fully Cleaned & Updated)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const StoredFiles = () => {
  const [storedData, setStoredData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [duplicates, setDuplicates] = useState([]);

  // ✅ Format helpers
  const formatStatus = (status = '') => {
    const s = status.trim().toLowerCase();
    if (s === 'completed') return 'Completed';
    if (s === 'processing') return 'Processing';
    if (s === 'delay') return 'Delay';
    if (s === 'canceled') return 'Canceled';
    return 'New';
  };

  const formatPayment = (payment = '') => {
    const p = payment.trim().toLowerCase();
    if (p === 'paid') return 'Paid';
    if (p === 'advanced paid') return 'Advanced Paid';
    return 'Not Yet';
  };

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/records');
      setStoredData(res.data);
      detectDuplicates(res.data);
    } catch (err) {
      console.error('❌ Error fetching:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(storedData.map(r => r._id));
  const deselectAll = () => setSelectedIds([]);

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return alert('No rows selected');
    try {
      await Promise.all(
        selectedIds.map(id => axios.delete(`http://localhost:3000/records/${id}`))
      );
      alert('✅ Deletion complete');
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      console.error('❌ Bulk delete failed:', err);
    }
  };

  const mergeToLeads = async () => {
    if (selectedIds.length === 0) return alert('No records selected to merge.');
    try {
      const token = localStorage.getItem('token');
      const selectedRecords = storedData.filter(r => selectedIds.includes(r._id));
      const existingLeadsRes = await axios.get('http://localhost:3000/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingLeads = existingLeadsRes.data;
      let mergedCount = 0;
      let skippedCount = 0;

      await Promise.all(
        selectedRecords.map(async (record) => {
          const email = record.Email?.trim();
          const productName = record['Product Name']?.trim();

          const alreadyExists = existingLeads.some(lead =>
            lead.email === email && lead.productName === productName
          );

          if (alreadyExists) return skippedCount++;

          const leadData = {
            company: (record['Company Name'] || '-').trim(),
            contact: (record['Contact Name'] || '-').trim(),
            contactNumber: (record['Contact Number'] || '').toString().trim(),
            email,
            productName,
            quantity: parseInt(record.Qty || 1),
            value: (record.Price || '0').toString().trim(),
            address: (record.Address || '-').trim(),
            status: formatStatus(record.Status),
            paymentStatus: formatPayment(record.Payment),
            source: 'Excel',
          };

          try {
            await axios.post('http://localhost:3000/leads', leadData, {
              headers: { Authorization: `Bearer ${token}` }
            });
            mergedCount++;
          } catch (err) {
            console.error('❌ Merge error:', leadData, err.response?.data || err.message);
          }
        })
      );

      alert(`✅ Merged ${mergedCount} new records.\n⛔ Skipped ${skippedCount} duplicates.`);
      setSelectedIds([]);
    } catch (err) {
      console.error('❌ Merge to leads failed:', err);
    }
  };

  const startEdit = (row) => {
    setEditRowId(row._id);
    setEditData({ ...row });
  };
  const cancelEdit = () => { setEditRowId(null); setEditData({}); };
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/records/${editRowId}`, editData);
      setEditRowId(null);
      setEditData({});
      fetchData();
    } catch (err) {
      console.error('❌ Edit error:', err);
    }
  };

  const detectDuplicates = (data) => {
    const seen = {};
    const dupIds = [];
    data.forEach(item => {
      const key = `${item.Email}|${item['Product Name']}`;
      if (seen[key]) dupIds.push(item._id);
      else seen[key] = true;
    });
    setDuplicates(dupIds);
  };

  const groupByDate = (data) => {
    const groups = {};
    data.forEach(item => {
      const date = dayjs(item.createdAt).format('YYYY-MM-DD');
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📂 Stored Imported Data</h2>
          <div className="flex gap-2 flex-wrap">
            <button onClick={selectAll} className="px-4 py-1 bg-blue-500 text-white rounded-md">Select All</button>
            <button onClick={deselectAll} className="px-4 py-1 bg-gray-500 text-white rounded-md">Deselect</button>
            <button onClick={deleteSelected} className="px-4 py-1 bg-red-500 text-white rounded-md">🗑️ Delete Selected</button>
            <button onClick={mergeToLeads} className="px-4 py-1 bg-green-600 text-white rounded-md">🔁 Merge to Leads</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600 border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b text-center">Select</th>
                {storedData[0] && Object.keys(storedData[0])
                  .filter(k => k !== '__v')
                  .map((key, idx) => (
                    <th key={idx} className="px-4 py-2 border-b">{key}</th>
                  ))}
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupByDate(storedData)).map(([date, records]) => (
                <React.Fragment key={date}>
                  <tr className="bg-blue-100">
                    <td colSpan={Object.keys(storedData[0]).length + 2} className="px-4 py-2 font-bold text-gray-800">
                      📅 {dayjs(date).format('DD-MM-YYYY')}
                    </td>
                  </tr>
                  {records.map(row => (
                    <tr key={row._id} className={`hover:bg-gray-50 ${duplicates.includes(row._id) ? 'bg-yellow-100' : ''}`}>
                      <td className="px-2 py-2 border-b text-center">
                        <input type="checkbox" checked={selectedIds.includes(row._id)} onChange={() => toggleSelect(row._id)} />
                      </td>
                      {Object.entries(row).filter(([key]) => key !== '__v').map(([key, value], i) => {
                        let displayValue = value;
                        if (key === 'Status') displayValue = formatStatus(value);
                        if (key === 'Payment') displayValue = formatPayment(value);
                        return (
                          <td key={i} className="px-4 py-2 border-b">
                            {editRowId === row._id ? (
                              <input
                                value={editData[key] || ''}
                                onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              displayValue
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 border-b text-center">
                        {editRowId === row._id ? (
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="text-green-600">💾 Save</button>
                            <button onClick={cancelEdit} className="text-gray-500">✖ Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(row)} className="text-blue-600">✏️ Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          ⚠️ Highlighted rows are duplicates based on <b>Email</b> + <b>Product Name</b>.
        </p>
      </div>
    </div>
  );
};

export default StoredFiles;
