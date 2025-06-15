import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, AlertCircle, Camera, CameraOff } from 'lucide-react';

export default function ScanMachine() {
  const { machines, addComplaint, getMachineById } = useData();
  const { user } = useAuth();
  const [scannedId, setScannedId] = useState('');
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startScanning = async () => {
    if (!videoRef.current) return;
    
    try {
      setError('');
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      
      // Start scanning for QR codes
      scanForQRCode();
    } catch (err) {
      setError('Failed to start camera. Please check camera permissions.');
      setIsScanning(false);
    }
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple QR code detection simulation
    // In a real implementation, you would use a QR code library here
    // For demo purposes, we'll simulate finding a QR code after a few seconds
    setTimeout(() => {
      if (isScanning && Math.random() > 0.7) {
        // Simulate finding a random machine QR code
        const randomMachine = machines[Math.floor(Math.random() * machines.length)];
        if (randomMachine) {
          setScannedId(randomMachine.qr_code || randomMachine.id);
          stopScanning();
          return;
        }
      }
      if (isScanning) {
        requestAnimationFrame(scanForQRCode);
      }
    }, 1000);
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
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
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ display: isScanning ? 'block' : 'none' }}
              autoPlay
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Camera preview will appear here</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-2">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
                Start Scanning
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
              >
                <CameraOff className="h-4 w-4" />
                Stop Scanning
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Or enter machine QR/ID manually"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go
          </button>
        </form>
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4" /> 
            {error}
          </div>
        )}
        
        {machine ? (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">{machine.name}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{machine.department}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  machine.status === 'active' ? 'bg-green-100 text-green-700' :
                  machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {machine.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Health:</span>
                <span className="ml-2 font-medium">{machine.health_status}%</span>
              </div>
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-mono text-xs">{machine.id}</span>
              </div>
            </div>
            
            <form onSubmit={handleComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Issue
                </label>
                <textarea
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Describe the issue with this machine..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !complaintText.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
              {complaintSuccess && (
                <div className="text-green-600 text-center font-medium p-3 bg-green-50 rounded-lg border border-green-200">
                  Complaint submitted successfully!
                </div>
              )}
            </form>
          </div>
        ) : scannedId ? (
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-medium">Machine not found</p>
            <p className="text-sm text-gray-600">QR Code: {scannedId}</p>
          </div>
        ) : (
          <div className="text-center py-6">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Scan a machine QR code or enter its ID to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}