/*
  # Insert Demo Complaints

  1. New Complaints
    - Insert sample complaints for testing
    - Various urgency levels and statuses
    - Different escalation levels
  
  2. Data Variety
    - Open complaints for mechanics to accept
    - Accepted complaints with timers
    - Resolved complaints for history
    - Escalated complaints for managers
*/

-- Insert demo complaints
INSERT INTO complaints (
  id,
  machine_id,
  raised_by,
  raised_by_name,
  raised_by_role,
  description,
  urgency,
  status,
  accepted_by,
  accepted_by_name,
  accepted_at,
  resolved_at,
  created_at,
  updated_at,
  escalation_level,
  timer_started,
  time_remaining
) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    (SELECT id FROM machines WHERE name = 'Industrial Sewing Machine #1' LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    'John Tailor',
    'tailor',
    'Machine making unusual noise during operation',
    'medium',
    'open',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours',
    0,
    NULL,
    NULL
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    (SELECT id FROM machines WHERE name = 'Overlock Machine #2' LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    'John Tailor',
    'tailor',
    'Thread keeps breaking, affecting production quality',
    'high',
    'accepted',
    '22222222-2222-2222-2222-222222222222',
    'Mike Mechanic',
    NOW() - INTERVAL '3 hours',
    NULL,
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '3 hours',
    0,
    NOW() - INTERVAL '3 hours',
    32400000
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    (SELECT id FROM machines WHERE name = 'Cutting Machine #3' LIMIT 1),
    '55555555-5555-5555-5555-555555555555',
    'Alice Tailor',
    'tailor',
    'Machine stopped working completely, urgent repair needed',
    'critical',
    'escalated',
    '66666666-6666-6666-6666-666666666666',
    'Bob Mechanic',
    NOW() - INTERVAL '8 hours',
    NULL,
    NOW() - INTERVAL '10 hours',
    NOW() - INTERVAL '1 hour',
    1,
    NOW() - INTERVAL '8 hours',
    NULL
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    (SELECT id FROM machines WHERE name = 'Embroidery Machine #4' LIMIT 1),
    '77777777-7777-7777-7777-777777777777',
    'Carol Tailor',
    'tailor',
    'Embroidery patterns coming out distorted',
    'medium',
    'resolved',
    '22222222-2222-2222-2222-222222222222',
    'Mike Mechanic',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day',
    0,
    NOW() - INTERVAL '2 days',
    NULL
  ),
  (
    'c5555555-5555-5555-5555-555555555555',
    (SELECT id FROM machines WHERE name = 'Button Stitch Machine #5' LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    'John Tailor',
    'tailor',
    'Button holes not aligning properly',
    'low',
    'open',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour',
    0,
    NULL,
    NULL
  ),
  (
    'c6666666-6666-6666-6666-666666666666',
    (SELECT id FROM machines WHERE name = 'Flatlock Machine #6' LIMIT 1),
    '55555555-5555-5555-5555-555555555555',
    'Alice Tailor',
    'tailor',
    'Seam quality deteriorating, needs immediate attention',
    'high',
    'open',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '30 minutes',
    0,
    NULL,
    NULL
  );