-- Insert 10 demo machines with QR codes
INSERT INTO machines (
  name, department, purchase_date, purchase_cost, depreciation_rate, current_value, health_status, status, last_service_date, next_service_date, qr_code
) VALUES
('Industrial Sewing Machine #1', 'Cutting', '2022-01-15', 15000.00, 10.00, 13500.00, 85, 'active', '2024-01-10', '2024-04-10', 'M001'),
('Overlock Machine #2', 'Sewing', '2021-06-20', 12000.00, 12.00, 9600.00, 92, 'active', '2024-01-05', '2024-04-05', 'M002'),
('Cutting Machine #3', 'Cutting', '2023-03-10', 25000.00, 8.00, 23000.00, 45, 'maintenance', '2024-01-20', '2024-02-20', 'M003'),
('Embroidery Machine #4', 'Embroidery', '2020-09-12', 18000.00, 9.00, 14000.00, 78, 'active', '2024-02-01', '2024-05-01', 'M004'),
('Button Stitch Machine #5', 'Finishing', '2021-11-30', 9000.00, 11.00, 7000.00, 88, 'active', '2024-01-15', '2024-04-15', 'M005'),
('Flatlock Machine #6', 'Sewing', '2022-05-18', 16000.00, 10.00, 14000.00, 80, 'active', '2024-01-25', '2024-04-25', 'M006'),
('Blind Stitch Machine #7', 'Finishing', '2023-01-22', 11000.00, 10.00, 10500.00, 95, 'active', '2024-02-10', '2024-05-10', 'M007'),
('Bar Tack Machine #8', 'Cutting', '2021-08-14', 13000.00, 12.00, 11000.00, 70, 'maintenance', '2024-01-30', '2024-04-30', 'M008'),
('Feed Off The Arm Machine #9', 'Sewing', '2022-12-05', 20000.00, 9.00, 18000.00, 90, 'active', '2024-02-20', '2024-05-20', 'M009'),
('Cylinder Bed Machine #10', 'Embroidery', '2020-03-17', 22000.00, 8.00, 17000.00, 60, 'offline', '2023-12-10', '2024-03-10', 'M010'); 