<?php
// Enable errors for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Return JSON responses for better API handling
header('Content-Type: application/json');

// DB Config (edit if needed)
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

// Connect to DB using try-catch for better error handling
try {
    $conn = new mysqli($host, $user, $pass, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Check POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Validate required fields
        $vehicle_name = trim($_POST['vehicle_name'] ?? '');
        $vehicle_number = trim($_POST['vehicle_number'] ?? '');
        
        if (empty($vehicle_name) || empty($vehicle_number)) {
            jsonResponse(false, "All fields are required.");
        }
        
        // Sanitize input
        $vehicle_name = htmlspecialchars($vehicle_name);
        $vehicle_number = htmlspecialchars($vehicle_number);
        
        // Prepare and execute
        $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
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
    } else {
        jsonResponse(false, "Invalid request method. POST required.");
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