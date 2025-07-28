<?php
require_once 'config.php';
require_once 'classes/Database.php';
require_once 'classes/Auth.php';
require_once 'classes/Validator.php';

// Function to send JSON response
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

// Handle AJAX login requests
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_SERVER['CONTENT_TYPE']) && 
    strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendResponse(false, "Invalid request format.");
    }
    
    try {
        // Initialize database tables
        $db = Database::getInstance();
        $db->initializeTables();
        
        $auth = new Auth();
        
        // Validate input
        $validator = new Validator($input);
        $validator->required('email')
                 ->email('email')
                 ->required('password');
        
        if ($validator->fails()) {
            sendResponse(false, $validator->getAllErrorMessages()[0]);
        }
        
        $email = Validator::sanitizeEmail($input['email']);
        $password = $input['password'];
        $rememberMe = $input['remember_me'] ?? false;
        
        // Attempt login
        $result = $auth->login($email, $password, $rememberMe);
        
        if ($result['success']) {
            sendResponse(true, $result['message'], $result['user']);
        } else {
            sendResponse(false, $result['message']);
        }
        
    } catch (Exception $e) {
        error_log('Login error: ' . $e->getMessage());
        sendResponse(false, "Login failed. Please try again later.");
    }
}

// Handle traditional form submissions
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        $db = Database::getInstance();
        $db->initializeTables();
        
        $auth = new Auth();
        
        $email = Validator::sanitizeEmail($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $rememberMe = isset($_POST['remember_me']);
        
        if (empty($email) || empty($password)) {
            $error = "Email and password are required.";
        } else {
            $result = $auth->login($email, $password, $rememberMe);
            
            if ($result['success']) {
                // Redirect to dashboard
                header("Location: index.html");
                exit();
            } else {
                $error = $result['message'];
            }
        }
        
    } catch (Exception $e) {
        error_log('Login error: ' . $e->getMessage());
        $error = "Login failed. Please try again later.";
    }
}
?>
