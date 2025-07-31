import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
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

const Overview = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/leads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const today = dayjs();
  const fiveDaysAgo = today.subtract(4, 'day').startOf('day');

  const newLeads = leads.filter(
    (lead) =>
      lead.status === 'New' &&
      dayjs(lead.createdAt).isAfter(fiveDaysAgo)
  ).length;

  const dealsConverted = leads.filter((lead) => lead.status === 'Completed').length;
  const dealsDropped = leads.filter((lead) => lead.status === 'Canceled').length;
  const totalLeads = leads.length;

  const totalRevenue = leads
    .filter((lead) => lead.status === 'Completed')
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

  const cards = [
    { title: 'Total Leads', value: totalLeads, color: 'text-gray-600', bg: 'bg-gray-100' },
    { title: 'New Leads (Last 5 Days)', value: newLeads, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Deals Converted', value: dealsConverted, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Deals Dropped', value: dealsDropped, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueByMonth = leads.reduce((acc, lead) => {
    if (!lead.createdAt || lead.status !== 'Completed' || !lead.value) return acc;
    const month = dayjs(lead.createdAt).format('MMM');
    acc[month] = (acc[month] || 0) + Number(lead.value);
    return acc;
  }, {});

  const dynamicRevenueData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: monthLabels.map((month) => revenueByMonth[month] || 0),
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
        grid: { color: '#f3f4f6' },
      },
      x: {
        ticks: { color: '#6b7280', font: { size: 13 } },
        grid: { display: false },
      },
    },
  };

  const leadConversionData = {
    labels: ['Converted', 'Pending', 'Dropped'],
    datasets: [
      {
        label: 'Lead Conversion',
        data: [
          leads.filter((l) => l.status === 'Completed').length,
          leads.filter((l) => ['New', 'Processing', 'Delay'].includes(l.status)).length,
          leads.filter((l) => l.status === 'Canceled').length,
        ],
        backgroundColor: ['#10b981', '#facc15', '#ef4444'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`rounded-2xl p-5 shadow ${card.bg}`}>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow h-[340px]">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
          <Bar data={dynamicRevenueData} options={revenueOptions} height={260} />
        </div>

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
                      color: '#374151',
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
          {leads.slice(0, 3).map((lead, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="text-gray-700">👤 New lead added: {lead.contact}</span>
              <span className="text-sm text-gray-500">Just now</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
