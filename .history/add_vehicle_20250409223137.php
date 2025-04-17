<?php
// Database connection details
$host = "localhost";
$user = "root";
$password = "";
$database = "fleetdb";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Escape user inputs
    $vehicle_name = $conn->real_escape_string($_POST["vehicle_name"]);
    $vehicle_number = $conn->real_escape_string($_POST["vehicle_number"]);
    $status = $conn->real_escape_string($_POST["status"]);

    // Debug output (optional)
    echo "Form Submitted!<br>";
    echo "Vehicle Name: $vehicle_name<br>";
    echo "Vehicle Number: $vehicle_number<br>";
    echo "Status: $status<br>";

    // Insert into vehicles table
    $sql = "INSERT INTO vehicles (vehicle_name, vehicle_number, status) 
            VALUES ('$vehicle_name', '$vehicle_number', '$status')";

    if ($conn->query($sql) === TRUE) {
        echo "Vehicle added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
