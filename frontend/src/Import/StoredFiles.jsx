import React, { useEffect, useState } from 'react';

const StoredFiles = () => {
  const [storedData, setStoredData] = useState([]);

  useEffect(() => {
    const imported = localStorage.getItem('importedExcelData');
    if (imported) {
      setStoredData(JSON.parse(imported));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📂 Stored Imported Data</h2>

        {storedData.length === 0 ? (
          <p className="text-gray-600">No data available. Please import a file first.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-left text-gray-600 border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {Object.keys(storedData[0]).map((key, idx) => (
                    <th key={idx} className="px-4 py-2 border-b font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {storedData.map((row, idx) => (
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

export default StoredFiles;
