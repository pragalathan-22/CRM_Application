import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Repeat,
  Activity,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import dayjs from 'dayjs';

const KPIs = () => {
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

  const totalLeads = leads.length || 1; // Avoid division by zero
  const completedLeads = leads.filter((l) => l.status === 'Completed');
  const canceledLeads = leads.filter((l) => l.status === 'Canceled');
  const conversionRate = ((completedLeads.length / totalLeads) * 100).toFixed(1);
  const churnRate = ((canceledLeads.length / totalLeads) * 100).toFixed(1);

  const monthlyRevenue = completedLeads
    .filter((l) => dayjs(l.createdAt).isSame(dayjs(), 'month'))
    .reduce((sum, l) => sum + Number(l.value || 0), 0)
    .toLocaleString();

  const avgCLTV = (
    completedLeads.reduce((sum, l) => sum + Number(l.value || 0), 0) /
    (completedLeads.length || 1)
  ).toFixed(0);

  const dummyRetention = '89%';
  const dummyCAC = '$240';

  const kpis = [
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: 'Leads to Customers',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      trend: 'up',
    },
    {
      label: 'Retention Rate',
      value: dummyRetention,
      description: 'Returning Customers',
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: <Repeat className="w-6 h-6 text-green-600" />,
      trend: 'up',
    },
    {
      label: 'Monthly Revenue',
      value: `$${monthlyRevenue}`,
      description: 'MRR (Completed Deals)',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
      trend: 'up',
    },
    {
      label: 'Churn Rate',
      value: `${churnRate}%`,
      description: 'Canceled Leads',
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: <UserMinus className="w-6 h-6 text-red-600" />,
      trend: 'down',
    },
    {
      label: 'CLTV',
      value: `$${avgCLTV}`,
      description: 'Customer Lifetime Value',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      trend: 'up',
    },
    {
      label: 'CAC',
      value: dummyCAC,
      description: 'Customer Acquisition Cost',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: <UserPlus className="w-6 h-6 text-purple-600" />,
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">CRM KPI Dashboard</h1>
        <p className="text-gray-500 mt-1">Track core CRM performance metrics in real time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer ${kpi.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 font-medium">{kpi.label}</div>
              {kpi.icon}
            </div>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIs;
