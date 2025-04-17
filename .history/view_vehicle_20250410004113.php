<?php
$connection = new mysqli("localhost", "root", "", "vehi");
$id = $_GET['id'];
$result = $connection->query("SELECT * FROM vehicles WHERE id=$id");
$vehicle = $result->fetch_assoc();
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
    <h2 class="text-xl font-bold mb-4">Vehicle Details</h2>
    <p><strong>Name:</strong> <?= htmlspecialchars($vehicle['vehicle_name']) ?></p>
    <p><strong>Number:</strong> <?= htmlspecialchars($vehicle['vehicle_number']) ?></p>
    <p><strong>Type:</strong> <?= htmlspecialchars($vehicle['vehicle_type']) ?></p>
    <p><strong>Status:</strong> <?= htmlspecialchars($vehicle['status']) ?></p>
    <a href="http://localhost/tailwindcssproject/vehicle_list.php" class="mt-4 inline-block text-blue-600 hover:underline">← Back to list</a>
  </div>
</body>
</html>
