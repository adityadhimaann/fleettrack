<?php
$host = "localhost";
$dbname = "your_database";
$user = "your_user";
$pass = "your_password";

// Connect to database
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$vehicleName = $_POST['vehicle_name'] ?? '';
$vehicleNumber = $_POST['vehicle_number'] ?? '';

if (!empty($vehicleName) && !empty($vehicleNumber)) {
    $stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
    $stmt->bind_param("ss", $vehicleName, $vehicleNumber);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "error: Missing fields";
}

$conn->close();
?>
