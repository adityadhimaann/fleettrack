<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB Config
$host = "localhost";
$dbname = "your_database_name";
$user = "root";
$pass = "";

// Connect
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Get POST data
$vehicle_name = $_POST['vehicle_name'] ?? '';
$vehicle_number = $_POST['vehicle_number'] ?? '';

if (empty($vehicle_name) || empty($vehicle_number)) {
    echo "All fields are required.";
    exit;
}

// Insert query
$stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
$stmt->bind_param("ss", $vehicle_name, $vehicle_number);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Database error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
