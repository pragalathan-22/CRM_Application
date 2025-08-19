import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

const API_URL = "http://localhost:3000/api/members"; // change if deployed

export default function AllMembers() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    phone: "",
    email: "",
    joiningDate: "",
    relievedDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch members on load
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API_URL);
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add new member
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        joiningDate: formData.joiningDate,
        relievedDate: formData.relievedDate || null,
      });
      setMembers([res.data, ...members]);
      resetForm();
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  // ✅ Edit member (with confirm)
  const handleEdit = (member) => {
    const confirmEdit = window.confirm(
      `Are you sure you want to edit details of ${member.name}?`
    );
    if (!confirmEdit) return;

    setIsEditing(true);
    setFormData({
      id: member._id,
      name: member.name,
      phone: member.phone,
      email: member.email,
      joiningDate: member.joiningDate?.slice(0, 10) || "",
      relievedDate: member.relievedDate?.slice(0, 10) || "",
    });
  };

  // ✅ Update member
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/${formData.id}`, formData);
      setMembers(members.map((m) => (m._id === formData.id ? res.data : m)));
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating member:", err);
    }
  };

  // ✅ Delete member (with confirm)
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      phone: "",
      email: "",
      joiningDate: "",
      relievedDate: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Members</h1>

      {/* Form */}
      <form
        onSubmit={isEditing ? handleUpdate : handleAdd}
        className="mb-8 bg-white shadow-md rounded-xl p-6 border border-gray-100"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Member" : "Add New Member"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            name="relievedDate"
            value={formData.relievedDate}
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            {isEditing ? "Update Member" : "Add Member"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Members Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                Phone
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                Joining Date
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                Relieved Date
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{member.name}</td>
                <td className="px-6 py-3">{member.phone}</td>
                <td className="px-6 py-3">{member.email}</td>
                <td className="px-6 py-3">
                  {member.joiningDate ? member.joiningDate.slice(0, 10) : "—"}
                </td>
                <td className="px-6 py-3">
                  {member.relievedDate ? member.relievedDate.slice(0, 10) : "—"}
                </td>
                <td className="px-6 py-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No members found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
