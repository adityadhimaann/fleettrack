<?php
require_once __DIR__ . '/../config.php';

/**
 * Enhanced Database Class with Security and Performance Features
 */
class Database {
    private static $instance = null;
    private $connection;
    private $transactionLevel = 0;
    
    private function __construct() {
        $this->connect();
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Establish database connection
     */
    private function connect() {
        try {
            $this->connection = new PDO(
                DatabaseConfig::getDSN(),
                DatabaseConfig::USERNAME,
                DatabaseConfig::PASSWORD,
                DatabaseConfig::getOptions()
            );
        } catch (PDOException $e) {
            $this->logError('Database connection failed: ' . $e->getMessage());
            throw new Exception('Database connection failed. Please try again later.');
        }
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Execute prepared statement with parameters
     */
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this->logError('Query execution failed: ' . $e->getMessage() . ' SQL: ' . $sql);
            throw new Exception('Database query failed. Please try again later.');
        }
    }
    
    /**
     * Fetch single row
     */
    public function fetchOne($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetch();
    }
    
    /**
     * Fetch multiple rows
     */
    public function fetchAll($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * Insert record and return last insert ID
     */
    public function insert($sql, $params = []) {
        $this->execute($sql, $params);
        return $this->connection->lastInsertId();
    }
    
    /**
     * Update/Delete and return affected rows
     */
    public function modify($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt->rowCount();
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction() {
        if ($this->transactionLevel === 0) {
            $this->connection->beginTransaction();
        }
        $this->transactionLevel++;
    }
    
    /**
     * Commit transaction
     */
    public function commit() {
        $this->transactionLevel--;
        if ($this->transactionLevel === 0) {
            $this->connection->commit();
        }
    }
    
    /**
     * Rollback transaction
     */
    public function rollback() {
        if ($this->transactionLevel > 0) {
            $this->connection->rollback();
            $this->transactionLevel = 0;
        }
    }
    
    /**
     * Check if table exists
     */
    public function tableExists($tableName) {
        $sql = "SHOW TABLES LIKE ?";
        $result = $this->fetchOne($sql, [$tableName]);
        return $result !== false;
    }
    
    /**
     * Create tables if they don't exist
     */
    public function initializeTables() {
        $this->createUsersTable();
        $this->createVehiclesTable();
        $this->createDriversTable();
        $this->createMaintenanceTable();
        $this->createTripsTable();
    }
    
    private function createUsersTable() {
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            gender ENUM('m', 'f', 'o') NOT NULL,
            role ENUM('admin', 'manager', 'driver') DEFAULT 'driver',
            status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
            last_login TIMESTAMP NULL,
            failed_login_attempts INT DEFAULT 0,
            locked_until TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    private function createVehiclesTable() {
        $sql = "CREATE TABLE IF NOT EXISTS vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            vehicle_number VARCHAR(20) UNIQUE NOT NULL,
            vehicle_type ENUM('car', 'truck', 'van', 'motorcycle', 'bus') NOT NULL,
            model VARCHAR(100),
            year YEAR,
            fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') DEFAULT 'petrol',
            fuel_capacity DECIMAL(8,2),
            current_fuel_level DECIMAL(5,2) DEFAULT 100.00,
            mileage DECIMAL(10,2) DEFAULT 0.00,
            status ENUM('active', 'maintenance', 'inactive', 'retired') DEFAULT 'active',
            driver_id INT NULL,
            last_service_date DATE,
            next_service_date DATE,
            insurance_expiry DATE,
            registration_expiry DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
            INDEX idx_vehicle_number (vehicle_number),
            INDEX idx_status (status),
            INDEX idx_driver (driver_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    private function createDriversTable() {
        $sql = "CREATE TABLE IF NOT EXISTS driver_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            license_number VARCHAR(50) UNIQUE NOT NULL,
            license_expiry DATE NOT NULL,
            license_class VARCHAR(10),
            experience_years INT DEFAULT 0,
            emergency_contact VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_license (license_number),
            INDEX idx_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    private function createMaintenanceTable() {
        $sql = "CREATE TABLE IF NOT EXISTS maintenance_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT NOT NULL,
            maintenance_type ENUM('routine', 'repair', 'inspection', 'emergency') NOT NULL,
            description TEXT NOT NULL,
            cost DECIMAL(10,2),
            service_date DATE NOT NULL,
            next_service_date DATE,
            mechanic_name VARCHAR(100),
            status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
            INDEX idx_vehicle (vehicle_id),
            INDEX idx_service_date (service_date),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    private function createTripsTable() {
        $sql = "CREATE TABLE IF NOT EXISTS trips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT NOT NULL,
            driver_id INT NOT NULL,
            start_location VARCHAR(255) NOT NULL,
            end_location VARCHAR(255) NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NULL,
            distance DECIMAL(8,2),
            fuel_consumed DECIMAL(8,2),
            status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
            FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_vehicle (vehicle_id),
            INDEX idx_driver (driver_id),
            INDEX idx_status (status),
            INDEX idx_start_time (start_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $this->execute($sql);
    }
    
    /**
     * Log database errors
     */
    private function logError($message) {
        $logDir = __DIR__ . '/../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . '/database_errors.log';
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] $message" . PHP_EOL;
        file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Prevent cloning
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}
?>