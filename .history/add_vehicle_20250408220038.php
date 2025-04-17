<?php
// Enable errors for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// DB Config (edit if needed)
$host = "127.0.0.1:3307";
$dbname = "addvehicles"; // your database name
$user = "root";          // default in XAMPP
$pass = "";              // default in XAMPP

// Connect to DB
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo "❌ Database connection failed: " . $conn->connect_error;
    exit;
}

// Check POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vehicle_name = $_POST['vehicle_name'] ?? '';
    $vehicle_number = $_POST['vehicle_number'] ?? '';

    if (empty($vehicle_name) || empty($vehicle_number)) {
        echo "❌ All fields are required.";
        exit;
    }

    // Prepare and execute
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
} else {
    echo "❌ Invalid request.";
}
?>
