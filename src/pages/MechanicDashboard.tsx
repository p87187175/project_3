import React, { useState } from 'react';
import { Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import DashboardStats from '../components/DashboardStats';
import ComplaintCard from '../components/ComplaintCard';
import { Complaint } from '../types';

export default function MechanicDashboard() {
  const { user } = useAuth();
  const { complaints, updateComplaint, acceptComplaint } = useData();
  const [activeTab, setActiveTab] = useState<'available' | 'my-tasks' | 'completed'>('available');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const availableComplaints = complaints.filter((c: Complaint) => c.status === 'open');
  const myComplaints = complaints.filter((c: Complaint) => c.accepted_by === user?.id && c.status !== 'resolved');
  const completedComplaints = complaints.filter((c: Complaint) => c.accepted_by === user?.id && c.status === 'resolved');

  const handleAcceptComplaint = async (complaintId: string) => {
    if (!user) return;
    setAcceptingId(complaintId);
    setAcceptError(null);
    try {
      await acceptComplaint(complaintId, user.id, user.name);
      setAcceptingId(null);
    } catch (err: any) {
      setAcceptError(err.message || 'Failed to accept complaint');
      setAcceptingId(null);
    }
  };

  const handleResolveComplaint = (complaintId: string) => {
    updateComplaint(complaintId, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  };

  const handleEscalateComplaint = (complaintId: string) => {
    updateComplaint(complaintId, {
      status: 'escalated',
      escalation_level: 1,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mechanic Dashboard</h1>
          <p className="text-gray-600">Accept and resolve machine issues</p>
        </div>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'available', label: 'Available Tasks', icon: AlertTriangle, count: availableComplaints.length },
              { id: 'my-tasks', label: 'My Tasks', icon: Clock, count: myComplaints.length },
              { id: 'completed', label: 'Completed', icon: CheckCircle, count: completedComplaints.length },
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
                  {tab.count > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' && (
            <div className="space-y-4">
              {acceptError && (
                <div className="text-red-600 font-medium mb-2">{acceptError}</div>
              )}
              {availableComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Complaints</h3>
                  {availableComplaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onAccept={() => handleAcceptComplaint(complaint.id)}
                      showActions={true}
                      accepting={acceptingId === complaint.id}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Tasks</h3>
                  <p className="text-gray-600">All complaints have been assigned or resolved.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-tasks' && (
            <div className="space-y-4">
              {myComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Tasks</h3>
                  {myComplaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onResolve={() => handleResolveComplaint(complaint.id)}
                      onEscalate={() => handleEscalateComplaint(complaint.id)}
                      showActions={true}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tasks</h3>
                  <p className="text-gray-600">Accept available complaints to start working on them.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Tasks</h3>
                  {completedComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tasks</h3>
                  <p className="text-gray-600">Your completed tasks will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}