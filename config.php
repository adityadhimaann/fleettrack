<?php
/**
 * FleetTrack Configuration File
 * Centralized configuration for database and application settings
 */

// Prevent direct access
if (!defined('FLEETTRACK_CONFIG')) {
    define('FLEETTRACK_CONFIG', true);
}

// Environment Configuration
define('ENVIRONMENT', 'development'); // development, production

// Database Configuration
class DatabaseConfig {
    const HOST = 'localhost';
    const USERNAME = 'root';
    const PASSWORD = '';
    const DATABASE = 'fleettrack_db';
    const CHARSET = 'utf8mb4';
    
    public static function getDSN() {
        return sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            self::HOST,
            self::DATABASE,
            self::CHARSET
        );
    }
    
    public static function getOptions() {
        return [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . self::CHARSET
        ];
    }
}

// Application Configuration
class AppConfig {
    const APP_NAME = 'FleetTrack';
    const APP_VERSION = '2.0.0';
    const TIMEZONE = 'America/New_York';
    const SESSION_TIMEOUT = 3600; // 1 hour
    
    // Security Settings
    const PASSWORD_MIN_LENGTH = 8;
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 900; // 15 minutes
    
    // File Upload Settings
    const MAX_FILE_SIZE = 5242880; // 5MB
    const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
}

// Error Reporting Configuration
if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/error.log');
}

// Set timezone
date_default_timezone_set(AppConfig::TIMEZONE);

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

?>