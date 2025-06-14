import React, { createContext, useContext, useState, useEffect } from 'react';
import { Machine, Complaint, EscalationHistory, DashboardStats } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  machines: Machine[];
  complaints: Complaint[];
  escalationHistory: EscalationHistory[];
  dashboardStats: DashboardStats;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  acceptComplaint: (complaintId: string, mechanicId: string, mechanicName: string) => Promise<void>;
  getMachineById: (id: string) => Machine | undefined;
  getComplaintsByMachine: (machine_id: string) => Complaint[];
  getComplaintsByUser: (user_id: string) => Complaint[];
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockMachines: Machine[] = [
  {
    id: 'M001',
    name: 'Industrial Sewing Machine #1',
    department: 'Cutting',
    purchase_date: '2022-01-15',
    purchase_cost: 15000,
    depreciation_rate: 10,
    current_value: 13500,
    health_status: 85,
    status: 'active',
    last_service_date: '2024-01-10',
    next_service_date: '2024-04-10',
    qr_code: 'M001',
  },
  {
    id: 'M002',
    name: 'Overlock Machine #2',
    department: 'Sewing',
    purchase_date: '2021-06-20',
    purchase_cost: 12000,
    depreciation_rate: 12,
    current_value: 9600,
    health_status: 92,
    status: 'active',
    last_service_date: '2024-01-05',
    next_service_date: '2024-04-05',
  },
  {
    id: 'M003',
    name: 'Cutting Machine #3',
    department: 'Cutting',
    purchase_date: '2023-03-10',
    purchase_cost: 25000,
    depreciation_rate: 8,
    current_value: 23000,
    health_status: 45,
    status: 'maintenance',
    last_service_date: '2024-01-20',
    next_service_date: '2024-02-20',
  },
];

const mockComplaints: Complaint[] = [
  {
    id: 'C001',
    machine_id: 'M001',
    raised_by: '1',
    raised_by_name: 'John Tailor',
    raised_by_role: 'tailor',
    description: 'Machine making unusual noise during operation',
    urgency: 'medium',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    escalation_level: 0,
  },
  {
    id: 'C002',
    machine_id: 'M002',
    raised_by: '1',
    raised_by_name: 'John Tailor',
    raised_by_role: 'tailor',
    description: 'Thread keeps breaking, affecting production quality',
    urgency: 'high',
    status: 'accepted',
    accepted_by: '2',
    accepted_by_name: 'Mike Mechanic',
    accepted_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    escalation_level: 0,
    timer_started: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    time_remaining: 9 * 60 * 60 * 1000, // 9 hours remaining
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [escalationHistory, setEscalationHistory] = useState<EscalationHistory[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalMachines: 0,
    activeMachines: 0,
    maintenanceMachines: 0,
    offlineMachines: 0,
    openComplaints: 0,
    escalatedComplaints: 0,
    resolvedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    refreshData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to machines changes
    const machinesSubscription = supabase
      .channel('machines-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'machines' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMachines(prev => [...prev, payload.new as Machine]);
        } else if (payload.eventType === 'UPDATE') {
          setMachines(prev => prev.map(m => m.id === payload.new.id ? payload.new as Machine : m));
        } else if (payload.eventType === 'DELETE') {
          setMachines(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to complaints changes
    const complaintsSubscription = supabase
      .channel('complaints-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComplaints(prev => [...prev, payload.new as Complaint]);
        } else if (payload.eventType === 'UPDATE') {
          setComplaints(prev => prev.map(c => c.id === payload.new.id ? payload.new as Complaint : c));
        } else if (payload.eventType === 'DELETE') {
          setComplaints(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to escalation history changes
    const escalationSubscription = supabase
      .channel('escalation-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'escalation_history' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEscalationHistory(prev => [...prev, payload.new as EscalationHistory]);
        } else if (payload.eventType === 'UPDATE') {
          setEscalationHistory(prev => prev.map(e => e.id === payload.new.id ? payload.new as EscalationHistory : e));
        } else if (payload.eventType === 'DELETE') {
          setEscalationHistory(prev => prev.filter(e => e.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      machinesSubscription.unsubscribe();
      complaintsSubscription.unsubscribe();
      escalationSubscription.unsubscribe();
    };
  }, []);

  // Update dashboard stats when data changes
  useEffect(() => {
    const calculateDashboardStats = (): DashboardStats => {
      const totalMachines = machines.length;
      const activeMachines = machines.filter(m => m.status === 'active').length;
      const maintenanceMachines = machines.filter(m => m.status === 'maintenance').length;
      const offlineMachines = machines.filter(m => m.status === 'offline').length;
      const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'accepted' || c.status === 'in_progress').length;
      const escalatedComplaints = complaints.filter(c => c.escalation_level > 0).length;
      
      const today = new Date().toDateString();
      const resolvedToday = complaints.filter(c => 
        c.status === 'resolved' && 
        c.resolved_at && 
        new Date(c.resolved_at).toDateString() === today
      ).length;

      return {
        totalMachines,
        activeMachines,
        maintenanceMachines,
        offlineMachines,
        openComplaints,
        escalatedComplaints,
        resolvedToday,
      };
    };

    setDashboardStats(calculateDashboardStats());
  }, [machines, complaints]);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('DataContext: refreshData called');
    try {
      const [machinesResponse, complaintsResponse, escalationResponse] = await Promise.all([
        supabase.from('machines').select('*'),
        supabase.from('complaints').select('*'),
        supabase.from('escalation_history').select('*')
      ]);

      console.log('DataContext: machinesResponse', machinesResponse);
      console.log('DataContext: complaintsResponse', complaintsResponse);
      console.log('DataContext: escalationResponse', escalationResponse);

      if (machinesResponse.error) throw machinesResponse.error;
      if (complaintsResponse.error) throw complaintsResponse.error;
      if (escalationResponse.error) throw escalationResponse.error;

      setMachines(machinesResponse.data as Machine[]);
      setComplaints(complaintsResponse.data as Complaint[]);
      setEscalationHistory(escalationResponse.data as EscalationHistory[]);
      setIsLoading(false);
      setError(null);
    } catch (error: any) {
      console.error('DataContext: Error refreshing data:', error);
      setMachines([]);
      setComplaints([]);
      setEscalationHistory([]);
      setError(error.message || 'Failed to load data.');
      setIsLoading(false);
    }
  };

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([complaintData])
        .select()
        .single();
      console.log('DataContext: addComplaint', data, error);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('DataContext: Error adding complaint:', error);
      throw error;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id);
      console.log('DataContext: updateComplaint', id, updates, error);
      if (error) throw error;
    } catch (error) {
      console.error('DataContext: Error updating complaint:', error);
      throw error;
    }
  };

  const acceptComplaint = async (complaintId: string, mechanicId: string, mechanicName: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status: 'accepted',
          accepted_by: mechanicId,
          accepted_by_name: mechanicName,
          accepted_at: new Date().toISOString(),
          timer_started: new Date().toISOString(),
          time_remaining: 12 * 60 * 60 * 1000, // 12 hours
        })
        .eq('id', complaintId);
      console.log('DataContext: acceptComplaint', complaintId, error);
      if (error) throw error;
    } catch (error) {
      console.error('DataContext: Error accepting complaint:', error);
      throw error;
    }
  };

  const getMachineById = (id: string) => machines.find(m => m.id === id);

  const getComplaintsByMachine = (machine_id: string) => 
    complaints.filter(c => c.machine_id === machine_id);

  const getComplaintsByUser = (user_id: string) => 
    complaints.filter(c => c.raised_by === user_id);

  return (
    <DataContext.Provider value={{
      machines,
      complaints,
      escalationHistory,
      dashboardStats,
      addComplaint,
      updateComplaint,
      acceptComplaint,
      getMachineById,
      getComplaintsByMachine,
      getComplaintsByUser,
      refreshData,
      isLoading,
      error,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}