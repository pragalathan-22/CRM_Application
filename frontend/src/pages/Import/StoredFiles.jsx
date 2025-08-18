// ✅ StoredFiles.jsx (with employee filter + column + merge button)
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const StoredFiles = () => {
  const [storedData, setStoredData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [duplicates, setDuplicates] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(""); // 🔹 employee filter state
  const [uniqueEmployees, setUniqueEmployees] = useState([]); // 🔹 list of employees

  // ✅ Format helpers
  const formatStatus = (status = "") => {
    const s = status.trim().toLowerCase();
    if (s === "completed") return "Completed";
    if (s === "processing") return "Processing";
    if (s === "delay") return "Delay";
    if (s === "canceled") return "Canceled";
    return "New";
  };

  const formatPayment = (payment = "") => {
    const p = payment.trim().toLowerCase();
    if (p === "paid") return "Paid";
    if (p === "advanced paid") return "Advanced Paid";
    return "Not Yet";
  };

  // ✅ Fetch stored records
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/records");
      const data = res.data || [];
      setStoredData(data);

      // 🔹 extract unique employees for filter
      const employees = [...new Set(data.map((r) => r.employee))].filter(Boolean);
      setUniqueEmployees(employees);

      detectDuplicates(data);
    } catch (err) {
      console.error("❌ Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Select/deselect rows
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(storedData.map((r) => r._id));
  const deselectAll = () => setSelectedIds([]);

  // ✅ Delete multiple
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return alert("No rows selected");
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:3000/records/${id}`)
        )
      );
      alert("✅ Deletion complete");
      setSelectedIds([]);
      await fetchData();
    } catch (err) {
      console.error("❌ Bulk delete failed:", err);
    }
  };


const mergeSelected = async () => {
  if (selectedIds.length === 0) {
    return alert("Please select at least 1 row to merge.");
  }
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/merge-records-to-leads", // ⚠️ use your backend port
      { recordIds: selectedIds },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert(res.data.message);

    // ✅ Redirect to Leads page
    window.location.href = "/leads";
  } catch (err) {
    console.error("❌ Merge failed:", err);
    alert("❌ Merge failed. Check console for details.");
  }
};


  // ✅ Row editing
  const startEdit = (row) => {
    setEditRowId(row._id);
    setEditData({ ...row });
  };
  const cancelEdit = () => {
    setEditRowId(null);
    setEditData({});
  };
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/records/${editRowId}`, editData);
      setEditRowId(null);
      setEditData({});
      await fetchData();
    } catch (err) {
      console.error("❌ Edit error:", err);
    }
  };

  // ✅ Duplicate detection
  const detectDuplicates = (data) => {
    const seen = {};
    const dupIds = [];
    data.forEach((item) => {
      const key = `${item.Email}|${item["Product Name"]}`;
      if (seen[key]) dupIds.push(item._id);
      else seen[key] = true;
    });
    setDuplicates(dupIds);
  };

  // ✅ Group by createdAt date
  const groupByDate = (data) => {
    const groups = {};
    data.forEach((item) => {
      const date = dayjs(item.createdAt).format("YYYY-MM-DD");
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  // ✅ Apply filter
  const filteredData =
    employeeFilter === ""
      ? storedData
      : storedData.filter((r) => r.employee === employeeFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            📂 Stored Imported Data
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={selectAll}
              className="px-4 py-1 bg-blue-500 text-white rounded-md"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-4 py-1 bg-gray-500 text-white rounded-md"
            >
              Deselect
            </button>
            <button
              onClick={deleteSelected}
              className="px-4 py-1 bg-red-500 text-white rounded-md"
            >
              🗑️ Delete Selected
            </button>
            {/* 🔹 Merge Button */}
            <button
              onClick={mergeSelected}
              className="px-4 py-1 bg-purple-500 text-white rounded-md"
            >
              🔗 Merge Selected
            </button>
          </div>
        </div>

        {/* 🔹 Employee Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filter by Employee
          </label>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- All Employees --</option>
            {uniqueEmployees.map((emp, idx) => (
              <option key={idx} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {filteredData.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-600 border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b text-center">Select</th>
                  {/* 🔹 Add Employee Column */}
                  <th className="px-4 py-2 border-b">Employee</th>
{Object.keys(filteredData[0])
  .filter((k) => !["__v", "_id", "employee"].includes(k))  // 👈 skip employee
  .map((key, idx) => (
    <th key={idx} className="px-4 py-2 border-b">
      {key}
    </th>
  ))}

                  <th className="px-4 py-2 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupByDate(filteredData)).map(
                  ([date, records]) => (
                    <React.Fragment key={date}>
                      {/* Group row */}
                      <tr className="bg-blue-100">
                        <td
                          colSpan={
                            (filteredData[0]
                              ? Object.keys(filteredData[0]).length
                              : 0) + 3
                          }
                          className="px-4 py-2 font-bold text-gray-800"
                        >
                          📅 {dayjs(date).format("DD-MM-YYYY")}
                        </td>
                      </tr>

                      {/* Data rows */}
                      {records.map((row) => (
                        <tr
                          key={row._id}
                          className={`hover:bg-gray-50 ${
                            duplicates.includes(row._id)
                              ? "bg-yellow-100"
                              : ""
                          }`}
                        >
                          <td className="px-2 py-2 border-b text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(row._id)}
                              onChange={() => toggleSelect(row._id)}
                            />
                          </td>

                          {/* Employee Column */}
                          <td className="px-4 py-2 border-b font-medium text-gray-800">
                            {row.employee || "-"}
                          </td>

{Object.entries(row)
  .filter(([key]) => !["__v", "_id", "employee"].includes(key))  // 👈 skip employee
  .map(([key, value], i) => {

                              let displayValue = value;
                              if (key === "Status")
                                displayValue = formatStatus(value);
                              if (key === "Payment")
                                displayValue = formatPayment(value);

                              return (
                                <td key={i} className="px-4 py-2 border-b">
                                  {editRowId === row._id ? (
                                    <input
                                      value={editData[key] || ""}
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          [key]: e.target.value,
                                        })
                                      }
                                      className="border rounded px-2 py-1 w-full"
                                    />
                                  ) : (
                                    displayValue?.toString() || "-"
                                  )}
                                </td>
                              );
                            })}

                          <td className="px-4 py-2 border-b text-center">
                            {editRowId === row._id ? (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={saveEdit}
                                  className="text-green-600"
                                >
                                  💾 Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-gray-500"
                                >
                                  ✖ Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(row)}
                                className="text-blue-600"
                              >
                                ✏️ Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-6">
              No stored records found.
            </p>
          )}
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500 mt-4">
          ⚠️ Highlighted rows are duplicates based on <b>Email</b> +{" "}
          <b>Product Name</b>.
        </p>
      </div>
    </div>
  );
};

export default StoredFiles;
