<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/Database.php';

/**
 * Enhanced Authentication Class with Security Features
 */
class Auth {
    private $db;
    private $sessionTimeout;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->sessionTimeout = AppConfig::SESSION_TIMEOUT;
        $this->startSession();
    }
    
    /**
     * Start secure session
     */
    private function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Regenerate session ID periodically
        if (!isset($_SESSION['last_regeneration'])) {
            $this->regenerateSession();
        } elseif (time() - $_SESSION['last_regeneration'] > 300) { // 5 minutes
            $this->regenerateSession();
        }
        
        // Check session timeout
        if (isset($_SESSION['last_activity']) && 
            time() - $_SESSION['last_activity'] > $this->sessionTimeout) {
            $this->logout();
        }
        
        $_SESSION['last_activity'] = time();
    }
    
    /**
     * Regenerate session ID for security
     */
    private function regenerateSession() {
        session_regenerate_id(true);
        $_SESSION['last_regeneration'] = time();
    }
    
    /**
     * Register new user with enhanced validation
     */
    public function register($userData) {
        try {
            // Validate input data
            $validation = $this->validateRegistrationData($userData);
            if (!$validation['valid']) {
                return ['success' => false, 'message' => $validation['message']];
            }
            
            // Check if email already exists
            if ($this->emailExists($userData['email'])) {
                return ['success' => false, 'message' => 'Email address already registered.'];
            }
            
            // Hash password
            $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
            
            // Insert user into database
            $sql = "INSERT INTO users (first_name, last_name, email, password, phone, gender, role) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $params = [
                $userData['firstName'],
                $userData['lastName'],
                $userData['email'],
                $hashedPassword,
                $userData['phone'] ?? null,
                $userData['gender'],
                $userData['role'] ?? 'driver'
            ];
            
            $userId = $this->db->insert($sql, $params);
            
            // Log successful registration
            $this->logActivity($userId, 'user_registered');
            
            return ['success' => true, 'message' => 'Registration successful!', 'user_id' => $userId];
            
        } catch (Exception $e) {
            error_log('Registration error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Registration failed. Please try again.'];
        }
    }
    
    /**
     * Login user with rate limiting and security checks
     */
    public function login($email, $password, $rememberMe = false) {
        try {
            // Check rate limiting
            if ($this->isRateLimited($email)) {
                return ['success' => false, 'message' => 'Too many login attempts. Please try again later.'];
            }
            
            // Get user from database
            $sql = "SELECT id, first_name, last_name, email, password, role, status, 
                           failed_login_attempts, locked_until 
                    FROM users WHERE email = ?";
            
            $user = $this->db->fetchOne($sql, [$email]);
            
            if (!$user) {
                $this->recordFailedLogin($email);
                return ['success' => false, 'message' => 'Invalid email or password.'];
            }
            
            // Check if account is locked
            if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
                return ['success' => false, 'message' => 'Account is temporarily locked. Please try again later.'];
            }
            
            // Check if account is active
            if ($user['status'] !== 'active') {
                return ['success' => false, 'message' => 'Account is not active. Please contact administrator.'];
            }
            
            // Verify password
            if (!password_verify($password, $user['password'])) {
                $this->recordFailedLogin($email, $user['id']);
                return ['success' => false, 'message' => 'Invalid email or password.'];
            }
            
            // Successful login
            $this->clearFailedLogins($user['id']);
            $this->createUserSession($user, $rememberMe);
            $this->logActivity($user['id'], 'user_login');
            
            return [
                'success' => true, 
                'message' => 'Login successful!',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['first_name'] . ' ' . $user['last_name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ];
            
        } catch (Exception $e) {
            error_log('Login error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Login failed. Please try again.'];
        }
    }
    
    /**
     * Logout user and clean session
     */
    public function logout() {
        if ($this->isLoggedIn()) {
            $this->logActivity($_SESSION['user_id'], 'user_logout');
        }
        
        // Clear session data
        $_SESSION = array();
        
        // Delete session cookie
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        // Destroy session
        session_destroy();
        
        return ['success' => true, 'message' => 'Logged out successfully.'];
    }
    
    /**
     * Check if user is logged in
     */
    public function isLoggedIn() {
        return isset($_SESSION['user_id']) && isset($_SESSION['user_email']);
    }
    
    /**
     * Get current user data
     */
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        $sql = "SELECT id, first_name, last_name, email, role, status, last_login 
                FROM users WHERE id = ?";
        
        return $this->db->fetchOne($sql, [$_SESSION['user_id']]);
    }
    
    /**
     * Check if user has specific role
     */
    public function hasRole($role) {
        $user = $this->getCurrentUser();
        return $user && $user['role'] === $role;
    }
    
    /**
     * Check if user has any of the specified roles
     */
    public function hasAnyRole($roles) {
        $user = $this->getCurrentUser();
        return $user && in_array($user['role'], $roles);
    }
    
    /**
     * Change user password
     */
    public function changePassword($userId, $currentPassword, $newPassword) {
        try {
            // Get current password hash
            $sql = "SELECT password FROM users WHERE id = ?";
            $user = $this->db->fetchOne($sql, [$userId]);
            
            if (!$user || !password_verify($currentPassword, $user['password'])) {
                return ['success' => false, 'message' => 'Current password is incorrect.'];
            }
            
            // Validate new password
            if (!$this->validatePassword($newPassword)) {
                return ['success' => false, 'message' => 'New password does not meet requirements.'];
            }
            
            // Update password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $sql = "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?";
            
            $this->db->modify($sql, [$hashedPassword, $userId]);
            $this->logActivity($userId, 'password_changed');
            
            return ['success' => true, 'message' => 'Password changed successfully.'];
            
        } catch (Exception $e) {
            error_log('Password change error: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Failed to change password.'];
        }
    }
    
    /**
     * Validate registration data
     */
    private function validateRegistrationData($data) {
        $required = ['firstName', 'lastName', 'email', 'password', 'gender'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return ['valid' => false, 'message' => ucfirst($field) . ' is required.'];
            }
        }
        
        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['valid' => false, 'message' => 'Invalid email format.'];
        }
        
        // Validate password
        if (!$this->validatePassword($data['password'])) {
            return ['valid' => false, 'message' => 'Password must be at least ' . AppConfig::PASSWORD_MIN_LENGTH . ' characters long.'];
        }
        
        // Validate gender
        if (!in_array($data['gender'], ['m', 'f', 'o'])) {
            return ['valid' => false, 'message' => 'Invalid gender selection.'];
        }
        
        // Validate phone if provided
        if (!empty($data['phone']) && !preg_match('/^\+?[\d\s\-\(\)]{10,15}$/', $data['phone'])) {
            return ['valid' => false, 'message' => 'Invalid phone number format.'];
        }
        
        return ['valid' => true];
    }
    
    /**
     * Validate password strength
     */
    private function validatePassword($password) {
        return strlen($password) >= AppConfig::PASSWORD_MIN_LENGTH;
    }
    
    /**
     * Check if email exists
     */
    private function emailExists($email) {
        $sql = "SELECT id FROM users WHERE email = ?";
        $result = $this->db->fetchOne($sql, [$email]);
        return $result !== false;
    }
    
    /**
     * Check rate limiting for login attempts
     */
    private function isRateLimited($email) {
        $sql = "SELECT failed_login_attempts, locked_until FROM users WHERE email = ?";
        $user = $this->db->fetchOne($sql, [$email]);
        
        if (!$user) {
            return false;
        }
        
        // Check if account is locked
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            return true;
        }
        
        return $user['failed_login_attempts'] >= AppConfig::MAX_LOGIN_ATTEMPTS;
    }
    
    /**
     * Record failed login attempt
     */
    private function recordFailedLogin($email, $userId = null) {
        if ($userId) {
            $sql = "UPDATE users SET 
                    failed_login_attempts = failed_login_attempts + 1,
                    locked_until = CASE 
                        WHEN failed_login_attempts + 1 >= ? THEN DATE_ADD(NOW(), INTERVAL ? SECOND)
                        ELSE locked_until 
                    END
                    WHERE id = ?";
            
            $this->db->modify($sql, [AppConfig::MAX_LOGIN_ATTEMPTS, AppConfig::LOCKOUT_DURATION, $userId]);
        }
        
        // Log failed attempt
        $this->logActivity($userId, 'failed_login', ['email' => $email]);
    }
    
    /**
     * Clear failed login attempts
     */
    private function clearFailedLogins($userId) {
        $sql = "UPDATE users SET 
                failed_login_attempts = 0, 
                locked_until = NULL, 
                last_login = NOW() 
                WHERE id = ?";
        
        $this->db->modify($sql, [$userId]);
    }
    
    /**
     * Create user session
     */
    private function createUserSession($user, $rememberMe = false) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['login_time'] = time();
        
        // Set remember me cookie if requested
        if ($rememberMe) {
            $token = bin2hex(random_bytes(32));
            setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/', '', true, true); // 30 days
            
            // Store token in database (you might want to create a remember_tokens table)
        }
    }
    
    /**
     * Log user activity
     */
    private function logActivity($userId, $action, $details = []) {
        try {
            // Create activity_logs table if it doesn't exist
            $sql = "CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(50) NOT NULL,
                details JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_action (action),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            
            $this->db->execute($sql);
            
            // Insert activity log
            $sql = "INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) 
                    VALUES (?, ?, ?, ?, ?)";
            
            $params = [
                $userId,
                $action,
                json_encode($details),
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null
            ];
            
            $this->db->insert($sql, $params);
            
        } catch (Exception $e) {
            error_log('Activity logging error: ' . $e->getMessage());
        }
    }
    
    /**
     * Require authentication for protected pages
     */
    public function requireAuth($redirectUrl = 'login.html') {
        if (!$this->isLoggedIn()) {
            header("Location: $redirectUrl");
            exit();
        }
    }
    
    /**
     * Require specific role
     */
    public function requireRole($role, $redirectUrl = 'unauthorized.html') {
        $this->requireAuth();
        
        if (!$this->hasRole($role)) {
            header("Location: $redirectUrl");
            exit();
        }
    }
    
    /**
     * Generate CSRF token
     */
    public function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Verify CSRF token
     */
    public function verifyCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}
?>