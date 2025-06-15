/*
  # Update Machines with QR Codes

  1. Updates
    - Add QR codes to existing machines for easy scanning
    - Ensure all machines have proper QR code identifiers
  
  2. Data Consistency
    - QR codes match machine IDs for simplicity
    - All machines are scannable
*/

-- Update existing machines with QR codes if they don't have them
UPDATE machines SET qr_code = 'M001' WHERE name = 'Industrial Sewing Machine #1' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M002' WHERE name = 'Overlock Machine #2' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M003' WHERE name = 'Cutting Machine #3' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M004' WHERE name = 'Embroidery Machine #4' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M005' WHERE name = 'Button Stitch Machine #5' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M006' WHERE name = 'Flatlock Machine #6' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M007' WHERE name = 'Blind Stitch Machine #7' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M008' WHERE name = 'Bar Tack Machine #8' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M009' WHERE name = 'Feed Off The Arm Machine #9' AND qr_code IS NULL;
UPDATE machines SET qr_code = 'M010' WHERE name = 'Cylinder Bed Machine #10' AND qr_code IS NULL;