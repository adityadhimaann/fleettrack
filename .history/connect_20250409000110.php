<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host = "localhost";
$dbname = "test";
$user = "root";
$pass = "";

// Function to return standardized responses
function sendResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

// Check request method
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405); // Method Not Allowed
    sendResponse(false, "Method Not Allowed");
}

// Validate required fields
$requiredFields = ['firstName', 'lastName', 'gender', 'email', 'password', 'number'];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        sendResponse(false, "Field '$field' is required");
    }
}

// Sanitize and validate input
$firstName = htmlspecialchars(trim($_POST['firstName']));
$lastName = htmlspecialchars(trim($_POST['lastName']));
$gender = htmlspecialchars(trim($_POST['gender']));
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$password = $_POST['password']; // Will be hashed below
$number = filter_var($_POST['number'], FILTER_SANITIZE_NUMBER_INT);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email format");
}

// Validate phone number (basic check)
if (!is_numeric($number)) {
    sendResponse(false, "Phone number must contain only digits");
}

// Hash password for security
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // Create database connection
    $conn = new mysqli($host, $user, $pass, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection Failed: " . $conn->connect_error);
    }
    
    // Prepare statement with proper error handling
    $stmt = $conn->prepare("INSERT INTO registration(firstName, lastName, gender, email, password, number) VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind parameters - note we're using the hashed password
    $stmt->bind_param("sssssi", $firstName, $lastName, $gender, $email, $hashedPassword, $number);
    
    // Execute with error handling
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    // Success response
    sendResponse(true, "Registration successful!");
    
} catch (Exception $e) {
    // Error response
    sendResponse(false, "Error: " . $e->getMessage());
} finally {
    // Close resources
    if (isset($stmt) && $stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>