import React, { useState } from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DashboardStats from '../components/DashboardStats';
import ComplaintCard from '../components/ComplaintCard';

export default function ManagerDashboard() {
  const { complaints, updateComplaint } = useData();
  const [activeTab, setActiveTab] = useState<'escalated' | 'overview' | 'team'>('escalated');

  const escalatedComplaints = complaints.filter(c => c.escalation_level >= 1 && c.status === 'escalated');
  const highPriorityComplaints = complaints.filter(c => 
    (c.urgency === 'high' || c.urgency === 'critical') && 
    c.status !== 'resolved'
  );

  const handleResolveComplaint = (complaintId: string) => {
    updateComplaint(complaintId, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  };

  const handleEscalateToHead = (complaintId: string) => {
    updateComplaint(complaintId, {
      escalation_level: 2,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Oversee escalations and team performance</p>
        </div>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'escalated', label: 'Escalated Issues', icon: TrendingUp, count: escalatedComplaints.length },
              { id: 'overview', label: 'High Priority', icon: AlertTriangle, count: highPriorityComplaints.length },
              { id: 'team', label: 'Team Performance', icon: Users },
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
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'escalated' && (
            <div className="space-y-4">
              {escalatedComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalated Complaints</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Manager Action Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      These complaints have been escalated and require immediate attention.
                    </p>
                  </div>
                  {escalatedComplaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onResolve={() => handleResolveComplaint(complaint.id)}
                      onEscalate={() => handleEscalateToHead(complaint.id)}
                      showActions={true}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Escalated Issues</h3>
                  <p className="text-gray-600">All complaints are being handled at the appropriate level.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              {highPriorityComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">High Priority Complaints</h3>
                  {highPriorityComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No High Priority Issues</h3>
                  <p className="text-gray-600">All high priority complaints have been resolved.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Performance Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-blue-900">Response Time</h4>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">2.3 hrs</div>
                  <p className="text-sm text-blue-700">Average response time to complaints</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-green-900">Resolution Rate</h4>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">94%</div>
                  <p className="text-sm text-green-700">Complaints resolved within SLA</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-purple-900">Active Mechanics</h4>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-2">8</div>
                  <p className="text-sm text-purple-700">Currently handling complaints</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Mike Mechanic resolved complaint C002</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">New complaint C003 accepted by Tom Smith</span>
                    <span className="text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Complaint C001 escalated due to timeout</span>
                    <span className="text-gray-400">6 hours ago</span>
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