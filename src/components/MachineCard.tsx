import React from 'react';
import { 
  Settings, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Power,
  QrCode
} from 'lucide-react';
import { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  onClick?: () => void;
  showQR?: boolean;
}

export default function MachineCard({ machine, onClick, showQR = false }: MachineCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'maintenance': return AlertTriangle;
      case 'offline': return Power;
      default: return Activity;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100';
    if (health >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const StatusIcon = getStatusIcon(machine.status);

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{machine.name}</h3>
          <p className="text-sm text-gray-600">{machine.department}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {machine.id}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {showQR && (
            <div className="bg-gray-100 rounded-lg p-2">
              <QrCode className="h-4 w-4 text-gray-600" />
            </div>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
            <StatusIcon className="h-3 w-3" />
            {machine.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${getHealthColor(machine.health_status)}`}>
              {machine.health_status}%
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Value</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            ${machine.current_value.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Last: {new Date(machine.last_service_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Settings className="h-3 w-3" />
          <span>Next: {new Date(machine.next_service_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}