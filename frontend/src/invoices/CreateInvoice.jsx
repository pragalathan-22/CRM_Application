import React, { useState } from 'react';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    estimateDate: '',
    estimateNumber: '',
    referenceNumber: '',
    dueDate: '',
    customerName: '',
    billingAddress: '',
    shippingAddress: '',
    customerGSTIN: '',
    placeOfSupply: '',
    items: [
      { name: '', hsn: '', quantity: 1, rate: 0, discount: 0 },
    ],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', hsn: '', quantity: 1, rate: 0, discount: 0 }],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...formData.items];
    updatedItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: updatedItems });
  };

  const getTotals = () => {
    let totalTaxable = 0;
    let totalCGST = 0;
    let totalSGST = 0;

    formData.items.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;

      const inclusiveTotal = rate * qty - discount;
      const taxable = inclusiveTotal / 1.18;
      const cgst = taxable * 0.09;
      const sgst = taxable * 0.09;

      totalTaxable += taxable;
      totalCGST += cgst;
      totalSGST += sgst;
    });

    const total = totalTaxable + totalCGST + totalSGST;
    return { totalTaxable, totalCGST, totalSGST, total };
  };

  const { totalTaxable, totalCGST, totalSGST, total } = getTotals();

const handleSubmit = async (e) => {
  e.preventDefault();

  const totals = getTotals();
  const payload = {
    ...formData,
    ...totals,
  };

  try {
    const response = await fetch('http://localhost:3000/api/estimates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save estimate');
    }

    const data = await response.json();
    alert('✅ Estimate saved successfully!');
    console.log(data);

    // Optional: Clear form after successful submission
    setFormData({
      estimateDate: '',
      estimateNumber: '',
      referenceNumber: '',
      dueDate: '',
      customerName: '',
      billingAddress: '',
      shippingAddress: '',
      customerGSTIN: '',
      placeOfSupply: '',
      items: [{ name: '', hsn: '', quantity: 1, rate: 0, discount: 0 }],
    });
  } catch (error) {
    console.error('❌ Error saving estimate:', error.message);
    alert('❌ Failed to save estimate. Please try again.');
  }
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Create Estimate</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Estimate Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    name={name}
                    type={type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required={name !== 'referenceNumber'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Items</h2>
            <div className="space-y-6">
              {formData.items.map((item, index) => {
                const qty = parseFloat(item.quantity) || 0;
                const rate = parseFloat(item.rate) || 0;
                const discount = parseFloat(item.discount) || 0;
                const inclusiveTotal = qty * rate - discount;
                const taxable = inclusiveTotal / 1.18;
                const cgst = taxable * 0.09;
                const sgst = taxable * 0.09;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded-md border"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <input name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} className="w-full border px-3 py-2 rounded-md" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HSN/SAC</label>
                      <input name="hsn" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className="w-full border px-3 py-2 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                      <input name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="w-full border px-3 py-2 rounded-md" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate (Incl. GST)</label>
                      <input name="rate" type="number" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full border px-3 py-2 rounded-md" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                      <input name="discount" type="number" value={item.discount} onChange={(e) => handleItemChange(index, e)} className="w-full border px-3 py-2 rounded-md" />
                    </div>
                    <div className="text-sm text-gray-700 flex flex-col justify-end">
                      <span>Total: ₹{inclusiveTotal.toFixed(2)}</span>
                      <span className="text-gray-500">Base: ₹{taxable.toFixed(2)}</span>
                      <span className="text-gray-500">CGST: ₹{cgst.toFixed(2)}</span>
                      <span className="text-gray-500">SGST: ₹{sgst.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-100 p-6 rounded-md border">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span>₹{totalTaxable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST @9%</span>
                <span>₹{totalCGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST @9%</span>
                <span>₹{totalSGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Create Estimate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
