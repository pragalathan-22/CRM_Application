import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ImportFiles = () => {
  const [excelData, setExcelData] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0];
      const rows = data.slice(1);
      const formatted = rows.map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i];
        });
        return obj;
      });
      setExcelData(formatted);
      setMessage(`✅ Successfully imported ${formatted.length} rows`);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📥 Import Excel File</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Excel File (.xlsx)</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {message && <p className="text-green-600 mb-4 font-medium">{message}</p>}

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
                {excelData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-2 border-b">{val}</td>
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
