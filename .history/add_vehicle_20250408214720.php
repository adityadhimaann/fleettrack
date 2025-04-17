<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB Config
$host = "localhost";
$dbname = "your_database_name"; // Replace with your real DB name
$user = "root"; // Default for XAMPP
$pass = "";     // Default for XAMPP

// Connect to DB
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo "❌ Database connection failed: " . $conn->connect_error;
    exit;
}

// Get data
$vehicle_name = $_POST['vehicle_name'] ?? '';
$vehicle_number = $_POST['vehicle_number'] ?? '';

if (empty($vehicle_name) || empty($vehicle_number)) {
    echo "❌ All fields are required.";
    exit;
}

// Prepare query
$stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
if (!$stmt) {
    echo "❌ Prepare failed: " . $conn->error;
    exit;
}

$stmt->bind_param("ss", $vehicle_name, $vehicle_number);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "❌ Insert failed: " . $stmt->error;
}

$stmt->close();
$conn->close();
