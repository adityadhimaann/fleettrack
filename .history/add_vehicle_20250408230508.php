<?php
// Enable errors for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Return JSON responses
header('Content-Type: application/json');

// Database configuration
$host = "localhost";
$dbname = "addvehicles"; // your database name
$user = "root";          // default in XAMPP
$pass = "";              // default in XAMPP

// Function to return standardized JSON responses
function jsonResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method. POST required.");
}

// Validate and sanitize input
$vehicle_name = isset($_POST['vehicle_name']) ? trim($_POST['vehicle_name']) : '';
$vehicle_number = isset($_POST['vehicle_number']) ? trim($_POST['vehicle_number']) : '';

// Check if required fields are empty
if (empty($vehicle_name) || empty($vehicle_number)) {
    jsonResponse(false, "All fields are required.");
}

// Sanitize input to prevent XSS
$vehicle_name = htmlspecialchars($vehicle_name);
$vehicle_number = htmlspecialchars($vehicle_number);

try {
    // Create database connection
    $conn = new mysqli($host, $user, $pass, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Check if table exists, create if not
    $conn->query("
        CREATE TABLE IF NOT EXISTS vehicles (
            id INT(11) NOT NULL AUTO_INCREMENT,
            vehicle_name VARCHAR(255) NOT NULL,
            vehicle_number VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    
    // Prepare statement
    $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind parameters and execute
    $stmt->bind_param("ss", $vehicle_name, $vehicle_number);
    
    if ($stmt->execute()) {
        $new_id = $conn->insert_id;
        jsonResponse(true, "Vehicle added successfully", [
            'id' => $new_id,
            'vehicle_name' => $vehicle_name,
            'vehicle_number' => $vehicle_number
        ]);
    } else {
        throw new Exception("Insert failed: " . $stmt->error);
    }
    
} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
} finally {
    // Close resources
    if (isset($stmt) && $stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>