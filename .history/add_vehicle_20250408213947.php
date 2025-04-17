<?php
// Database configuration
$host = "localhost";
$dbname = "addvehicles";     // your created DB name
$user = "root";
$pass = "";              // blank for XAMPP


// Create a database connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("error: Connection failed - " . $conn->connect_error);
}

// Retrieve form data
$vehicle_name = isset($_POST['vehicle_name']) ? trim($_POST['vehicle_name']) : '';
$vehicle_number = isset($_POST['vehicle_number']) ? trim($_POST['vehicle_number']) : '';

// Basic validation
if (empty($vehicle_name) || empty($vehicle_number)) {
    echo "error: Missing vehicle name or number";
    exit;
}

// Prepare and execute insert statement
$stmt = $conn->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number) VALUES (?, ?)");
if ($stmt === false) {
    echo "error: " . $conn->error;
    exit;
}

$stmt->bind_param("ss", $vehicle_name, $vehicle_number);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

?>
