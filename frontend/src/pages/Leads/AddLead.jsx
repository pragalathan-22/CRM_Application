import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const AddLead = () => {
  const [form, setForm] = useState({
    company: "",
    contact: "",
    contactNumber: "",
    email: "",
    productName: "",
    quantity: "",
    value: "",
    address: "",
    assignedTo: "",
  });

  const [employees, setEmployees] = useState([]);
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("id");
  const isEdit = Boolean(leadId);
  const navigate = useNavigate();

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const workingEmployees = res.data.filter(
          (emp) => emp.joiningDate && !emp.relievedDate
        );
        setEmployees(workingEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Fetch lead if editing
  useEffect(() => {
    const fetchLead = async () => {
      if (isEdit) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`http://localhost:3000/leads/${leadId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setForm(res.data);
        } catch (err) {
          console.error(err);
          alert("❌ Failed to load lead for editing");
        }
      }
    };
    fetchLead();
  }, [isEdit, leadId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/leads/${leadId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Lead updated successfully!");
      } else {
        await axios.post("http://localhost:3000/leads", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Lead added successfully!");
      }

      setForm({
        company: "",
        contact: "",
        contactNumber: "",
        email: "",
        productName: "",
        quantity: "",
        value: "",
        address: "",
        assignedTo: "",
      });

      navigate("/leads/all-leads");
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Error saving lead");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center gap-3">
          <span className="text-blue-600 text-4xl">{isEdit ? "✏️" : "➕"}</span>
          {isEdit ? "Edit Lead" : "Add New Lead"}
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              label: "Company",
              name: "company",
              type: "text",
              placeholder: "e.g. Acme Corp",
            },
            {
              label: "Contact Name",
              name: "contact",
              type: "text",
              placeholder: "John Doe",
            },
            {
              label: "Contact Number",
              name: "contactNumber",
              type: "number",
              placeholder: "9876543210",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "example@gmail.com",
            },
            {
              label: "Product Name",
              name: "productName",
              type: "text",
              placeholder: "e.g. Laptop",
            },
            {
              label: "Quantity",
              name: "quantity",
              type: "number",
              placeholder: "10",
            },
            {
              label: "Deal Value",
              name: "value",
              type: "number",
              placeholder: "50000",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          ))}

          {/* Assign To */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Leads Taken
            </label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter full address here"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-transform duration-200"
            >
              {isEdit ? "✏️ Update Lead" : "➕ Submit Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
