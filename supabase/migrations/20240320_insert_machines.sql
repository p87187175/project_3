-- Insert initial machines for testing
INSERT INTO machines (
  name,
  department,
  purchase_date,
  purchase_cost,
  depreciation_rate,
  current_value,
  health_status,
  status,
  last_service_date,
  next_service_date
) VALUES
  (
    'Industrial Sewing Machine #1',
    'Cutting',
    '2022-01-15',
    15000.00,
    10.00,
    13500.00,
    85,
    'active',
    '2024-01-10',
    '2024-04-10'
  ),
  (
    'Overlock Machine #2',
    'Sewing',
    '2021-06-20',
    12000.00,
    12.00,
    9600.00,
    92,
    'active',
    '2024-01-05',
    '2024-04-05'
  ),
  (
    'Cutting Machine #3',
    'Cutting',
    '2023-03-10',
    25000.00,
    8.00,
    23000.00,
    45,
    'maintenance',
    '2024-01-20',
    '2024-02-20'
  ); 