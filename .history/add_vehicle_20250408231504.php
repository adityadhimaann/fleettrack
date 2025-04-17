<?php
// Enable full error reporting and logging
ini_set('display_errors', 1);
error_reporting(E_ALL);
// Create a log file for debugging
function logDebug($message) {
    $logFile = 'vehicle_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

logDebug("Script started");

// Return JSON responses
header('Content-Type: application/json');

// Database configuration
$host = "localhost";
$dbname = "addvehicles"; // your database name
$user = "root";          // default in XAMPP
$pass = "";              // default in XAMPP

logDebug("DB Config: host=$host, dbname=$dbname, user=$user");

// Function to return standardized JSON responses
function jsonResponse($success, $message, $data = null) {
    global $conn;
    
    // Close database connection if it exists
    if (isset($conn) && $conn) {
        $conn->close();
    }
    
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];
    
    logDebug("Sending response: " . json_encode($response));
    echo json_encode($response);
    exit;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logDebug("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    jsonResponse(false, "Invalid request method. POST required.");
}

// Log received data
logDebug("POST data received: " . json_encode($_POST));

// Validate and sanitize input
$vehicle_name = isset($_POST['vehicle_name']) ? trim($_POST['vehicle_name']) : '';
$vehicle_number = isset($_POST['vehicle_number']) ? trim($_POST['vehicle_number']) : '';

// Check if required fields are empty
if (empty($vehicle_name) || empty($vehicle_number)) {
    logDebug("Validation failed - empty fields");
    jsonResponse(false, "All fields are required.");
}

// Sanitize input to prevent XSS
$vehicle_name = htmlspecialchars($vehicle_name);
$vehicle_number = htmlspecialchars($vehicle_number);

logDebug("Validated data: name=$vehicle_name, number=$vehicle_number");

try {
    // Create database connection
    logDebug("Attempting database connection");
    $conn = new mysqli($host, $user, $pass, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        logDebug("Database connection failed: " . $conn->connect_error);
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    logDebug("Database connection successful");
    
    // Check if table exists, create if not
    logDebug("Checking if vehicles table exists");
    $tableCheckResult = $conn->query("SHOW TABLES LIKE 'vehicles'");
    
    if ($tableCheckResult->num_rows == 0) {
        logDebug("Creating vehicles table");
        $createTableSQL = "
            CREATE TABLE vehicles (
                id INT(11) NOT NULL AUTO_INCREMENT,
                vehicle_name VARCHAR(255) NOT NULL,
                vehicle_number VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        
        if (!$conn->query($createTableSQL)) {
            logDebug("Table creation failed: " . $conn->error);
            throw new Exception("Could not create table: " . $conn->error);
        }
        
        logDebug("Table created successfully");
    } else {
        logDebug("Table already exists");
    }
    
    // Prepare statement
    logDebug("Preparing insert statement");
    $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
    
    if (!$stmt) {
        logDebug("Prepare failed: " . $conn->error);
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind parameters and execute
    logDebug("Binding parameters");
    $stmt->bind_param("ss", $vehicle_name, $vehicle_number);
    
    logDebug("Executing statement");
    if ($stmt->execute()) {
        $new_id = $conn->insert_id;
        logDebug("Insert successful, new ID: " . $new_id);
        
        jsonResponse(true, "Vehicle added successfully", [
            'id' => $new_id,
            'vehicle_name' => $vehicle_name,
            'vehicle_number' => $vehicle_number
        ]);
    } else {
        logDebug("Insert failed: " . $stmt->error);
        throw new Exception("Insert failed: " . $stmt->error);
    }
    
} catch (Exception $e) {
    logDebug("Exception caught: " . $e->getMessage());
    jsonResponse(false, $e->getMessage());
} finally {
    // Close resources
    if (isset($stmt) && $stmt) {
        $stmt->close();
        logDebug("Statement closed");
    }
    if (isset($conn) && $conn) {
        $conn->close();
        logDebug("Connection closed");
    }
}
?>