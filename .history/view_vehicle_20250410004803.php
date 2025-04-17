<?php
// Initialize database connection
$connection = new mysqli("localhost", "root", "", "fleetdb");

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Check if ID is provided in the URL
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = $_GET['id'];
    
    // Use prepared statement to prevent SQL injection
    $stmt = $connection->prepare("SELECT * FROM vehicles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Check if vehicle exists
    if ($result->num_rows > 0) {
        $vehicle = $result->fetch_assoc();
    } else {
        // Vehicle not found
        $error = "Vehicle with ID $id not found";
    }
    $stmt->close();
} else {
    // No ID provided
    $error = "No vehicle ID provided";
}
$connection->close();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>View Vehicle</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
    <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <?php if (isset($error)): ?>
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p><?= htmlspecialchars($error) ?></p>
            </div>
        <?php else: ?>
            <h2 class="text-xl font-bold mb-4">Vehicle Details</h2>
            <p><strong>Name:</strong> <?= htmlspecialchars($vehicle['vehicle_name']) ?></p>
            <p><strong>Number:</strong> <?= htmlspecialchars($vehicle['vehicle_number']) ?></p>
            <p><strong>Type:</strong> <?= htmlspecialchars($vehicle['vehicle_type']) ?></p>
            <p><strong>Status:</strong> <?= htmlspecialchars($vehicle['status']) ?></p>
        <?php endif; ?>
        <a href="vehicle_list.php" class="mt-4 inline-block text-blue-600 hover:underline">← Back to list</a>
    </div>
</body>
</html>