import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Send, Image as ImageIcon } from "lucide-react";

const EmailCampaign = () => {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const emailList = [
        ...new Set(
          response.data
            .map((lead) => lead.email?.toLowerCase())
            .filter((email) => email)
        ),
      ];

      setEmails(emailList);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSendCampaign = async () => {
    if (!message.trim() && !image) {
      setStatus({
        type: "error",
        text: "Please enter a message or upload an image.",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const token = localStorage.getItem("token");

      // Use FormData for text + image
      const formData = new FormData();
      formData.append("message", message);
      formData.append("emails", JSON.stringify(emails));
      if (image) formData.append("image", image);

      await axios.post("http://localhost:3000/send-email-campaign", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({
        type: "success",
        text: `✅ Campaign sent successfully to ${emails.length} emails!`,
      });
      setMessage("");
      setImage(null);
      setPreview("");
    } catch (error) {
      console.error("Error sending campaign:", error);
      setStatus({
        type: "error",
        text: "❌ Failed to send the campaign. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-white shadow-md rounded-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Email Campaigns</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Manage and send your email campaigns effectively. You can send a text,
        image, or both to all leads.
      </p>

      {/* Campaign Form */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Create Campaign
        </h2>

        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          placeholder="Write your campaign message here..."
          className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Image Upload */}
        <div className="mt-4 flex items-center gap-4">
          <label
            htmlFor="imageUpload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
          >
            <ImageIcon className="w-5 h-5" />
            Upload Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 rounded-md object-cover border shadow"
            />
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendCampaign}
          disabled={loading || emails.length === 0}
          className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
            loading || emails.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Send className="w-5 h-5" />
          {loading ? "Sending..." : "Send Campaign"}
        </button>

        {/* Status Message */}
        {status && (
          <p
            className={`mt-3 text-sm font-medium ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.text}
          </p>
        )}
      </div>

      {/* Email List */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          All Email Addresses
        </h2>

        {emails.length === 0 ? (
          <p className="text-gray-500 italic">No emails available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {emails.map((email, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100 transition"
              >
                {email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaign;
