<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host = "localhost";
$dbname = "test";
$user = "root";
$pass = "";

// Function to send standardized responses
function sendResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}
// Check request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    sendResponse(false, "Method Not Allowed");
}

// Validate required fields
$requiredFields = ['firstName', 'lastName', 'gender', 'email', 'password', 'number'];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        sendResponse(false, "Field '$field' is required.");
    }
}

// Sanitize and validate inputs
$firstName = htmlspecialchars(trim($_POST['firstName']));
$lastName = htmlspecialchars(trim($_POST['lastName']));
$gender = htmlspecialchars(trim($_POST['gender']));
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$number = preg_replace('/\D/', '', $_POST['number']); // Strip non-digit characters

// Validate gender
if (!in_array($gender, ['m', 'f', 'o'])) {
    sendResponse(false, "Invalid gender selected.");
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email format.");
}

// Validate phone number (10 digits)
if (!preg_match('/^\d{10}$/', $number)) {
    sendResponse(false, "Phone number must be a valid 10-digit number.");
}

// Hash password securely
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

try {
    // Create database connection using PDO
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO registration (firstName, lastName, gender, email, password, number) VALUES (?, ?, ?, ?, ?, ?)");

    // Execute statement with bindings
    $stmt->execute([$firstName, $lastName, $gender, $email, $password, $number]);

    // Success response
    sendResponse(true, "Registration successful!");
} catch (PDOException $e) {
    // Database error response
    sendResponse(false, "Database Error: " . $e->getMessage());
} catch (Exception $e) {
    // General error response
    sendResponse(false, "Error: " . $e->getMessage());
}
?>
