// src/pages/Dashboard/Overview.jsx
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Stat cards
const cards = [
  { title: 'New Leads', value: 134, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Deals Closed', value: 48, color: 'text-green-600', bg: 'bg-green-50' },
  { title: 'Revenue', value: '$24,300', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Tasks Due', value: 19, color: 'text-red-600', bg: 'bg-red-50' },
];

// Revenue Bar Chart (updated growth trend)
const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [4200, 5800, 7300, 8700, 9800, 11200],
      backgroundColor: '#4f46e5',
      borderRadius: 6,
      barThickness: 30,
    },
  ],
};

const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`,
        color: '#6b7280',
        font: { size: 13 },
      },
      grid: {
        color: '#f3f4f6',
      },
    },
    x: {
      ticks: {
        color: '#6b7280',
        font: { size: 13 },
      },
      grid: {
        display: false,
      },
    },
  },
};

// Lead Conversion Doughnut Chart
const leadConversionData = {
  labels: ['Converted', 'Pending', 'Lost'],
  datasets: [
    {
      label: 'Lead Conversion',
      data: [60, 25, 15],
      backgroundColor: ['#10b981', '#facc15', '#ef4444'],
      borderWidth: 2,
    },
  ],
};

const Overview = () => {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`rounded-2xl p-5 shadow ${card.bg}`}>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded-xl shadow h-[340px]">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
          <Bar data={revenueData} options={revenueOptions} height={260} />
        </div>

        {/* Lead Conversion */}
{/* Lead Conversion */}
<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">Lead Conversion</h2>
  <div className="relative h-[260px]">
    <Doughnut
      data={leadConversionData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#374151', // gray-700
              font: { size: 14 },
            },
          },
        },
      }}
    />
  </div>
</div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between">
            <span className="text-gray-700">👤 New lead added: John Doe</span>
            <span className="text-sm text-gray-500">Today</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-gray-700">📞 Call scheduled with "ABC Corp"</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-gray-700">✅ Deal closed with "XYZ Ltd."</span>
            <span className="text-sm text-gray-500">Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Overview;
