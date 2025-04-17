<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Retrieve and sanitize POST data
$firstName = trim($_POST['firstName'] ?? '');
$lastName  = trim($_POST['lastName'] ?? '');
$gender    = trim($_POST['gender'] ?? '');
$email     = trim($_POST['email'] ?? '');
$password  = $_POST['password'] ?? '';
$number    = trim($_POST['number'] ?? '');

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($gender) || empty($email) || empty($password) || empty($number)) {
    die("All fields are required.");
}

// Optional: Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email format.");
}

// Optional: Validate number (digits only)
if (!preg_match('/^\d+$/', $number)) {
    die("Invalid number format.");
}

// Hash the password for security
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Database connection
$conn = new mysqli('localhost', 'root', '', 'test');

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

// Prepare and execute insert
$stmt = $conn->prepare("
    INSERT INTO registration (firstName, lastName, gender, email, password, number)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("ssssss", $firstName, $lastName, $gender, $email, $hashedPassword, $number);

if ($stmt->execute()) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
