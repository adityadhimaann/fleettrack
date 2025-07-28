<?php
/**
 * FleetTrack Initialization Script
 * Sets up database tables and populates sample data
 */

require_once 'config.php';
require_once 'classes/Database.php';

// Set execution time limit for initialization
set_time_limit(300);

try {
    echo "🚛 FleetTrack Initialization Started...\n\n";
    
    // Initialize database connection
    $db = Database::getInstance();
    
    echo "✅ Database connection established\n";
    
    // Create all tables
    echo "📋 Creating database tables...\n";
    $db->initializeTables();
    echo "✅ Database tables created successfully\n";
    
    // Insert sample data
    echo "📊 Inserting sample data...\n";
    insertSampleData($db);
    echo "✅ Sample data inserted successfully\n";
    
    echo "\n🎉 FleetTrack initialization completed successfully!\n";
    echo "🌐 You can now access the application at: http://localhost:8000\n";
    echo "👤 Default admin credentials:\n";
    echo "   Email: admin@fleettrack.com\n";
    echo "   Password: FleetTrack2024!\n\n";
    
} catch (Exception $e) {
    echo "❌ Initialization failed: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Insert sample data into the database
 */
function insertSampleData($db) {
    // Insert sample users
    insertSampleUsers($db);
    
    // Insert sample vehicles
    insertSampleVehicles($db);
    
    // Insert sample driver details
    insertSampleDriverDetails($db);
    
    // Insert sample maintenance records
    insertSampleMaintenanceRecords($db);
    
    // Insert sample trips
    insertSampleTrips($db);
}

/**
 * Insert sample users
 */
function insertSampleUsers($db) {
    $users = [
        [
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@fleettrack.com',
            'password' => password_hash('FleetTrack2024!', PASSWORD_DEFAULT),
            'phone' => '+1234567890',
            'gender' => 'm',
            'role' => 'admin',
            'status' => 'active'
        ],
        [
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john.smith@fleettrack.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'phone' => '+1234567891',
            'gender' => 'm',
            'role' => 'driver',
            'status' => 'active'
        ],
        [
            'first_name' => 'Sarah',
            'last_name' => 'Johnson',
            'email' => 'sarah.johnson@fleettrack.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'phone' => '+1234567892',
            'gender' => 'f',
            'role' => 'driver',
            'status' => 'active'
        ],
        [
            'first_name' => 'Mike',
            'last_name' => 'Wilson',
            'email' => 'mike.wilson@fleettrack.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'phone' => '+1234567893',
            'gender' => 'm',
            'role' => 'manager',
            'status' => 'active'
        ],
        [
            'first_name' => 'Emily',
            'last_name' => 'Davis',
            'email' => 'emily.davis@fleettrack.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'phone' => '+1234567894',
            'gender' => 'f',
            'role' => 'driver',
            'status' => 'active'
        ]
    ];
    
    $sql = "INSERT INTO users (first_name, last_name, email, password, phone, gender, role, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($users as $user) {
        $db->insert($sql, array_values($user));
    }
    
    echo "   👥 Sample users inserted\n";
}

/**
 * Insert sample vehicles
 */
function insertSampleVehicles($db) {
    $vehicles = [
        [
            'vehicle_name' => 'Ford Transit Van',
            'vehicle_number' => 'FT-001',
            'vehicle_type' => 'van',
            'model' => 'Ford Transit 350',
            'year' => 2022,
            'fuel_type' => 'diesel',
            'fuel_capacity' => 80.00,
            'current_fuel_level' => 75.50,
            'mileage' => 15420.50,
            'status' => 'active',
            'driver_id' => 2, // John Smith
            'last_service_date' => '2024-01-15',
            'next_service_date' => '2024-04-15',
            'insurance_expiry' => '2024-12-31',
            'registration_expiry' => '2025-03-31'
        ],
        [
            'vehicle_name' => 'Chevrolet Silverado',
            'vehicle_number' => 'CS-002',
            'vehicle_type' => 'truck',
            'model' => 'Chevrolet Silverado 1500',
            'year' => 2023,
            'fuel_type' => 'petrol',
            'fuel_capacity' => 98.00,
            'current_fuel_level' => 45.20,
            'mileage' => 8750.25,
            'status' => 'active',
            'driver_id' => 3, // Sarah Johnson
            'last_service_date' => '2024-02-01',
            'next_service_date' => '2024-05-01',
            'insurance_expiry' => '2024-11-30',
            'registration_expiry' => '2025-02-28'
        ],
        [
            'vehicle_name' => 'Honda Civic',
            'vehicle_number' => 'HC-003',
            'vehicle_type' => 'car',
            'model' => 'Honda Civic LX',
            'year' => 2021,
            'fuel_type' => 'petrol',
            'fuel_capacity' => 47.00,
            'current_fuel_level' => 85.00,
            'mileage' => 32150.75,
            'status' => 'active',
            'driver_id' => 5, // Emily Davis
            'last_service_date' => '2024-01-20',
            'next_service_date' => '2024-04-20',
            'insurance_expiry' => '2024-10-15',
            'registration_expiry' => '2025-01-15'
        ],
        [
            'vehicle_name' => 'Mercedes Sprinter',
            'vehicle_number' => 'MS-004',
            'vehicle_type' => 'van',
            'model' => 'Mercedes Sprinter 2500',
            'year' => 2020,
            'fuel_type' => 'diesel',
            'fuel_capacity' => 75.00,
            'current_fuel_level' => 25.30,
            'mileage' => 45680.90,
            'status' => 'maintenance',
            'driver_id' => null,
            'last_service_date' => '2024-02-10',
            'next_service_date' => '2024-03-10',
            'insurance_expiry' => '2024-09-30',
            'registration_expiry' => '2024-12-31'
        ],
        [
            'vehicle_name' => 'Toyota Camry',
            'vehicle_number' => 'TC-005',
            'vehicle_type' => 'car',
            'model' => 'Toyota Camry LE',
            'year' => 2022,
            'fuel_type' => 'hybrid',
            'fuel_capacity' => 50.00,
            'current_fuel_level' => 92.10,
            'mileage' => 18920.40,
            'status' => 'active',
            'driver_id' => null,
            'last_service_date' => '2024-01-05',
            'next_service_date' => '2024-04-05',
            'insurance_expiry' => '2025-01-31',
            'registration_expiry' => '2025-04-30'
        ]
    ];
    
    $sql = "INSERT INTO vehicles (vehicle_name, vehicle_number, vehicle_type, model, year, 
            fuel_type, fuel_capacity, current_fuel_level, mileage, status, driver_id, 
            last_service_date, next_service_date, insurance_expiry, registration_expiry) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($vehicles as $vehicle) {
        $db->insert($sql, array_values($vehicle));
    }
    
    echo "   🚗 Sample vehicles inserted\n";
}

/**
 * Insert sample driver details
 */
function insertSampleDriverDetails($db) {
    $driverDetails = [
        [
            'user_id' => 2, // John Smith
            'license_number' => 'DL123456789',
            'license_expiry' => '2026-08-15',
            'license_class' => 'CDL-A',
            'experience_years' => 8,
            'emergency_contact' => '+1987654321',
            'address' => '123 Main St, Chicago, IL 60601'
        ],
        [
            'user_id' => 3, // Sarah Johnson
            'license_number' => 'DL987654321',
            'license_expiry' => '2025-12-20',
            'license_class' => 'CDL-B',
            'experience_years' => 5,
            'emergency_contact' => '+1987654322',
            'address' => '456 Oak Ave, Detroit, MI 48201'
        ],
        [
            'user_id' => 5, // Emily Davis
            'license_number' => 'DL456789123',
            'license_expiry' => '2027-03-10',
            'license_class' => 'Class C',
            'experience_years' => 3,
            'emergency_contact' => '+1987654323',
            'address' => '789 Pine Rd, Columbus, OH 43215'
        ]
    ];
    
    $sql = "INSERT INTO driver_details (user_id, license_number, license_expiry, 
            license_class, experience_years, emergency_contact, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($driverDetails as $detail) {
        $db->insert($sql, array_values($detail));
    }
    
    echo "   🪪 Sample driver details inserted\n";
}

/**
 * Insert sample maintenance records
 */
function insertSampleMaintenanceRecords($db) {
    $maintenanceRecords = [
        [
            'vehicle_id' => 1,
            'maintenance_type' => 'routine',
            'description' => 'Regular oil change and filter replacement',
            'cost' => 85.50,
            'service_date' => '2024-01-15',
            'next_service_date' => '2024-04-15',
            'mechanic_name' => 'Bob\'s Auto Service',
            'status' => 'completed'
        ],
        [
            'vehicle_id' => 2,
            'maintenance_type' => 'repair',
            'description' => 'Brake pad replacement and rotor resurfacing',
            'cost' => 245.75,
            'service_date' => '2024-02-01',
            'next_service_date' => null,
            'mechanic_name' => 'Quick Fix Garage',
            'status' => 'completed'
        ],
        [
            'vehicle_id' => 4,
            'maintenance_type' => 'emergency',
            'description' => 'Engine diagnostic and repair - overheating issue',
            'cost' => 650.00,
            'service_date' => '2024-02-25',
            'next_service_date' => '2024-03-10',
            'mechanic_name' => 'Downtown Auto Repair',
            'status' => 'in_progress'
        ],
        [
            'vehicle_id' => 3,
            'maintenance_type' => 'inspection',
            'description' => 'Annual safety inspection',
            'cost' => 35.00,
            'service_date' => '2024-01-20',
            'next_service_date' => '2025-01-20',
            'mechanic_name' => 'State Inspection Center',
            'status' => 'completed'
        ]
    ];
    
    $sql = "INSERT INTO maintenance_records (vehicle_id, maintenance_type, description, 
            cost, service_date, next_service_date, mechanic_name, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($maintenanceRecords as $record) {
        $db->insert($sql, array_values($record));
    }
    
    echo "   🔧 Sample maintenance records inserted\n";
}

/**
 * Insert sample trips
 */
function insertSampleTrips($db) {
    $trips = [
        [
            'vehicle_id' => 1,
            'driver_id' => 2,
            'start_location' => 'Chicago, IL',
            'end_location' => 'Milwaukee, WI',
            'start_time' => '2024-02-20 08:00:00',
            'end_time' => '2024-02-20 10:30:00',
            'distance' => 92.5,
            'fuel_consumed' => 8.2,
            'status' => 'completed',
            'notes' => 'Delivery completed successfully'
        ],
        [
            'vehicle_id' => 2,
            'driver_id' => 3,
            'start_location' => 'Detroit, MI',
            'end_location' => 'Grand Rapids, MI',
            'start_time' => '2024-02-21 09:15:00',
            'end_time' => '2024-02-21 12:45:00',
            'distance' => 158.3,
            'fuel_consumed' => 12.1,
            'status' => 'completed',
            'notes' => 'Multiple stops for equipment pickup'
        ],
        [
            'vehicle_id' => 3,
            'driver_id' => 5,
            'start_location' => 'Columbus, OH',
            'end_location' => 'Cleveland, OH',
            'start_time' => '2024-02-22 07:30:00',
            'end_time' => null,
            'distance' => null,
            'fuel_consumed' => null,
            'status' => 'in_progress',
            'notes' => 'Client meeting scheduled for 2 PM'
        ],
        [
            'vehicle_id' => 1,
            'driver_id' => 2,
            'start_location' => 'Chicago, IL',
            'end_location' => 'Indianapolis, IN',
            'start_time' => '2024-02-25 06:00:00',
            'end_time' => null,
            'distance' => null,
            'fuel_consumed' => null,
            'status' => 'planned',
            'notes' => 'Scheduled delivery for Monday morning'
        ]
    ];
    
    $sql = "INSERT INTO trips (vehicle_id, driver_id, start_location, end_location, 
            start_time, end_time, distance, fuel_consumed, status, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($trips as $trip) {
        $db->insert($sql, array_values($trip));
    }
    
    echo "   🛣️ Sample trips inserted\n";
}

// Run initialization if called directly
if (php_sapi_name() === 'cli') {
    // Command line execution
    echo "Running FleetTrack initialization...\n";
} else {
    // Web execution
    header('Content-Type: text/plain');
}
?>