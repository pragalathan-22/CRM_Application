import React, { useState } from "react";
import logoImage from "../../assets/WhatsApp Image 2025-08-19 at 2.29.11 PM.jpeg";

const CreateInvoice = () => {
  const emptyItem = { name: "", hsn: "", quantity: "", rate: "", discount: "" };
  const [formData, setFormData] = useState({
    estimateDate: "", estimateNumber: "", referenceNumber: "",
    dueDate: "", customerName: "", billingAddress: "",
    shippingAddress: "", customerGSTIN: "", placeOfSupply: "",
    items: [emptyItem]
  });
  const [savedEstimate, setSavedEstimate] = useState(null);

  // ===== Helpers =====
  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleItemChange = (i, e) => {
    const { name, value } = e.target;
    setFormData(p => {
      const items = [...p.items];
      items[i][name] = ["quantity", "rate", "discount"].includes(name) ? parseFloat(value) || 0 : value;
      return { ...p, items };
    });
  };
  const addItem = () => setFormData(p => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  const removeItem = i => setFormData(p => p.items.length > 1 ? { ...p, items: p.items.filter((_, idx) => idx !== i) } : p);
  
  const getTotals = () => formData.items.reduce((acc, { quantity, rate, discount }) => {
    const qty = +quantity || 0, r = +rate || 0, disc = +discount || 0;
    const incl = qty * r - disc, taxable = incl / 1.18, cgst = taxable * 0.09, sgst = taxable * 0.09;
    acc.totalTaxable += taxable; acc.totalCGST += cgst; acc.totalSGST += sgst; acc.total += taxable + cgst + sgst;
    return acc;
  }, { totalTaxable: 0, totalCGST: 0, totalSGST: 0, total: 0 });

  const { totalTaxable, totalCGST, totalSGST, total } = getTotals();
const handleSubmit = async (e) => {
  e.preventDefault();

  const totals = { totalTaxable, totalCGST, totalSGST, total };
  const invoiceData = { ...formData, ...totals };

  try {
    const res = await fetch("http://localhost:3000/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to save invoice: ${errorText}`);
    }

    const savedInvoice = await res.json();
    console.log("✅ Invoice saved:", savedInvoice);

    // Use the saved invoice from DB so it includes _id & createdAt
    setSavedEstimate(savedInvoice);

  } catch (err) {
    console.error("❌ Error saving invoice:", err);
  }
};

// Utility to convert numbers into words (Indian Rupee style)
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
    "Seventy", "Eighty", "Ninety"
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + inWords(n % 100000) : "")
      );
    return (
      inWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + inWords(n % 10000000) : "")
    );
  };

  if (num === 0) return "Zero";
  return inWords(num).trim();
}



  // ===== Print View =====
  if (savedEstimate) return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "20mm", background: "#fff", margin: "0 auto", boxShadow: "0 0 5px rgba(0,0,0,0.1)", color: "black" }}>
      <div id="printArea" className="p-6 text-sm text-gray-800 font-sans max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-4"><img src={logoImage} alt="Company Logo" className="max-w-[50px]" /></div>
        {/* Print Button */}
        <div className="flex justify-end mb-4 no-print">
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Print</button>
        </div>
        <h2 className="text-center text-2xl font-bold text-red-600 mb-4">ESTIMATE</h2>

        {/* Company Info */}
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-red-600">Newtonsky5 Technology Pvt Ltd</h3>
            <p>NO:126, 1ST FLOOR, BAJANAI KOIL STREET, VALLAM,<br />Chengalpattu, Tamil Nadu 603002<br />9894154436 | info@newtonsky5.com</p>
          </div>
          <table><tbody>
            <tr><td className="font-semibold">GSTIN</td><td>33AAHCN7836R1ZO</td></tr>
            <tr><td className="font-semibold">State</td><td>33-Tamil Nadu</td></tr>
            <tr><td className="font-semibold">PAN</td><td>AAHCN7836R</td></tr>
            <tr><td className="font-semibold">CIN</td><td>U51505TN2021PTC145911</td></tr>
          </tbody></table>
        </div>

        {/* Estimate Details */}
        <div className="grid grid-cols-2 mb-4">
          {[
            ["Estimate Date", savedEstimate.estimateDate],
            ["Estimate No", savedEstimate.estimateNumber],
            ["Reference No", savedEstimate.referenceNumber || "-"],
            ["Due Date", savedEstimate.dueDate]
          ].map(([label, val], i) => <p key={i}><strong>{label}:</strong> {val}</p>)}
        </div>

        {/* Customer Info */}
        <table className="w-full border border-black mb-3">
          <thead className="bg-yellow-100"><tr>
            <th className="border p-2 text-left">Customer Name</th>
            <th className="border p-2 text-left">Billing Address</th>
            <th className="border p-2 text-left">Shipping Address</th>
          </tr></thead>
          <tbody><tr>
            <td className="border p-2">{savedEstimate.customerName}</td>
            <td className="border p-2">{savedEstimate.billingAddress}</td>
            <td className="border p-2">{savedEstimate.shippingAddress}</td>
          </tr></tbody>
        </table>

        {/* GST Info */}
        <table className="w-full border border-black mb-3">
          <thead className="bg-yellow-100"><tr>
            <th className="border p-2">Customer GSTIN</th>
            <th className="border p-2">Place of Supply</th>
            <th className="border p-2">Due Date</th>
          </tr></thead>
          <tbody><tr>
            <td className="border p-2">{savedEstimate.customerGSTIN}</td>
            <td className="border p-2">{savedEstimate.placeOfSupply}</td>
            <td className="border p-2">{savedEstimate.dueDate}</td>
          </tr></tbody>
        </table>

        {/* Items Table */}
        <table className="w-full border border-black text-center text-xs mb-4">
          <thead className="bg-yellow-100"><tr>
            {["Item","HSN/SAC","Qty","Rate","Discount","CGST%","SGST%","Taxable","Total"].map((h,i) => <th key={i} className="border p-1">{h}</th>)}
          </tr></thead>
          <tbody>
            {savedEstimate.items.map((it, i) => {
              const qty = +it.quantity || 0, rate = +it.rate || 0, disc = +it.discount || 0;
              const incl = qty * rate - disc, taxable = incl / 1.18, cgst = taxable * 0.09, sgst = taxable * 0.09, t = taxable + cgst + sgst;
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
              <td className="border p-1" colSpan={5}>Total</td>
              <td className="border p-1">{totalCGST.toFixed(2)}</td>
              <td className="border p-1">{totalSGST.toFixed(2)}</td>
              <td className="border p-1">{totalTaxable.toFixed(2)}</td>
              <td className="border p-1">{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-4 text-sm">
          <table><tbody>
            <tr><td className="pr-4">Taxable Amount =</td><td>{totalTaxable.toFixed(2)}</td></tr>
            <tr><td className="pr-4">Total Tax (GST) =</td><td>{(totalCGST + totalSGST).toFixed(2)}</td></tr>
            <tr><td className="pr-4 font-semibold">Total Value =</td><td className="font-semibold">{total.toFixed(2)}</td></tr>
          </tbody></table>
        </div>

        {/* Total in Words */}
<div className="border-black px-3 py-2 mb-4 text-sm font-bold italic">
  Total amount (in words): {numberToWords(Math.round(total))} Rupees Only
</div>


        {/* Bank Details */}
        <div className="border border-black p-4 mb-4 w-1/2 text-sm font-semibold">
          <div className="mb-1 font-bold underline">Bank Details:</div>
          Account Number: 10140870796 | IFSC: IDFB0080911<br />
          Bank Name: IDFC BANK | Branch Name: MAHINDRA WORLD CITY, PARANUR
        </div>

        {/* Notes */}
        <div className="text-sm mb-2"><strong>Notes:</strong><br />Before taking the product, you must check here and take it. You are not allowed to send a return</div>

        {/* Terms */}
        <div className="text-sm mb-4"><strong>Terms & Conditions:</strong>
          <ul className="list-disc ml-6 mt-1">
            <li>2 year Warranty</li><li>75% advance before starting work</li>
            <li>25% payment before delivery</li><li>Shipping and Installation charges extra.</li>
          </ul>
        </div>

        {/* Signature */}
        <div className="text-right text-sm -mt-4">
          For Newtonsky5 Technology Pvt Ltd<br /><br />_______<br />Authorised Signatory
          <p className="text-[9px] text-gray-600 mt-1">*computerized signatory</p>
        </div>
      </div>
    </div>
  );

  // ===== Entry Form =====
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-8">Create Estimate</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Estimate Date","estimateDate","date"],["Estimate No","estimateNumber","text"],
              ["Reference No","referenceNumber","text"],["Due Date","dueDate","date"],
              ["Customer Name","customerName","text"],["Customer GSTIN","customerGSTIN","text"],
              ["Place of Supply","placeOfSupply","text"],["Billing Address","billingAddress","text"],
              ["Shipping Address","shippingAddress","text"]
            ].map(([label, name, type]) => (
              <div key={name}>
                <label className="block text-sm font-medium">{label}</label>
                <input name={name} type={type} value={formData[name]} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required={name!=="referenceNumber"} />
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Items</h2>
            {formData.items.map((it, i) => {
              const incl = (+it.quantity || 0) * (+it.rate || 0) - (+it.discount || 0);
              return (
                <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-gray-50 p-4 rounded-md border items-end mb-3">
                  <input name="name" placeholder="Item Name" value={it.name} onChange={e=>handleItemChange(i,e)} className="border px-3 py-2 rounded-md md:col-span-2" required />
                  <input name="hsn" placeholder="HSN/SAC" value={it.hsn} onChange={e=>handleItemChange(i,e)} className="border px-3 py-2 rounded-md" />
                  <input name="quantity" type="number" placeholder="Qty" value={it.quantity} onChange={e=>handleItemChange(i,e)} className="border px-3 py-2 rounded-md" required />
                  <input name="rate" type="number" placeholder="Rate (Incl. GST)" value={it.rate} onChange={e=>handleItemChange(i,e)} className="border px-3 py-2 rounded-md" required />
                  <input name="discount" type="number" placeholder="Discount" value={it.discount} onChange={e=>handleItemChange(i,e)} className="border px-3 py-2 rounded-md" />
                  <div className="flex items-center">{incl.toFixed(2)}</div>
                  <button type="button" onClick={() => removeItem(i)} className="text-red-500 font-bold">✕</button>
                </div>
              );
            })}
            <button type="button" onClick={addItem} className="border border-green-600 text-green-600 px-4 py-2 rounded-md mt-2">+ Add Item</button>
          </div>

          {/* Totals */}
          <div className="bg-gray-100 p-6 rounded-md border">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            {[
              ["Taxable Amount", totalTaxable], ["CGST @9%", totalCGST],
              ["SGST @9%", totalSGST], ["Total", total]
            ].map(([label, val], i) => (
              <div key={i} className={`flex justify-between${label==="Total" ? " font-bold" : ""}`}>
                <span>{label}</span><span>₹{val.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="text-right">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold">Save & Print View</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
