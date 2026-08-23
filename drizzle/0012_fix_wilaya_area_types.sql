-- Migration: Fix wilaya area_type values in production
-- Source: src/db/seedData.ts → ALGERIAN_WILAYAS
-- All 58 wilayas updated to correct areaType values
-- Safe to re-run: idempotent UPDATE statements
-- Only changes: wilayas.area_type column

BEGIN;

UPDATE wilayas SET area_type = 'desert' WHERE code = '01';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '02';
UPDATE wilayas SET area_type = 'rural' WHERE code = '03';
UPDATE wilayas SET area_type = 'rural' WHERE code = '04';
UPDATE wilayas SET area_type = 'urban' WHERE code = '05';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '06';
UPDATE wilayas SET area_type = 'rural' WHERE code = '07';
UPDATE wilayas SET area_type = 'desert' WHERE code = '08';
UPDATE wilayas SET area_type = 'urban' WHERE code = '09';
UPDATE wilayas SET area_type = 'rural' WHERE code = '10';
UPDATE wilayas SET area_type = 'desert' WHERE code = '11';
UPDATE wilayas SET area_type = 'rural' WHERE code = '12';
UPDATE wilayas SET area_type = 'urban' WHERE code = '13';
UPDATE wilayas SET area_type = 'rural' WHERE code = '14';
UPDATE wilayas SET area_type = 'urban' WHERE code = '15';
UPDATE wilayas SET area_type = 'urban' WHERE code = '16';
UPDATE wilayas SET area_type = 'rural' WHERE code = '17';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '18';
UPDATE wilayas SET area_type = 'urban' WHERE code = '19';
UPDATE wilayas SET area_type = 'rural' WHERE code = '20';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '21';
UPDATE wilayas SET area_type = 'urban' WHERE code = '22';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '23';
UPDATE wilayas SET area_type = 'rural' WHERE code = '24';
UPDATE wilayas SET area_type = 'urban' WHERE code = '25';
UPDATE wilayas SET area_type = 'rural' WHERE code = '26';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '27';
UPDATE wilayas SET area_type = 'rural' WHERE code = '28';
UPDATE wilayas SET area_type = 'rural' WHERE code = '29';
UPDATE wilayas SET area_type = 'desert' WHERE code = '30';
UPDATE wilayas SET area_type = 'urban' WHERE code = '31';
UPDATE wilayas SET area_type = 'rural' WHERE code = '32';
UPDATE wilayas SET area_type = 'desert' WHERE code = '33';
UPDATE wilayas SET area_type = 'urban' WHERE code = '34';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '35';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '36';
UPDATE wilayas SET area_type = 'desert' WHERE code = '37';
UPDATE wilayas SET area_type = 'rural' WHERE code = '38';
UPDATE wilayas SET area_type = 'desert' WHERE code = '39';
UPDATE wilayas SET area_type = 'rural' WHERE code = '40';
UPDATE wilayas SET area_type = 'rural' WHERE code = '41';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '42';
UPDATE wilayas SET area_type = 'rural' WHERE code = '43';
UPDATE wilayas SET area_type = 'rural' WHERE code = '44';
UPDATE wilayas SET area_type = 'rural' WHERE code = '45';
UPDATE wilayas SET area_type = 'coastal' WHERE code = '46';
UPDATE wilayas SET area_type = 'desert' WHERE code = '47';
UPDATE wilayas SET area_type = 'rural' WHERE code = '48';
UPDATE wilayas SET area_type = 'desert' WHERE code = '49';
UPDATE wilayas SET area_type = 'desert' WHERE code = '50';
UPDATE wilayas SET area_type = 'desert' WHERE code = '51';
UPDATE wilayas SET area_type = 'desert' WHERE code = '52';
UPDATE wilayas SET area_type = 'desert' WHERE code = '53';
UPDATE wilayas SET area_type = 'desert' WHERE code = '54';
UPDATE wilayas SET area_type = 'desert' WHERE code = '55';
UPDATE wilayas SET area_type = 'desert' WHERE code = '56';
UPDATE wilayas SET area_type = 'desert' WHERE code = '57';
UPDATE wilayas SET area_type = 'desert' WHERE code = '58';

-- Verification: count by area_type
-- SELECT area_type, COUNT(*) AS count FROM wilayas GROUP BY area_type ORDER BY area_type;
-- Expected: coastal=10, desert=18, rural=20, urban=10, total=58

COMMIT;
