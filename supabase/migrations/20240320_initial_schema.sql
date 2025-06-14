-- Create enum types
CREATE TYPE user_role AS ENUM ('tailor', 'mechanic', 'manager', 'head');
CREATE TYPE machine_status AS ENUM ('active', 'maintenance', 'offline');
CREATE TYPE complaint_status AS ENUM ('open', 'accepted', 'in_progress', 'resolved', 'escalated');
CREATE TYPE complaint_urgency AS ENUM ('low', 'medium', 'high', 'critical');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role user_role NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create machines table
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(10,2) NOT NULL,
    depreciation_rate DECIMAL(5,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    health_status INTEGER NOT NULL CHECK (health_status >= 0 AND health_status <= 100),
    status machine_status NOT NULL DEFAULT 'active',
    last_service_date DATE NOT NULL,
    next_service_date DATE NOT NULL,
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES users(id) ON DELETE SET NULL,
    raised_by_name TEXT NOT NULL,
    raised_by_role user_role NOT NULL,
    description TEXT NOT NULL,
    urgency complaint_urgency NOT NULL,
    image_url TEXT,
    status complaint_status NOT NULL DEFAULT 'open',
    accepted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    accepted_by_name TEXT,
    accepted_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    escalation_level INTEGER NOT NULL DEFAULT 0,
    timer_started TIMESTAMP WITH TIME ZONE,
    time_remaining INTEGER
);

-- Create escalation_history table
CREATE TABLE escalation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    escalated_to_role user_role NOT NULL,
    escalated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved BOOLEAN DEFAULT FALSE
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
    BEFORE UPDATE ON machines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "All authenticated users can view machines" ON machines
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can view complaints" ON complaints
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Mechanics can update complaints" ON complaints
    FOR UPDATE USING (
        auth.uid() = accepted_by AND 
        status IN ('accepted', 'in_progress')
    );

CREATE POLICY "All authenticated users can view escalation history" ON escalation_history
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create realtime publications
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE complaints, machines, escalation_history;
COMMIT; 