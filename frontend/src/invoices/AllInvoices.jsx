import React from "react";
import logoImage from '../assets/react.svg'; // Correct import from src/assets

const AllInvoices = () => {
  return (
    <div className="p-6 text-sm text-gray-800 font-sans max-w-4xl mx-auto bg-white">
      {/* Logo */}
      <div className="text-center mb-2">
        <img src={logoImage} alt="Company Logo" className="w-16 mx-auto" />
      </div>

      {/* Header */}
      <h2 className="text-center text-2xl font-bold text-red-600 mb-4">ESTIMATE</h2>

      {/* Company and Tax Info */}
      <div className="flex justify-between mb-4">
        <div className="w-2/3">
          <h3 className="text-lg font-bold text-red-600">Newtonsky5 Technology Pvt Ltd</h3>
          <p>
            NO:126, 1ST FLOOR, BAJANAI KOIL STREET, VALLAM,<br />
            Chengalpattu, Tamil Nadu 603002<br />
            9894154436 | info@newtonsky5.com
          </p>
        </div>
        <div className="w-1/3 text-sm">
          <table className="w-full">
            <tbody>
              <tr><td className="font-semibold">GSTIN</td><td>33AAHCN7836R1ZO</td></tr>
              <tr><td className="font-semibold">State</td><td>33-Tamil Nadu</td></tr>
              <tr><td className="font-semibold">PAN</td><td>AAHCN7836R</td></tr>
              <tr><td className="font-semibold">CIN</td><td>U51505TN2021PTC145911</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Details */}
      <div className="grid grid-cols-2 text-sm mb-4">
        <p><strong>Estimate Date:</strong> 07/08/2025</p>
        <p><strong>Estimate No:</strong> NSE25-001</p>
        <p><strong>Reference No:</strong> -</p>
        <p><strong>Due Date:</strong> 22/08/2025</p>
      </div>

      {/* Customer Info */}
      <table className="w-full border border-black border-collapse mb-3">
        <thead>
          <tr className="bg-yellow-100">
            <th className="border border-black p-2 text-left">Customer Name</th>
            <th className="border border-black p-2 text-left">Billing Address</th>
            <th className="border border-black p-2 text-left">Shipping Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">John Doe</td>
            <td className="border border-black p-2">123 Example Street, Chennai</td>
            <td className="border border-black p-2">456 Delivery Street, Chennai</td>
          </tr>
        </tbody>
      </table>

      {/* GST & Supply Info */}
      <table className="w-full border border-black border-collapse mb-3">
        <thead>
          <tr className="bg-yellow-100">
            <th className="border border-black p-2 text-left">Customer GSTIN</th>
            <th className="border border-black p-2 text-left">Place of Supply</th>
            <th className="border border-black p-2 text-left">Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">33AAHCN7836R1ZO</td>
            <td className="border border-black p-2">33-Tamil Nadu</td>
            <td className="border border-black p-2">22/08/2025</td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table className="w-full border border-black border-collapse mb-4 text-center text-xs">
        <thead className="bg-yellow-100">
          <tr>
            <th className="border border-black p-1">Item</th>
            <th className="border border-black p-1">HSN/SAC</th>
            <th className="border border-black p-1">Quantity</th>
            <th className="border border-black p-1">Rate/Item</th>
            <th className="border border-black p-1">Discount</th>
            <th className="border border-black p-1">Taxable Value</th>
            <th className="border border-black p-1">CGST @9%</th>
            <th className="border border-black p-1">SGST @9%</th>
            <th className="border border-black p-1">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-1 text-left">Mobile Charging Station</td>
            <td className="border border-black p-1">-</td>
            <td className="border border-black p-1">1</td>
            <td className="border border-black p-1">10000.00</td>
            <td className="border border-black p-1">500.00</td>
            <td className="border border-black p-1">9500.00</td>
            <td className="border border-black p-1">855.00</td>
            <td className="border border-black p-1">855.00</td>
            <td className="border border-black p-1">11210.00</td>
          </tr>
          <tr className="font-semibold">
            <td className="border border-black p-1 text-center" colSpan={5}>Total</td>
            <td className="border border-black p-1">9500.00</td>
            <td className="border border-black p-1">855.00</td>
            <td className="border border-black p-1">855.00</td>
            <td className="border border-black p-1">11210.00</td>
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
};

export default AllInvoices;
