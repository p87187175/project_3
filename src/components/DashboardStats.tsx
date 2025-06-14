import React from 'react';
import { 
  Wrench, 
  Activity, 
  AlertTriangle, 
  Power, 
  FileText, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function DashboardStats() {
  const { dashboardStats } = useData();

  const stats = [
    {
      title: 'Total Machines',
      value: dashboardStats.totalMachines,
      icon: Wrench,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Machines',
      value: dashboardStats.activeMachines,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Under Maintenance',
      value: dashboardStats.maintenanceMachines,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Offline Machines',
      value: dashboardStats.offlineMachines,
      icon: Power,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Open Complaints',
      value: dashboardStats.openComplaints,
      icon: FileText,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Escalated Issues',
      value: dashboardStats.escalatedComplaints,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Resolved Today',
      value: dashboardStats.resolvedToday,
      icon: CheckCircle,
      color: 'bg-teal-500',
      textColor: 'text-teal-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} rounded-lg p-2`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}