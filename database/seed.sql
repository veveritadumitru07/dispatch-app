-- ============================================
-- A8I Dispatch - Date de test pentru MySQL/XAMPP
-- ============================================
-- IMPORTANT:
-- Tabelele se creează AUTOMAT când pornești backend-ul (synchronize: true).
-- Acest fișier conține DOAR datele de test.
--
-- PAȘI:
--   1. Creează baza de date (CREATE DATABASE dispatch_db) - sau folosește phpMyAdmin
--   2. Pornește backend-ul (npm run start:dev) - se vor crea tabelele goale
--   3. Oprește backend-ul (Ctrl+C)
--   4. Rulează acest fișier în phpMyAdmin → tab SQL
--   5. Repornește backend-ul
-- ============================================

USE dispatch_db;

-- Drivers (Șoferi)
INSERT INTO drivers (first_name, last_name, phone, email, truck_number, license_number, status, hired_at, created_at) VALUES
('John', 'Smith', '+1-555-0101', 'john.smith@email.com', 'TRK-1001', 'CDL-A-12345', 'available', '2024-01-15', NOW()),
('Michael', 'Johnson', '+1-555-0102', 'michael.j@email.com', 'TRK-1002', 'CDL-A-12346', 'on_load', '2024-03-20', NOW()),
('Robert', 'Williams', '+1-555-0103', 'robert.w@email.com', 'TRK-1003', 'CDL-A-12347', 'available', '2023-11-10', NOW()),
('David', 'Brown', '+1-555-0104', 'david.b@email.com', 'TRK-1004', 'CDL-A-12348', 'home_time', '2024-05-05', NOW()),
('James', 'Davis', '+1-555-0105', 'james.d@email.com', 'TRK-1005', 'CDL-A-12349', 'available', '2024-02-28', NOW());

-- Brokers
INSERT INTO brokers (company_name, mc_number, contact_name, email, phone, payment_terms_days, rating, created_at) VALUES
('FreightHub Logistics', 'MC-123456', 'Sarah Wilson', 'sarah@freighthub.com', '+1-555-0201', 30, 5, NOW()),
('TransAmerica Brokers', 'MC-234567', 'Mark Anderson', 'mark@transamerica.com', '+1-555-0202', 45, 4, NOW()),
('Quick Freight Co', 'MC-345678', 'Lisa Martinez', 'lisa@quickfreight.com', '+1-555-0203', 21, 5, NOW()),
('Reliable Loads Inc', 'MC-456789', 'Tom Garcia', 'tom@reliableloads.com', '+1-555-0204', 30, 3, NOW());

-- Loads (Curse) - dispatcher_id e NULL, va fi setat când creezi loads din interfață
INSERT INTO loads (pickup_location, delivery_location, pickup_date, delivery_date, miles, rate, commission_percent, status, broker_id, driver_id, notes, created_at, updated_at) VALUES
('Chicago, IL', 'Dallas, TX', '2026-05-10', '2026-05-12', 925.50, 2400.00, 6.00, 'delivered', 1, 2, 'Refrigerated load - keep at 38F', NOW(), NOW()),
('Atlanta, GA', 'Miami, FL', '2026-05-15', '2026-05-16', 660.00, 1850.00, 6.00, 'in_transit', 2, 2, 'Dry van - regular load', NOW(), NOW()),
('Los Angeles, CA', 'Phoenix, AZ', '2026-05-20', '2026-05-21', 380.00, 1200.00, 6.00, 'booked', 3, NULL, 'Quick run - same day pickup', NOW(), NOW()),
('Seattle, WA', 'Denver, CO', '2026-05-22', '2026-05-24', 1320.00, 3500.00, 7.00, 'booked', 1, NULL, 'Long haul, premium rate', NOW(), NOW());
