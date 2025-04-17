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

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and retrieve form data
    $vehicle_name = $conn->real_escape_string($_POST["vehicle_name"]);
    $vehicle_number = $conn->real_escape_string($_POST["vehicle_number"]);
    $status = $conn->real_escape_string($_POST["status"]);
    $vehicle_type = $conn->real_escape_string($_POST["vehicle_type"]);

    // Debugging Output (optional)
    echo "Form Submitted!<br>";
    echo "Vehicle Name: $vehicle_name<br>";
    echo "Vehicle Number: $vehicle_number<br>";
    echo "Status: $status<br>";
    echo "Vehicle Type: $vehicle_type<br>";

    // SQL Insert query
    $sql = "INSERT INTO vehicles (vehicle_name, vehicle_number, status, vehicle_type) 
            VALUES ('$vehicle_name', '$vehicle_number', '$status', '$vehicle_type')";

    if ($conn->query($sql) === TRUE) {
        echo "<p style='color: green;'>Vehicle added successfully!</p>";
    } else {
        echo "<p style='color: red;'>Error: " . $sql . "<br>" . $conn->error . "</p>";
    }
}

// Close connection
$conn->close();
?>
