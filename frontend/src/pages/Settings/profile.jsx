import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch admin details from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin")
      .then((res) => {
        if (res.data) {
          // If admin has a relieving date → add new admin mode
          if (res.data.relievingDate) {
            setIsAddingNew(true);
            setAdmin(getEmptyAdmin());
          } else {
            setAdmin(res.data);
            setIsEditing(false);
          }
        } else {
          setAdmin(getEmptyAdmin());
          setIsEditing(true);
          setIsAddingNew(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
        setAdmin(getEmptyAdmin());
        setIsEditing(true);
        setIsAddingNew(true);
        setLoading(false);
      });
  }, []);

  const getEmptyAdmin = () => ({
    name: "",
    role: "Admin",
    email: "",
    phone: "",
    department: "",
    joiningDate: "",
    relievingDate: "",
    location: "",
    profileImage: "",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setAdmin({ ...admin, profileImage: imageURL });
      // Optional: upload file to server/cloud here
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
      });
      const data = await res.json();
      console.log("✅ Saved Admin Details:", data);
      setIsEditing(false);
      setIsAddingNew(false);
    } catch (error) {
      console.error("❌ Error saving admin:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          <div className="relative">
            <img
              src={admin.profileImage || "https://via.placeholder.com/150"}
              alt="Admin Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-md cursor-pointer"
              onClick={() => admin.profileImage && setIsImageModalOpen(true)}
            />
            {isEditing && (
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow hover:bg-blue-700"
              >
                📷
              </label>
            )}
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={admin.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="text-2xl font-semibold text-gray-800 border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-2xl font-semibold text-gray-800">
                {admin.name}
              </h1>
            )}
            <p className="text-gray-500">
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={admin.role}
                  onChange={handleChange}
                  placeholder="Role"
                  className="border rounded-lg px-2 py-1 mt-1"
                />
              ) : (
                admin.role
              )}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Email", name: "email" },
            { label: "Phone", name: "phone" },
            { label: "Department", name: "department" },
            { label: "Joining Date", name: "joiningDate", type: "date" },
            { label: "Relieving Date", name: "relievingDate", type: "date" },
            { label: "Location", name: "location" },
          ].map((field) => (
            <div key={field.name}>
              <p className="text-gray-500">{field.label}</p>
              {isEditing ? (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={admin[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="font-medium">{admin[field.name] || "—"}</p>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  if (isAddingNew) {
                    setAdmin(getEmptyAdmin());
                  }
                  setIsEditing(false);
                }}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isAddingNew ? "Add Admin" : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isAddingNew ? "Add Admin" : "Edit Details"}
            </button>
          )}
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative">
            <img
              src={admin.profileImage}
              alt="Large Profile"
              className="w-full max-w-4xl rounded-lg shadow-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-black font-bold shadow hover:bg-gray-200"
              onClick={() => setIsImageModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
