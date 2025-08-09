import React, { useState } from "react";
import logoImage from "../../assets/react.svg";

const CreateInvoice = () => {
  const emptyItem = { name: "", hsn: "", quantity: 1, rate: 0, discount: 0 };

  const [formData, setFormData] = useState({
    estimateDate: "",
    estimateNumber: "",
    referenceNumber: "",
    dueDate: "",
    customerName: "",
    billingAddress: "",
    shippingAddress: "",
    customerGSTIN: "",
    placeOfSupply: "",
    items: [emptyItem],
  });

  const [savedEstimate, setSavedEstimate] = useState(null);

  // Add / Remove items
  const addItem = () =>
    setFormData((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));

  const removeItem = (index) => {
    setFormData((prev) => {
      if (prev.items.length === 1) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  // Handle main form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item field change
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index][name] =
        ["quantity", "rate", "discount"].includes(name)
          ? parseFloat(value) || 0
          : value;
      return { ...prev, items: updatedItems };
    });
  };

  // Calculate totals
  const getTotals = () =>
    formData.items.reduce(
      (acc, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        const discount = parseFloat(item.discount) || 0;

        const inclusiveTotal = qty * rate - discount;
        const taxable = inclusiveTotal / 1.18;
        const cgst = taxable * 0.09;
        const sgst = taxable * 0.09;

        acc.totalTaxable += taxable;
        acc.totalCGST += cgst;
        acc.totalSGST += sgst;
        acc.total += taxable + cgst + sgst;
        return acc;
      },
      { totalTaxable: 0, totalCGST: 0, totalSGST: 0, total: 0 }
    );

  const { totalTaxable, totalCGST, totalSGST, total } = getTotals();

  // Save & show print view
  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedEstimate({ ...formData, totalTaxable, totalCGST, totalSGST, total });
  };

  if (savedEstimate) {
    // === PRINT VIEW (from AllInvoices) ===
    return (
      <div className="p-6 text-sm text-gray-800 font-sans max-w-4xl mx-auto bg-white">
        <div className="flex justify-between items-center mb-4">
          <img src={logoImage} alt="Company Logo" className="max-w-[100px]" />
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print
          </button>
        </div>

        <h2 className="text-center text-2xl font-bold text-red-600 mb-4">ESTIMATE</h2>

        {/* Company Info */}
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-red-600">
              Newtonsky5 Technology Pvt Ltd
            </h3>
            <p>
              NO:126, 1ST FLOOR, BAJANAI KOIL STREET, VALLAM,<br />
              Chengalpattu, Tamil Nadu 603002<br />
              9894154436 | info@newtonsky5.com
            </p>
          </div>
          <table>
            <tbody>
              <tr><td className="font-semibold">GSTIN</td><td>33AAHCN7836R1ZO</td></tr>
              <tr><td className="font-semibold">State</td><td>33-Tamil Nadu</td></tr>
              <tr><td className="font-semibold">PAN</td><td>AAHCN7836R</td></tr>
              <tr><td className="font-semibold">CIN</td><td>U51505TN2021PTC145911</td></tr>
            </tbody>
          </table>
        </div>

        {/* Estimate Details */}
        <div className="grid grid-cols-2 mb-4">
          <p><strong>Estimate Date:</strong> {savedEstimate.estimateDate}</p>
          <p><strong>Estimate No:</strong> {savedEstimate.estimateNumber}</p>
          <p><strong>Reference No:</strong> {savedEstimate.referenceNumber || '-'}</p>
          <p><strong>Due Date:</strong> {savedEstimate.dueDate}</p>
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

        {/* Items */}
        <table className="w-full border border-black text-center text-xs mb-4">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border p-1">Item</th>
              <th className="border p-1">HSN/SAC</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Discount</th>
              <th className="border p-1">Taxable</th>
              <th className="border p-1">CGST</th>
              <th className="border p-1">SGST</th>
              <th className="border p-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {savedEstimate.items.map((item, i) => {
              const qty = parseFloat(item.quantity) || 0;
              const rate = parseFloat(item.rate) || 0;
              const discount = parseFloat(item.discount) || 0;
              const inclusiveTotal = qty * rate - discount;
              const taxable = inclusiveTotal / 1.18;
              const cgst = taxable * 0.09;
              const sgst = taxable * 0.09;
              const total = taxable + cgst + sgst;

              return (
                <tr key={i}>
                  <td className="border p-1 text-left">{item.name}</td>
                  <td className="border p-1">{item.hsn}</td>
                  <td className="border p-1">{qty}</td>
                  <td className="border p-1">{rate.toFixed(2)}</td>
                  <td className="border p-1">{discount.toFixed(2)}</td>
                  <td className="border p-1">{taxable.toFixed(2)}</td>
                  <td className="border p-1">{cgst.toFixed(2)}</td>
                  <td className="border p-1">{sgst.toFixed(2)}</td>
                  <td className="border p-1">{total.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr className="font-semibold">
              <td className="border p-1" colSpan={5}>Total</td>
              <td className="border p-1">{savedEstimate.totalTaxable.toFixed(2)}</td>
              <td className="border p-1">{savedEstimate.totalCGST.toFixed(2)}</td>
              <td className="border p-1">{savedEstimate.totalSGST.toFixed(2)}</td>
              <td className="border p-1">{savedEstimate.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
              {/* Summary Table */}
      <div className="flex justify-end mb-4 text-sm">
        <table>
          <tbody>
            <tr>
              <td className="pr-4">Taxable Amount =</td>
              <td className="text-right">9500.00</td>
            </tr>
            <tr>
              <td className="pr-4">Total Tax =</td>
              <td className="text-right">1710.00</td>
            </tr>
            <tr>
              <td className="pr-4 font-semibold">Total Value =</td>
              <td className="text-right font-semibold">11210.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total in Words */}
      <div className="italic font-semibold text-xs -mt-8 mb-4">
        Total amount (in words): Eleven Thousand Two Hundred Ten Rupees Only
      </div>

      {/* Bank Details */}
      <div className="border border-black p-4 mb-4 w-1/2 text-sm font-semibold -mt-6">
        <div className="mb-1">Bank Details:</div>
        Account Number: 10140870796 | IFSC: IDFB0080911<br />
        Bank Name: IDFC BANK | Branch Name: MAHINDRA WORLD CITY, PARANUR
      </div>

      {/* Notes */}
      <div className="text-sm mb-2">
        <strong>Notes:</strong><br />
        Before taking the product, you must check here and take it. You are not allowed to send a return
      </div>

      {/* Terms & Conditions */}
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
        For Newtonsky5 Technology Pvt Ltd<br /><br />
        _______<br />
        Authorised Signatory
        <p className="text-[9px] text-gray-600 mt-1">*computerized signatory</p>
      </div>  
      </div>
    );
  }

  // === ENTRY FORM ===
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Create Estimate</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Estimate Date", name: "estimateDate", type: "date" },
              { label: "Estimate No", name: "estimateNumber", type: "text" },
              { label: "Reference No", name: "referenceNumber", type: "text" },
              { label: "Due Date", name: "dueDate", type: "date" },
              { label: "Customer Name", name: "customerName", type: "text" },
              { label: "Customer GSTIN", name: "customerGSTIN", type: "text" },
              { label: "Place of Supply", name: "placeOfSupply", type: "text" },
              { label: "Billing Address", name: "billingAddress", type: "text" },
              { label: "Shipping Address", name: "shippingAddress", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required={name !== "referenceNumber"}
                />
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Items</h2>
            {formData.items.map((item, index) => {
              const qty = parseFloat(item.quantity) || 0;
              const rate = parseFloat(item.rate) || 0;
              const discount = parseFloat(item.discount) || 0;
              const inclusiveTotal = qty * rate - discount;

              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-gray-50 p-4 rounded-md border items-end mb-3">
                  <input name="name" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, e)} className="border px-3 py-2 rounded-md md:col-span-2" required />
                  <input name="hsn" placeholder="HSN/SAC" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className="border px-3 py-2 rounded-md" />
                  <input name="quantity" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="border px-3 py-2 rounded-md" required />
                  <input name="rate" type="number" placeholder="Rate (Incl. GST)" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="border px-3 py-2 rounded-md" required />
                  <input name="discount" type="number" placeholder="Discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} className="border px-3 py-2 rounded-md" />
                  <div className="flex items-center">{inclusiveTotal.toFixed(2)}</div>
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 font-bold">✕</button>
                </div>
              );
            })}
            <button type="button" onClick={addItem} className="border border-green-600 text-green-600 px-4 py-2 rounded-md mt-2">+ Add Item</button>
          </div>

          {/* Totals */}
          <div className="bg-gray-100 p-6 rounded-md border">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Taxable Amount</span><span>₹{totalTaxable.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>CGST @9%</span><span>₹{totalCGST.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>SGST @9%</span><span>₹{totalSGST.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>

          

          <div className="text-right">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold">
              Save & Print View
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};
export default CreateInvoice;
