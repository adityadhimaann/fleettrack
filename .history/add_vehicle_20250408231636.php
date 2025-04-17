<?php
// Enable full error reporting and logging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Log function
function logDebug($message) {
    $logFile = 'vehicle_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

logDebug("Script started");

// Return JSON responses
header('Content-Type: application/json');

// DB config
$host = "localhost";
$dbname = "addvehicles";
$user = "root";
$pass = "";

// Response helper
function jsonResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ];
    logDebug("Response: " . json_encode($response));
    echo json_encode($response);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logDebug("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    jsonResponse(false, "Invalid request method. POST required.");
}

// Get and sanitize input
$vehicle_name   = isset($_POST['vehicle_name']) ? trim($_POST['vehicle_name']) : '';
$vehicle_number = isset($_POST['vehicle_number']) ? trim($_POST['vehicle_number']) : '';

logDebug("Received input: name='$vehicle_name', number='$vehicle_number'");

// Validate input
if ($vehicle_name === '' || $vehicle_number === '') {
    logDebug("Validation failed - empty fields");
    jsonResponse(false, "All fields are required.");
}

// XSS protection
$vehicle_name   = htmlspecialchars($vehicle_name);
$vehicle_number = htmlspecialchars($vehicle_number);

$conn = null;
$stmt = null;

try {
    logDebug("Connecting to database");
    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    logDebug("Connected to DB");

    // Check/create table
    $checkTable = $conn->query("SHOW TABLES LIKE 'vehicles'");
    if ($checkTable->num_rows == 0) {
        logDebug("Creating vehicles table");
        $createTableSQL = "
            CREATE TABLE vehicles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vehicle_name VARCHAR(255) NOT NULL,
                vehicle_number VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        if (!$conn->query($createTableSQL)) {
            throw new Exception("Table creation failed: " . $conn->error);
        }
    }

    // Insert record
    $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $vehicle_name, $vehicle_number);
    if (!$stmt->execute()) {
        throw new Exception("Insert failed: " . $stmt->error);
    }

    $new_id = $conn->insert_id;
    logDebug("Insert success, ID=$new_id");

    jsonResponse(true, "Vehicle added successfully", [
        'id' => $new_id,
        'vehicle_name' => $vehicle_name,
        'vehicle_number' => $vehicle_number
    ]);

} catch (Exception $e) {
    logDebug("Error: " . $e->getMessage());
    jsonResponse(false, $e->getMessage());
} finally {
    // Close resources if not already exited
    if ($stmt) {
        $stmt->close();
        logDebug("Statement closed");
    }
    if ($conn) {
        $conn->close();
        logDebug("Connection closed");
    }
}
?>
