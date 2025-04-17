<?php
// Database connection details
$host = "localhost"; // Your database host
$user = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "fleetdb"; // Your database name

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Form Submitted!<br>";
    echo "Name: $name<br>Email: $email<br>Password: $password<br>";

    $sql = "INSERT INTO signup (name, email, password) VALUES ('$name', '$email', '$password')";
    if ($conn->query($sql) === TRUE) {
        echo "Sign-up successful!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();
?>
