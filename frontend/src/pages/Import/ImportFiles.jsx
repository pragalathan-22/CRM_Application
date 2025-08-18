import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ImportFiles = () => {
  const [excelData, setExcelData] = useState([]);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Fetch working employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/members');
        // Only include employees who have no relievedDate
        const activeEmployees = res.data.filter(emp => !emp.relievedDate);
        setEmployees(activeEmployees);
      } catch (err) {
        console.error(err);
        setMessage('❌ Failed to load employees');
      }
    };
    fetchEmployees();
  }, []);

  // 🔹 Step 1: Parse file and preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0]?.map(h => h?.toString().trim());
      const rows = data.slice(1);

      const nonEmptyRows = rows.filter(row =>
        row.some(cell => cell !== undefined && cell !== null && cell !== '')
      );

      const formatted = nonEmptyRows.map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] !== undefined ? row[i] : '';
        });
        return obj;
      });

      setExcelData(formatted);
      setMessage(`✅ Parsed ${formatted.length} rows, ready to upload`);
    };

    reader.readAsBinaryString(file);
  };

  // 🔹 Step 2: Upload to backend
  const handleUpload = async () => {
    if (!selectedEmployee) {
      setMessage('⚠️ Please select an employee before uploading');
      return;
    }
    if (excelData.length === 0) {
      setMessage('⚠️ Please select and parse an Excel file first');
      return;
    }

    try {
      await axios.post('http://localhost:3000/records/upload', {
        employeeId: selectedEmployee,
        records: excelData,
      });
      setMessage(`✅ Uploaded ${excelData.length} rows to MongoDB for employee`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to upload to server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📥 Import Excel File</h2>

        {/* Employee Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Excel File (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload Button */}
        {excelData.length > 0 && (
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            🚀 Upload to Server
          </button>
        )}

        {message && <p className="text-green-600 mb-4 mt-4 font-medium">{message}</p>}

        {/* Preview Table */}
        {excelData.length > 0 && (
          <div className="overflow-x-auto mt-6 border-t pt-4">
            <table className="min-w-full text-sm text-left text-gray-600 border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(excelData[0]).map((key, idx) => (
                    <th key={idx} className="px-4 py-2 border-b font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {Object.values(row).map((val, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 border-b">
                        {val}
                      </td>
                    ))}
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

export default ImportFiles;
