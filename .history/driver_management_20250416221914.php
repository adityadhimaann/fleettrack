<?php
// Database configuration
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "fleetdb";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) !== TRUE) {
    die("Error creating database: " . $conn->error);
}

// Select the database
$conn->select_db($dbname);

// Create drivers table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS drivers (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    license_number VARCHAR(20) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) !== TRUE) {
    die("Error creating table: " . $conn->error);
}

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['action'])) {
        if ($_POST['action'] == 'add') {
            // Add new driver
            $name = $conn->real_escape_string($_POST['name']);
            $license = $conn->real_escape_string($_POST['license']);
            $contact = $conn->real_escape_string($_POST['contact']);
            $status = $conn->real_escape_string($_POST['status']);
            
            $sql = "INSERT INTO drivers (name, license_number, contact, status) 
                    VALUES ('$name', '$license', '$contact', '$status')";
            
            if ($conn->query($sql) === TRUE) {
                $success_message = "New driver added successfully";
            } else {
                $error_message = "Error: " . $sql . "<br>" . $conn->error;
            }
        } elseif ($_POST['action'] == 'edit') {
            // Update existing driver
            $id = $conn->real_escape_string($_POST['id']);
            $name = $conn->real_escape_string($_POST['name']);
            $license = $conn->real_escape_string($_POST['license']);
            $contact = $conn->real_escape_string($_POST['contact']);
            $status = $conn->real_escape_string($_POST['status']);
            
            $sql = "UPDATE drivers SET 
                    name='$name', 
                    license_number='$license', 
                    contact='$contact', 
                    status='$status' 
                    WHERE id=$id";
            
            if ($conn->query($sql) === TRUE) {
                $success_message = "Driver updated successfully";
            } else {
                $error_message = "Error updating record: " . $conn->error;
            }
        } elseif ($_POST['action'] == 'delete') {
            // Delete driver
            $id = $conn->real_escape_string($_POST['id']);
            
            $sql = "DELETE FROM drivers WHERE id=$id";
            
            if ($conn->query($sql) === TRUE) {
                $success_message = "Driver deleted successfully";
            } else {
                $error_message = "Error deleting record: " . $conn->error;
            }
        }
    }
}

// Fetch all drivers
$sql = "SELECT * FROM drivers ORDER BY name ASC";
$result = $conn->query($sql);
$drivers = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $drivers[] = $row;
    }
}

// Get driver data for editing
$edit_driver = null;
if (isset($_GET['edit']) && is_numeric($_GET['edit'])) {
    $edit_id = $conn->real_escape_string($_GET['edit']);
    $sql = "SELECT * FROM drivers WHERE id=$edit_id";
    $result = $conn->query($sql);
    
    if ($result->num_rows == 1) {
        $edit_driver = $result->fetch_assoc();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fleet Management - Drivers</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto py-8 px-4">
        <div id="driversContent">
            <div class="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 class="text-2xl font-semibold text-gray-800 mb-6">Drivers Management</h1>
                <p class="text-gray-500 mb-6">Manage your fleet drivers efficiently. Add, edit, or remove driver details below.</p>

                <?php if(isset($success_message)): ?>
                <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                    <p><?php echo $success_message; ?></p>
                </div>
                <?php endif; ?>

                <?php if(isset($error_message)): ?>
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p><?php echo $error_message; ?></p>
                </div>
                <?php endif; ?>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <?php if(count($drivers) > 0): ?>
                                <?php foreach($drivers as $driver): ?>
                                    <tr class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><?php echo htmlspecialchars($driver['name']); ?></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><?php echo htmlspecialchars($driver['license_number']); ?></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><?php echo htmlspecialchars($driver['contact']); ?></td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <?php if($driver['status'] == 'Active'): ?>
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                            <?php elseif($driver['status'] == 'On Leave'): ?>
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">On Leave</span>
                                            <?php else: ?>
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <a href="?edit=<?php echo $driver['id']; ?>" class="text-blue-600 hover:text-blue-900 transition" aria-label="Edit driver">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form method="POST" action="" class="inline">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $driver['id']; ?>">
                                                <button type="submit" class="text-red-600 hover:text-red-900 transition" aria-label="Delete driver" onclick="return confirm('Are you sure you want to delete this driver?')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">No drivers found. Add your first driver below.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        <?php echo isset($edit_driver) ? 'Edit Driver' : 'Add New Driver'; ?>
                    </h2>
                    <form method="POST" action="" class="bg-gray-50 p-6 rounded-lg shadow space-y-4 max-w-lg">
                        <input type="hidden" name="action" value="<?php echo isset($edit_driver) ? 'edit' : 'add'; ?>">
                        <?php if(isset($edit_driver)): ?>
                            <input type="hidden" name="id" value="<?php echo $edit_driver['id']; ?>">
                        <?php endif; ?>
                        
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="name" name="name" placeholder="Driver Name" required
                                value="<?php echo isset($edit_driver) ? htmlspecialchars($edit_driver['name']) : ''; ?>"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label for="license" class="block text-sm font-medium text-gray-700">License Number</label>
                            <input type="text" id="license" name="license" placeholder="License Number" required
                                value="<?php echo isset($edit_driver) ? htmlspecialchars($edit_driver['license_number']) : ''; ?>"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label for="contact" class="block text-sm font-medium text-gray-700">Contact</label>
                            <input type="text" id="contact" name="contact" placeholder="Contact Number" required
                                value="<?php echo isset($edit_driver) ? htmlspecialchars($edit_driver['contact']) : ''; ?>"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                <option value="Active" <?php echo (isset($edit_driver) && $edit_driver['status'] == 'Active') ? 'selected' : ''; ?>>Active</option>
                                <option value="On Leave" <?php echo (isset($edit_driver) && $edit_driver['status'] == 'On Leave') ? 'selected' : ''; ?>>On Leave</option>
                                <option value="Inactive" <?php echo (isset($edit_driver) && $edit_driver['status'] == 'Inactive') ? 'selected' : ''; ?>>Inactive</option>
                            </select>
                        </div>
                        <div class="pt-4 flex space-x-3">
                            <button type="submit"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">
                                <i class="fas fa-check mr-2"></i> <?php echo isset($edit_driver) ? 'Update Driver' : 'Save Driver'; ?>
                            </button>
                            <?php if(isset($edit_driver)): ?>
                                <a href="<?php echo $_SERVER['PHP_SELF']; ?>" 
                                   class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                    <i class="fas fa-times mr-2"></i> Cancel
                                </a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

<?php
// Close connection
$conn->close();
?>