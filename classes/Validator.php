<?php
/**
 * Enhanced Validator Class for Input Validation and Sanitization
 */
class Validator {
    private $errors = [];
    private $data = [];
    
    public function __construct($data = []) {
        $this->data = $data;
    }
    
    /**
     * Validate required fields
     */
    public function required($field, $message = null) {
        if (!isset($this->data[$field]) || empty(trim($this->data[$field]))) {
            $this->addError($field, $message ?: ucfirst($field) . ' is required.');
        }
        return $this;
    }
    
    /**
     * Validate email format
     */
    public function email($field, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
                $this->addError($field, $message ?: 'Invalid email format.');
            }
        }
        return $this;
    }
    
    /**
     * Validate minimum length
     */
    public function minLength($field, $length, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $length) {
            $this->addError($field, $message ?: ucfirst($field) . " must be at least $length characters long.");
        }
        return $this;
    }
    
    /**
     * Validate maximum length
     */
    public function maxLength($field, $length, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $length) {
            $this->addError($field, $message ?: ucfirst($field) . " must not exceed $length characters.");
        }
        return $this;
    }
    
    /**
     * Validate numeric values
     */
    public function numeric($field, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!is_numeric($this->data[$field])) {
                $this->addError($field, $message ?: ucfirst($field) . ' must be a number.');
            }
        }
        return $this;
    }
    
    /**
     * Validate integer values
     */
    public function integer($field, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_INT)) {
                $this->addError($field, $message ?: ucfirst($field) . ' must be an integer.');
            }
        }
        return $this;
    }
    
    /**
     * Validate minimum value
     */
    public function min($field, $min, $message = null) {
        if (isset($this->data[$field]) && is_numeric($this->data[$field])) {
            if ($this->data[$field] < $min) {
                $this->addError($field, $message ?: ucfirst($field) . " must be at least $min.");
            }
        }
        return $this;
    }
    
    /**
     * Validate maximum value
     */
    public function max($field, $max, $message = null) {
        if (isset($this->data[$field]) && is_numeric($this->data[$field])) {
            if ($this->data[$field] > $max) {
                $this->addError($field, $message ?: ucfirst($field) . " must not exceed $max.");
            }
        }
        return $this;
    }
    
    /**
     * Validate phone number
     */
    public function phone($field, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            $phone = preg_replace('/\D/', '', $this->data[$field]);
            if (strlen($phone) < 10 || strlen($phone) > 15) {
                $this->addError($field, $message ?: 'Invalid phone number format.');
            }
        }
        return $this;
    }
    
    /**
     * Validate date format
     */
    public function date($field, $format = 'Y-m-d', $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            $date = DateTime::createFromFormat($format, $this->data[$field]);
            if (!$date || $date->format($format) !== $this->data[$field]) {
                $this->addError($field, $message ?: 'Invalid date format.');
            }
        }
        return $this;
    }
    
    /**
     * Validate URL format
     */
    public function url($field, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_URL)) {
                $this->addError($field, $message ?: 'Invalid URL format.');
            }
        }
        return $this;
    }
    
    /**
     * Validate against allowed values
     */
    public function in($field, $values, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!in_array($this->data[$field], $values)) {
                $this->addError($field, $message ?: ucfirst($field) . ' contains an invalid value.');
            }
        }
        return $this;
    }
    
    /**
     * Validate regex pattern
     */
    public function regex($field, $pattern, $message = null) {
        if (isset($this->data[$field]) && !empty($this->data[$field])) {
            if (!preg_match($pattern, $this->data[$field])) {
                $this->addError($field, $message ?: ucfirst($field) . ' format is invalid.');
            }
        }
        return $this;
    }
    
    /**
     * Validate file upload
     */
    public function file($field, $maxSize = null, $allowedTypes = [], $message = null) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES[$field];
            
            // Check for upload errors
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $this->addError($field, $message ?: 'File upload failed.');
                return $this;
            }
            
            // Check file size
            if ($maxSize && $file['size'] > $maxSize) {
                $this->addError($field, $message ?: 'File size exceeds maximum allowed size.');
                return $this;
            }
            
            // Check file type
            if (!empty($allowedTypes)) {
                $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                if (!in_array($fileExtension, $allowedTypes)) {
                    $this->addError($field, $message ?: 'File type not allowed.');
                }
            }
        }
        return $this;
    }
    
    /**
     * Custom validation with callback
     */
    public function custom($field, $callback, $message = null) {
        if (isset($this->data[$field])) {
            if (!call_user_func($callback, $this->data[$field])) {
                $this->addError($field, $message ?: ucfirst($field) . ' is invalid.');
            }
        }
        return $this;
    }
    
    /**
     * Add error message
     */
    private function addError($field, $message) {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }
    
    /**
     * Check if validation passed
     */
    public function passes() {
        return empty($this->errors);
    }
    
    /**
     * Check if validation failed
     */
    public function fails() {
        return !$this->passes();
    }
    
    /**
     * Get all errors
     */
    public function getErrors() {
        return $this->errors;
    }
    
    /**
     * Get first error for a field
     */
    public function getFirstError($field) {
        return isset($this->errors[$field]) ? $this->errors[$field][0] : null;
    }
    
    /**
     * Get all error messages as flat array
     */
    public function getAllErrorMessages() {
        $messages = [];
        foreach ($this->errors as $fieldErrors) {
            $messages = array_merge($messages, $fieldErrors);
        }
        return $messages;
    }
    
    /**
     * Sanitize input data
     */
    public static function sanitize($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Sanitize email
     */
    public static function sanitizeEmail($email) {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    }
    
    /**
     * Sanitize phone number
     */
    public static function sanitizePhone($phone) {
        return preg_replace('/\D/', '', $phone);
    }
    
    /**
     * Sanitize filename
     */
    public static function sanitizeFilename($filename) {
        return preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
    }
    
    /**
     * Generate secure random string
     */
    public static function generateRandomString($length = 32) {
        return bin2hex(random_bytes($length / 2));
    }
    
    /**
     * Validate password strength
     */
    public static function validatePasswordStrength($password, $minLength = 8) {
        $score = 0;
        $feedback = [];
        
        // Length check
        if (strlen($password) >= $minLength) {
            $score += 1;
        } else {
            $feedback[] = "Password must be at least $minLength characters long";
        }
        
        // Uppercase check
        if (preg_match('/[A-Z]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = "Password should contain at least one uppercase letter";
        }
        
        // Lowercase check
        if (preg_match('/[a-z]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = "Password should contain at least one lowercase letter";
        }
        
        // Number check
        if (preg_match('/\d/', $password)) {
            $score += 1;
        } else {
            $feedback[] = "Password should contain at least one number";
        }
        
        // Special character check
        if (preg_match('/[^a-zA-Z\d]/', $password)) {
            $score += 1;
        } else {
            $feedback[] = "Password should contain at least one special character";
        }
        
        return [
            'score' => $score,
            'strength' => $score < 3 ? 'weak' : ($score < 4 ? 'medium' : 'strong'),
            'feedback' => $feedback
        ];
    }
}
?>