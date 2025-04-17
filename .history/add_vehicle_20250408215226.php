<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB Config
$host = "localhost";
$dbname = "addvehicles"; // Your DB name
$user = "root"; // XAMPP default
$pass = "";     // XAMPP default

// Connect to DB
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo "❌ Database connection failed: " . $conn->connect_error;
    exit;
}

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vehicle_name = $_POST['vehicle_name'] ?? '';
    $vehicle_number = $_POST['vehicle_number'] ?? '';

    if (empty($vehicle_name) || empty($vehicle_number)) {
        echo "❌ All fields are required.";
        exit;
    }

    // Prepare and insert
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
} else {
    echo "GET method - no form submitted";
}

$conn->close();
