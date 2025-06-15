/*
  # Insert Demo Users

  1. New Users
    - Insert demo users for all roles (tailor, mechanic, manager, head)
    - Each user has proper role assignment and department
  
  2. Security
    - Users are inserted with specific UUIDs for consistency
    - All roles are represented for testing
*/

-- Insert demo users with consistent UUIDs
INSERT INTO users (id, name, role, email, department) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Tailor', 'tailor', 'tailor@factory.com', 'Cutting'),
  ('22222222-2222-2222-2222-222222222222', 'Mike Mechanic', 'mechanic', 'mechanic@factory.com', 'Maintenance'),
  ('33333333-3333-3333-3333-333333333333', 'Sarah Manager', 'manager', 'manager@factory.com', 'Operations'),
  ('44444444-4444-4444-4444-444444444444', 'David Head', 'head', 'head@factory.com', 'Administration'),
  ('55555555-5555-5555-5555-555555555555', 'Alice Tailor', 'tailor', 'alice@factory.com', 'Sewing'),
  ('66666666-6666-6666-6666-666666666666', 'Bob Mechanic', 'mechanic', 'bob@factory.com', 'Maintenance'),
  ('77777777-7777-7777-7777-777777777777', 'Carol Tailor', 'tailor', 'carol@factory.com', 'Finishing'),
  ('88888888-8888-8888-8888-888888888888', 'Dan Mechanic', 'mechanic', 'dan@factory.com', 'Maintenance');