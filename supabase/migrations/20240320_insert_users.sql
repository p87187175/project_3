-- Insert users with their roles and departments
-- Note: Replace the UUIDs with the actual user IDs from your Supabase Authentication
-- You can get these IDs from the Authentication > Users section in Supabase dashboard

INSERT INTO users (id, name, role, email, department) VALUES
  ('7b6289c4-e006-439c-9e72-891e361845e2', 'Mike Mechanic', 'mechanic', 'mechanic@factory.com', 'Maintenance'),
  ('954341bb-c855-4245-8cc5-9e0680f391c8', 'John Tailor', 'tailor', 'tailor@factory.com', 'Cutting'),
  ('b85162ef-98c9-4200-9740-c9f06bc79ec4', 'Sarah Manager', 'manager', 'manager@factory.com', 'Operations'),
  ('eb5a82f7-645c-46fa-8fc4-70ba1e93663f', 'David Head', 'head', 'head@factory.com', 'Administration'); 