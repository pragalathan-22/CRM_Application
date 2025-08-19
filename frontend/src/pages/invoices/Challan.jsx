// src/components/AllInvoice.jsx
import React, { useEffect, useState } from "react";
import logoImage from "../../assets/WhatsApp Image 2025-08-19 at 2.29.11 PM.jpeg"; 

export default function challan() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    fetch("http://localhost:3000/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        setFilteredInvoices(data);
      })
      .catch((err) => console.error("❌ Error fetching invoices:", err));
  };

  useEffect(() => {
    const filtered = invoices.filter(
      (inv) =>
        inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.estimateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await fetch(`http://localhost:3000/api/invoices/${id}`, {
        method: "DELETE",
      });
      const updatedInvoices = invoices.filter((inv) => inv._id !== id);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
    } catch (err) {
      console.error("❌ Error deleting invoice:", err);
    }
  };

  const handleEditChange = (field, value) => {
    setEditInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...(editInvoice.items || [])];
    
    // Convert numerical fields to a number type
    const newValue = ["quantity", "rate", "discount"].includes(field)
      ? Number(value)
      : value;

    updatedItems[index] = { ...updatedItems[index], [field]: newValue };
    setEditInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:3000/api/invoices/${editInvoice._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editInvoice),
      });
      alert("✅ Invoice updated successfully!");
      setEditInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error("❌ Error updating invoice:", err);
    }
  };

  // ===== EDIT FORM VIEW =====
  if (editInvoice) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            ["Estimate Date", "estimateDate"],
            ["Estimate No", "estimateNumber"],
            ["Reference No", "referenceNumber"],
            ["Due Date", "dueDate"],
            ["Customer Name", "customerName"],
            ["Billing Address", "billingAddress"],
            ["Shipping Address", "shippingAddress"],
            ["Customer GSTIN", "customerGSTIN"],
            ["Place of Supply", "placeOfSupply"],
          ].map(([label, field], i) => (
            <div key={i}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                type="text"
                value={editInvoice[field] || ""}
                onChange={(e) => handleEditChange(field, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
          ))}
        </div>

        {/* Edit Items */}
        <h3 className="text-lg font-bold mb-2">Items</h3>
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100">
            <tr>
              {["Item", "HSN", "Qty", "Rate", "Discount"].map((h, i) => (
                <th key={i} className="border p-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(editInvoice.items || []).map((it, idx) => (
              <tr key={idx}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={it.name}
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={it.hsn}
                    onChange={(e) => handleItemChange(idx, "hsn", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={it.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={it.rate}
                    onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={it.discount}
                    onChange={(e) => handleItemChange(idx, "discount", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditInvoice(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ===== VIEW PRINT MODE =====
  if (selectedInvoice) {
    const savedEstimate = selectedInvoice;
    let totalTaxable = 0,
      totalCGST = 0,
      totalSGST = 0,
      total = 0;

    (savedEstimate.items || []).forEach((it) => {
      const qty = +it.quantity || 0,
        rate = +it.rate || 0,
        disc = +it.discount || 0;
      const incl = qty * rate - disc;
      const taxable = incl / 1.18;
      const cgst = taxable * 0.09;
      const sgst = taxable * 0.09;
      const t = taxable + cgst + sgst;
      totalTaxable += taxable;
      totalCGST += cgst;
      totalSGST += sgst;
      total += t;
    });

    return (
      <div className="bg-gray-50 p-6 min-h-screen">
        <button
          onClick={() => setSelectedInvoice(null)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to List
        </button>

        {/* Print Layout */}
        <div
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            background: "#fff",
            margin: "0 auto",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            color: "black",
          }}
        >
          <div
            id="printArea"
            className="p-6 text-sm text-gray-800 font-sans max-w-4xl mx-auto"
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Company Logo" className="max-w-[50px]" />
            </div>

            {/* Print Button */}
            <div className="flex justify-end mb-4 no-print">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Print
              </button>
            </div>

            {/* Title */}
            <h2 className="text-center text-2xl font-bold text-red-600 mb-4">
              Challan
            </h2>

            {/* Company Info */}
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-red-600">
                  Newtonsky5 Technology Pvt Ltd
                </h3>
                <p>
                  NO:126, 1ST FLOOR, BAJANAI KOIL STREET, VALLAM,
                  <br />
                  Chengalpattu, Tamil Nadu 603002
                  <br />
                  9894154436 | info@newtonsky5.com
                </p>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td className="font-semibold">GSTIN</td>
                    <td>33AAHCN7836R1ZO</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">State</td>
                    <td>33-Tamil Nadu</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">PAN</td>
                    <td>AAHCN7836R</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">CIN</td>
                    <td>U51505TN2021PTC145911</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Estimate Details */}
            <div className="grid grid-cols-2 mb-4">
              {[
                ["challan Date", savedEstimate.estimateDate],
                ["challan No", savedEstimate.estimateNumber],
                ["Reference No", savedEstimate.referenceNumber || "-"],
                ["Due Date", savedEstimate.dueDate],
              ].map(([label, val], i) => (
                <p key={i}>
                  <strong>{label}:</strong> {val}
                </p>
              ))}
            </div>

            {/* Customer Info */}
            <table className="w-full border border-black mb-3">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="border p-2 text-left">Customer Name</th>
                  <th className="border p-2 text-left">Billing Address</th>
                  <th className="border p-2 text-left">Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{savedEstimate.customerName}</td>
                  <td className="border p-2">{savedEstimate.billingAddress}</td>
                  <td className="border p-2">{savedEstimate.shippingAddress}</td>
                </tr>
              </tbody>
            </table>

            {/* GST Info */}
            <table className="w-full border border-black mb-3">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="border p-2">Customer GSTIN</th>
                  <th className="border p-2">Place of Supply</th>
                  <th className="border p-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{savedEstimate.customerGSTIN}</td>
                  <td className="border p-2">{savedEstimate.placeOfSupply}</td>
                  <td className="border p-2">{savedEstimate.dueDate}</td>
                </tr>
              </tbody>
            </table>

            {/* Items Table */}
            <table className="w-full border border-black text-center text-xs mb-4">
              <thead className="bg-yellow-100">
                <tr>
                  {[
                    "Item",
                    "HSN/SAC",
                    "Qty",
                    "Rate",
                    "Discount",
                    "CGST%",
                    "SGST%",
                    "Taxable",
                    "Total",
                  ].map((h, i) => (
                    <th key={i} className="border p-1">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedEstimate.items.map((it, i) => {
                  const qty = +it.quantity || 0;
                  const rate = +it.rate || 0;
                  const disc = +it.discount || 0;
                  const incl = qty * rate - disc;
                  const taxable = incl / 1.18;
                  const cgst = taxable * 0.09;
                  const sgst = taxable * 0.09;
                  const t = taxable + cgst + sgst;

                  return (
                    <tr key={i}>
                      <td className="border p-1 text-left">{it.name}</td>
                      <td className="border p-1">{it.hsn}</td>
                      <td className="border p-1">{qty}</td>
                      <td className="border p-1">{rate.toFixed(2)}</td>
                      <td className="border p-1">{disc.toFixed(2)}</td>
                      <td className="border p-1">{cgst.toFixed(2)}</td>
                      <td className="border p-1">{sgst.toFixed(2)}</td>
                      <td className="border p-1">{taxable.toFixed(2)}</td>
                      <td className="border p-1">{t.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="font-semibold">
                  <td className="border p-1" colSpan={5}>
                    Total
                  </td>
                  <td className="border p-1">{totalCGST.toFixed(2)}</td>
                  <td className="border p-1">{totalSGST.toFixed(2)}</td>
                  <td className="border p-1">{totalTaxable.toFixed(2)}</td>
                  <td className="border p-1">{total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end mb-4 text-sm">
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4">Taxable Amount =</td>
                    <td>{totalTaxable.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Total Tax (GST) =</td>
                    <td>{(totalCGST + totalSGST).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 font-semibold">Total Value =</td>
                    <td className="font-semibold">{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total in Words */}
            <div className="border-black px-3 py-2 mb-4 text-sm font-bold italic">
              Total amount (in words): Eleven Thousand Two Hundred Ten Rupees Only
            </div>

            {/* Bank Details */}
            <div className="border border-black p-4 mb-4 w-1/2 text-sm font-semibold">
              <div className="mb-1 font-bold underline">Bank Details:</div>
              Account Number: 10140870796 | IFSC: IDFB0080911
              <br />
              Bank Name: IDFC BANK | Branch Name: MAHINDRA WORLD CITY, PARANUR
            </div>

            {/* Notes */}
            <div className="text-sm mb-2">
              <strong>Notes:</strong>
              <br />
              Before taking the product, you must check here and take it. You are
              not allowed to send a return
            </div>

            {/* Terms */}
            <div className="text-sm mb-4">
              <strong>Terms & Conditions:</strong>
              <ul className="list-disc ml-6 mt-1">
                <li>2 year Warranty</li>
                <li>75% advance before starting work</li>
                <li>25% payment before delivery</li>
                <li>Shipping and Installation charges extra.</li>
              </ul>
            </div>

            {/* Signature */}
            <div className="text-right text-sm -mt-4">
              For Newtonsky5 Technology Pvt Ltd
              <br />
              <br />
              _______
              <br />
              Authorised Signatory
              <p className="text-[9px] text-gray-600 mt-1">
                *computerized signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LIST VIEW =====
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Challan</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Estimate No or Customer Name"
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b p-3 text-left">challan No</th>
              <th className="border-b p-3 text-left">Customer Name</th>
              <th className="border-b p-3 text-left">Date</th>
              <th className="border-b p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="p-3">{inv.estimateNumber}</td>
                  <td className="p-3">{inv.customerName}</td>
                  <td className="p-3">{inv.estimateDate}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        setEditInvoice(JSON.parse(JSON.stringify(inv)))
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}