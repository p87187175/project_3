export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      machines: {
        Row: {
          id: string
          name: string
          department: string
          purchase_date: string
          purchase_cost: number
          depreciation_rate: number
          current_value: number
          health_status: number
          status: 'active' | 'maintenance' | 'offline'
          last_service_date: string
          next_service_date: string
          qr_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['machines']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['machines']['Insert']>
      }
      complaints: {
        Row: {
          id: string
          machine_id: string
          raised_by: string
          raised_by_name: string
          raised_by_role: 'tailor' | 'mechanic' | 'manager' | 'head'
          description: string
          urgency: 'low' | 'medium' | 'high' | 'critical'
          image_url: string | null
          status: 'open' | 'accepted' | 'in_progress' | 'resolved' | 'escalated'
          accepted_by: string | null
          accepted_by_name: string | null
          accepted_at: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
          escalation_level: number
          timer_started: string | null
          time_remaining: number | null
        }
        Insert: Omit<Database['public']['Tables']['complaints']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>
      }
      escalation_history: {
        Row: {
          id: string
          complaint_id: string
          escalated_to_role: 'tailor' | 'mechanic' | 'manager' | 'head'
          escalated_by: string
          reason: string
          timestamp: string
          resolved: boolean
        }
        Insert: Omit<Database['public']['Tables']['escalation_history']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['escalation_history']['Insert']>
      }
      users: {
        Row: {
          id: string
          name: string
          role: 'tailor' | 'mechanic' | 'manager' | 'head'
          email: string
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 