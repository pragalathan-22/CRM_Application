import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  TrendingDown,
  Repeat,
  Activity,
  UserMinus,
  UserPlus,
  Target,
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // 🔹 Base calculations
  const totalLeads = leads.length || 1;
  const completedLeads = leads.filter((l) => l.status === 'Completed');
  const canceledLeads = leads.filter((l) => l.status === 'Canceled');
  const activeLeads = leads.filter((l) =>
    ['New', 'Processing', 'Delay'].includes(l.status)
  );

  // 🔹 Conversion Rate
  const conversionRate = ((completedLeads.length / totalLeads) * 100).toFixed(1);

  // 🔹 Churn Rate
  const churnRate = ((canceledLeads.length / totalLeads) * 100).toFixed(1);

  // 🔹 Leads Added This Month
  const monthlyLeads = leads.filter((l) =>
    dayjs(l.createdAt).isSame(dayjs(), 'month')
  ).length;

  // 🔹 Average Deal Size
  const avgDealSize = (
    completedLeads.reduce((sum, l) => sum + Number(l.value || 0), 0) /
    (completedLeads.length || 1)
  ).toFixed(0);

  // 🔹 Retention Rate
  const retentionRate = (
    ((totalLeads - canceledLeads.length) / totalLeads) *
    100
  ).toFixed(1);

  // 🔹 Avg Time to Close
  const avgCloseTime = (
    completedLeads.reduce((sum, l) => {
      if (l.createdAt && l.updatedAt) {
        const diff = dayjs(l.updatedAt).diff(dayjs(l.createdAt), 'day');
        return sum + diff;
      }
      return sum;
    }, 0) / (completedLeads.length || 1)
  ).toFixed(1);

  // 🔹 KPI Cards
  const kpis = [
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: 'Leads converted to customers',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      trend: conversionRate >= 50 ? 'up' : 'down',
    },
    {
      label: 'Retention Rate',
      value: `${retentionRate}%`,
      description: 'Active vs canceled leads',
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: <Repeat className="w-6 h-6 text-green-600" />,
      trend: retentionRate >= 70 ? 'up' : 'down',
    },
    {
      label: 'New Leads This Month',
      value: monthlyLeads,
      description: 'Leads created in current month',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      trend: monthlyLeads > 0 ? 'up' : 'down',
    },
    {
      label: 'Churn Rate',
      value: `${churnRate}%`,
      description: 'Leads that were canceled',
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: <UserMinus className="w-6 h-6 text-red-600" />,
      trend: churnRate < 30 ? 'up' : 'down',
    },
    {
      label: 'Avg Deal Size',
      value: avgDealSize,
      description: 'Average value per closed deal',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: <UserPlus className="w-6 h-6 text-yellow-600" />,
      trend: avgDealSize > 500 ? 'up' : 'down',
    },
    {
      label: 'Win Rate',
      value: `${(
        (completedLeads.length /
          (completedLeads.length + canceledLeads.length || 1)) *
        100
      ).toFixed(1)}%`,
      description: 'Percentage of closed deals won',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: <Target className="w-6 h-6 text-purple-600" />,
      trend:
        completedLeads.length >= canceledLeads.length ? 'up' : 'down',
    },
    // {
    //   label: 'Avg Close Time',
    //   value: `${avgCloseTime} days`,
    //   description: 'Time taken to close deals',
    //   color: 'text-pink-600',
    //   bg: 'bg-pink-50',
    //   icon: <Activity className="w-6 h-6 text-pink-600" />,
    //   trend: avgCloseTime <= 15 ? 'up' : 'down',
    // },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          📊 CRM KPI Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Real-time insights to track and measure your sales performance.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-gray-50 cursor-pointer"
          >
            {/* Title + Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">
                {kpi.label}
              </div>
              <div className={`p-2 rounded-xl ${kpi.bg}`}>{kpi.icon}</div>
            </div>

            {/* Value + Trend */}
            <div className="flex items-center justify-between mb-1">
              <p className={`text-3xl font-bold ${kpi.color}`}>
                {kpi.value}
              </p>
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIs;
