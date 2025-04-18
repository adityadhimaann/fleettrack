<?php
$servername = "localhost";
$username = "root";
$password = ""; // or your MySQL password
$dbname = "fleetdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get form data
$company = $_POST['company'];
$name = $_POST['name'];
$job_title = $_POST['job_title'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$confirm_password = $_POST['confirm_password'];
$fleet_size = $_POST['fleet_size'];
$terms = isset($_POST['terms']) ? 1 : 0;

// Check passwords match
if ($_POST['password'] !== $_POST['confirm_password']) {
  die("Passwords do not match.");
}

// Insert into database
$sql = "INSERT INTO users (company_name, full_name, job_title, email, password, fleet_size, terms_accepted)
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $company, $name, $job_title, $email, $password, $fleet_size, $terms);

if ($stmt->execute()) {
  echo "Account created successfully!";
  // Redirect or send to dashboard
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
