import React, { useState } from 'react';
import { QrCode, FileText, History, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import DashboardStats from '../components/DashboardStats';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintForm from '../components/ComplaintForm';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Link } from 'react-router-dom';

export default function TailorDashboard() {
  const { user } = useAuth();
  const { complaints, machines, addComplaint, getComplaintsByUser, getMachineById } = useData();
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'complaints' | 'history'>('scan');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userComplaints = getComplaintsByUser(user?.id || '');
  const activeComplaints = userComplaints.filter(c => 
    c.status === 'open' || c.status === 'accepted' || c.status === 'in_progress'
  );
  const resolvedComplaints = userComplaints.filter(c => c.status === 'resolved');

  const handleMachineSelect = (machine_id: string) => {
    setSelectedMachine(machine_id);
    setShowComplaintForm(true);
  };

  const handleComplaintSubmit = async (data: {
    description: string;
    urgency: any;
    image_url?: string;
  }) => {
    if (!selectedMachine || !user) return;
    setSubmitError(null);
    const complaintData = {
      machine_id: selectedMachine,
      raised_by: user.id,
      raised_by_name: user.name,
      raised_by_role: user.role,
      description: data.description,
      urgency: data.urgency,
      image_url: data.image_url,
      status: 'open',
      escalation_level: 0,
    };
    console.log('Submitting complaint:', complaintData);
    try {
      await addComplaint(complaintData);
      setShowComplaintForm(false);
      setSelectedMachine(null);
      setActiveTab('complaints');
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit complaint.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tailor Dashboard</h1>
          <p className="text-gray-600">Scan machines and report issues</p>
        </div>
        <Link
          to="/scan"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Scan Machine QR
        </Link>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'scan', label: 'Scan Machine', icon: QrCode },
              { id: 'complaints', label: 'Active Issues', icon: AlertCircle, count: activeComplaints.length },
              { id: 'history', label: 'History', icon: History, count: resolvedComplaints.length },
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
          {activeTab === 'scan' && (
            <div className="space-y-6">
              {showComplaintForm && selectedMachine ? (
                <ComplaintForm
                  machine_id={selectedMachine}
                  machine_name={getMachineById(selectedMachine)?.name || 'Unknown Machine'}
                  onSubmit={handleComplaintSubmit}
                  onCancel={() => {
                    setShowComplaintForm(false);
                    setSelectedMachine(null);
                  }}
                />
              ) : (
                <>
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <QrCode className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan Machine QR Code</h3>
                    <p className="text-gray-600 mb-6">Use your camera to scan the QR code on any machine to report issues</p>
                    <p className="text-sm text-gray-500 mb-4">For demonstration, select a machine below:</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {machines.map((machine) => (
                      <div
                        key={machine.id}
                        onClick={() => handleMachineSelect(machine.id)}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{machine.name}</h4>
                          <QrCode className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">{machine.department}</p>
                        <p className="text-xs text-gray-500">ID: {machine.id}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
              {activeComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Complaints</h3>
                  {activeComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Complaints</h3>
                  <p className="text-gray-600">All your reported issues have been resolved or are being processed.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {resolvedComplaints.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolved Issues</h3>
                  {resolvedComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
                  <p className="text-gray-600">Your resolved complaints will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {submitError && (
        <div className="text-red-600 text-sm mb-2">{submitError}</div>
      )}
    </div>
  );
}