<?php
require_once 'config.php';
require_once 'classes/Database.php';
require_once 'classes/Auth.php';
require_once 'classes/Validator.php';

// Function to send standardized responses
function sendResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}

// Check request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    sendResponse(false, "Method Not Allowed");
}

// Check CSRF token
$auth = new Auth();
if (!isset($_POST['csrf_token']) || !$auth->verifyCSRFToken($_POST['csrf_token'])) {
    sendResponse(false, "Invalid security token. Please refresh the page and try again.");
}

try {
    // Initialize database tables
    $db = Database::getInstance();
    $db->initializeTables();
    
    // Sanitize input data
    $userData = [
        'firstName' => Validator::sanitize($_POST['firstName'] ?? ''),
        'lastName' => Validator::sanitize($_POST['lastName'] ?? ''),
        'email' => Validator::sanitizeEmail($_POST['email'] ?? ''),
        'password' => $_POST['password'] ?? '',
        'phone' => isset($_POST['number']) ? Validator::sanitizePhone($_POST['number']) : null,
        'gender' => $_POST['gender'] ?? ''
    ];
    
    // Validate input data
    $validator = new Validator($userData);
    $validator->required('firstName')
             ->required('lastName')
             ->required('email')
             ->email('email')
             ->required('password')
             ->minLength('password', AppConfig::PASSWORD_MIN_LENGTH)
             ->required('gender')
             ->in('gender', ['m', 'f', 'o']);
    
    if (!empty($userData['phone'])) {
        $validator->phone('phone');
    }
    
    if ($validator->fails()) {
        sendResponse(false, $validator->getAllErrorMessages()[0]);
    }
    
    // Register user
    $result = $auth->register($userData);
    
    if ($result['success']) {
        sendResponse(true, $result['message'], ['user_id' => $result['user_id']]);
    } else {
        sendResponse(false, $result['message']);
    }
    
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage());
    sendResponse(false, "Registration failed. Please try again later.");
}
?>
