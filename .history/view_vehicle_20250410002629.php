<?php
$connection = new mysqli("localhost", "root", "", "your_database");
$id = $_GET['id'];
$result = $connection->query("SELECT * FROM vehicles WHERE id=$id");
$vehicle = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>View Vehicle</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 bg-gray-100">
  <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-xl font-bold mb-4">Vehicle Details</h2>
    <p><strong>Name:</strong> <?= $vehicle['vehicle_name'] ?></p>
    <p><strong>Number:</strong> <?= $vehicle['vehicle_number'] ?></p>
    <p><strong>Type:</strong> <?= $vehicle['vehicle_type'] ?></p>
    <p><strong>Status:</strong> <?= $vehicle['status'] ?></p>
    <a href="vehicle_list.php" class="mt-4 inline-block text-blue-600 hover:underline">← Back to list</a>
  </div>
</body>
</html>
