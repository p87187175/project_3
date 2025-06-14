import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, AlertCircle } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

export default function ScanMachine() {
  const { machines, addComplaint, getMachineById } = useData();
  const { user } = useAuth();
  const [scannedId, setScannedId] = useState('');
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedId(data);
      setError('');
    }
  };

  const handleError = (err: any) => {
    setError('QR scan error');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScannedId(manualId);
    setError('');
  };

  const machine = machines.find(m => m.qr_code === scannedId || m.id === scannedId);

  const handleComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine || !user) return;
    setIsSubmitting(true);
    setError('');
    setComplaintSuccess(false);
    try {
      await addComplaint({
        machine_id: machine.id,
        raised_by: user.id,
        raised_by_name: user.name,
        raised_by_role: user.role,
        description: complaintText,
        urgency: 'medium',
        status: 'open',
        escalation_level: 0,
      });
      setComplaintSuccess(true);
      setComplaintText('');
    } catch (err) {
      setError('Failed to raise complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <QrCode className="h-6 w-6 text-blue-600" /> Scan Machine QR
        </h2>
        <div className="mb-4">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
        <form onSubmit={handleManualSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Or enter machine QR/ID manually"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Go</button>
        </form>
        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        {machine ? (
          <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">{machine.name}</h3>
            <p className="text-sm text-gray-700 mb-1">Department: {machine.department}</p>
            <p className="text-sm text-gray-700 mb-1">Status: {machine.status}</p>
            <p className="text-sm text-gray-700 mb-1">Health: {machine.health_status}%</p>
            <p className="text-sm text-gray-700 mb-1">Last Service: {machine.last_service_date}</p>
            <p className="text-sm text-gray-700 mb-1">Next Service: {machine.next_service_date}</p>
            <form onSubmit={handleComplaint} className="mt-4">
              <label className="block text-sm font-medium mb-1">Raise Complaint</label>
              <textarea
                value={complaintText}
                onChange={e => setComplaintText(e.target.value)}
                className="w-full border rounded p-2 mb-2"
                placeholder="Describe the issue..."
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !complaintText}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
              {complaintSuccess && (
                <div className="text-green-600 mt-2">Complaint raised successfully!</div>
              )}
            </form>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Scan a machine QR code or enter its ID to view details.</div>
        )}
      </div>
    </div>
  );
} 