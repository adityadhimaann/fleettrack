<?php
// Database connection details
$host = "localhost"; // Your database host
$user = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "fleetdb"; // Your database name

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $conn->real_escape_string($_POST["name"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $password = $conn->real_escape_string($_POST["password"]);

    // Debugging output to verify form data
    echo "Form Submitted!<br>";
    echo "Name: $name<br>Email: $email<br>Password: $password<br>";

    // Insert data into the signup table
    $sql = "INSERT INTO signup (name, email, password) VALUES ('$name', '$email', '$password')";
    if ($conn->query($sql) === TRUE) {
        echo "Sign-up successful!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
