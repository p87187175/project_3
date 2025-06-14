import React from 'react';
import { 
  Clock, 
  User, 
  AlertCircle, 
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUp
} from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintCardProps {
  complaint: Complaint;
  onAccept?: () => void;
  onResolve?: () => void;
  onEscalate?: () => void;
  showActions?: boolean;
}

export default function ComplaintCard({ 
  complaint, 
  onAccept, 
  onResolve, 
  onEscalate, 
  showActions = false 
}: ComplaintCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-700 bg-blue-100';
      case 'accepted': return 'text-purple-700 bg-purple-100';
      case 'in_progress': return 'text-orange-700 bg-orange-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      case 'escalated': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatTimeRemaining = (timeMs: number) => {
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(complaint.urgency)}`}>
              {complaint.urgency} priority
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace('_', ' ')}
            </span>
            {complaint.escalation_level > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <ArrowUp className="h-3 w-3" />
                <span className="text-xs font-medium">Level {complaint.escalation_level}</span>
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Machine: {complaint.machine_id}</h3>
          <p className="text-sm text-gray-700 mb-3">{complaint.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{complaint.raised_by_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {complaint.time_remaining && complaint.status === 'accepted' && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Time remaining: {formatTimeRemaining(complaint.time_remaining)}
            </span>
          </div>
          <div className="mt-2 bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.max(0, (complaint.time_remaining / (12 * 60 * 60 * 1000)) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {complaint.accepted_by_name && (
        <div className="mb-4 text-sm text-gray-600">
          Accepted by: <span className="font-medium">{complaint.accepted_by_name}</span>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {complaint.status === 'open' && onAccept && (
            <button
              onClick={onAccept}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Accept
            </button>
          )}
          
          {complaint.status === 'accepted' && onResolve && (
            <button
              onClick={onResolve}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Mark Resolved
            </button>
          )}
          
          {(complaint.status === 'accepted' || complaint.status === 'in_progress') && onEscalate && (
            <button
              onClick={onEscalate}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
              Escalate
            </button>
          )}
        </div>
      )}
    </div>
  );
}