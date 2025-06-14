import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrCodeIcon } from 'lucide-react';

interface QRCodeGeneratorProps {
  machineId: string;
  machineName: string;
}

export default function QRCodeGenerator({ machineId, machineName }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        // In a real app, this would be the actual URL to the machine page
        const machineUrl = `${window.location.origin}/machine/${machineId}`;
        const qrDataUrl = await QRCode.toDataURL(machineUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        });
        setQRCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [machineId]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `machine-${machineId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 rounded-lg p-2">
          <QrCodeIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Machine QR Code</h3>
          <p className="text-sm text-gray-600">Scan to access machine details</p>
        </div>
      </div>

      {qrCodeUrl && (
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200 mb-4">
            <img src={qrCodeUrl} alt={`QR Code for ${machineName}`} className="w-32 h-32" />
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium">{machineName}</p>
            <p>ID: {machineId}</p>
          </div>
          <button
            onClick={downloadQRCode}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}