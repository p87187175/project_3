import { Complaint } from './index';

export interface ComplaintCardProps {
  complaint: Complaint;
  onAccept?: () => void;
  onResolve?: () => void;
  onEscalate?: () => void;
  showActions?: boolean;
}

export interface DashboardStatsProps {
  stats: {
    totalMachines: number;
    activeMachines: number;
    maintenanceMachines: number;
    offlineMachines: number;
    openComplaints: number;
    escalatedComplaints: number;
    resolvedToday: number;
  };
} 