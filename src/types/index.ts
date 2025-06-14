export type UserRole = 'tailor' | 'mechanic' | 'manager' | 'head';

export type MachineStatus = 'active' | 'maintenance' | 'offline';

export type ComplaintStatus = 'open' | 'accepted' | 'in_progress' | 'resolved' | 'escalated';

export type ComplaintUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
}

export interface Machine {
  id: string;
  name: string;
  department: string;
  purchase_date: string;
  purchase_cost: number;
  depreciation_rate: number;
  current_value: number;
  health_status: number; // 0-100
  status: MachineStatus;
  last_service_date: string;
  next_service_date: string;
  qr_code?: string;
}

export interface Complaint {
  id: string;
  machine_id: string;
  raised_by: string;
  raised_by_name: string;
  raised_by_role: UserRole;
  description: string;
  urgency: ComplaintUrgency;
  image_url?: string;
  status: ComplaintStatus;
  accepted_by?: string;
  accepted_by_name?: string;
  accepted_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  escalation_level: number;
  timer_started?: string;
  time_remaining?: number;
}

export interface EscalationHistory {
  id: string;
  complaint_id: string;
  escalated_to_role: UserRole;
  escalated_by: string;
  reason: string;
  timestamp: string;
  resolved?: boolean;
}

export interface DashboardStats {
  totalMachines: number;
  activeMachines: number;
  maintenanceMachines: number;
  offlineMachines: number;
  openComplaints: number;
  escalatedComplaints: number;
  resolvedToday: number;
}