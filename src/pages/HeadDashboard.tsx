import React, { useState } from 'react';
import { BarChart3, Users, Settings, TrendingUp, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DashboardStats from '../components/DashboardStats';
import MachineCard from '../components/MachineCard';
import ComplaintCard from '../components/ComplaintCard';
import QRCodeGenerator from '../components/QRCodeGenerator';

export default function HeadDashboard() {
  const { machines, complaints } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'machines' | 'complaints' | 'analytics'>('overview');
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const escalatedComplaints = complaints.filter(c => c.escalation_level > 0).length;
  const avgResolutionTime = '4.2 hours'; // Mock data

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Head Dashboard</h1>
          <p className="text-gray-600">Complete system oversight and analytics</p>
        </div>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'System Overview', icon: BarChart3 },
              { id: 'machines', label: 'All Machines', icon: Settings, count: machines.length },
              { id: 'complaints', label: 'All Complaints', icon: Eye, count: totalComplaints },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Total Complaints</h4>
                    <BarChart3 className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{totalComplaints}</div>
                  <p className="text-blue-100 text-sm">All time complaints</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Resolved</h4>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{resolvedComplaints}</div>
                  <p className="text-green-100 text-sm">Successfully resolved</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Escalated</h4>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{escalatedComplaints}</div>
                  <p className="text-red-100 text-sm">Required escalation</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Avg Resolution</h4>
                    <Users className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{avgResolutionTime}</div>
                  <p className="text-purple-100 text-sm">Average time to resolve</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Complaints</h4>
                  <div className="space-y-3">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div key={complaint.id} className="bg-white rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Machine {complaint.machine_id}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            complaint.status === 'resolved' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-gray-600 truncate">{complaint.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Machine Health Summary</h4>
                  <div className="space-y-3">
                    {machines.slice(0, 5).map((machine) => (
                      <div key={machine.id} className="bg-white rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{machine.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            machine.health_status >= 80 
                              ? 'bg-green-100 text-green-700'
                              : machine.health_status >= 60
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {machine.health_status}%
                          </span>
                        </div>
                        <p className="text-gray-600">{machine.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'machines' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Machines</h3>
                <div className="text-sm text-gray-600">
                  Total: {machines.length} machines
                </div>
              </div>

              {selectedMachine && (
                <div className="mb-6">
                  <QRCodeGenerator 
                    machine_id={selectedMachine} 
                    machine_name={machines.find(m => m.id === selectedMachine)?.name || 'Unknown'} 
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    showQR={true}
                    onClick={() => setSelectedMachine(
                      selectedMachine === machine.id ? null : machine.id
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Complaints</h3>
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Complaint Trends</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-medium">{complaints.filter(c => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(c.created_at) > weekAgo;
                      }).length} complaints</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-medium">{totalComplaints} complaints</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resolution Rate</span>
                      <span className="font-medium text-green-600">
                        {Math.round((resolvedComplaints / totalComplaints) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Machine Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Health Score</span>
                      <span className="font-medium">
                        {Math.round(machines.reduce((acc, m) => acc + m.health_status, 0) / machines.length)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Machines Needing Service</span>
                      <span className="font-medium text-yellow-600">
                        {machines.filter(m => m.health_status < 60).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="font-medium text-green-600">97.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}