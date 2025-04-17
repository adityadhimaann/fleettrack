<?php
$connection = new mysqli("localhost", "root", "", "your_database");
$id = $_GET['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['vehicle_name'];
  $number = $_POST['vehicle_number'];
  $type = $_POST['vehicle_type'];
  $status = $_POST['status'];

  $stmt = $connection->prepare("UPDATE vehicles SET vehicle_name=?, vehicle_number=?, vehicle_type=?, status=? WHERE id=?");
  $stmt->bind_param("ssssi", $name, $number, $type, $status, $id);
  $stmt->execute();
  header("Location: vehicle_list.php");
  exit;
}

$result = $connection->query("SELECT * FROM vehicles WHERE id=$id");
$vehicle = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Edit Vehicle</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 bg-gray-100">
  <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-xl font-bold mb-4">Edit Vehicle</h2>
    <form method="POST">
      <input class="w-full p-2 mb-2 border rounded" name="vehicle_name" value="<?= htmlspecialchars($vehicle['vehicle_name']) ?>" required />
      <input class="w-full p-2 mb-2 border rounded" name="vehicle_number" value="<?= htmlspecialchars($vehicle['vehicle_number']) ?>" required />
      <select class="w-full p-2 mb-2 border rounded" name="vehicle_type" required>
        <option <?= $vehicle['vehicle_type'] == 'car' ? 'selected' : '' ?>>car</option>
        <option <?= $vehicle['vehicle_type'] == 'truck' ? 'selected' : '' ?>>truck</option>
        <option <?= $vehicle['vehicle_type'] == 'other' ? 'selected' : '' ?>>other</option>
      </select>
      <select class="w-full p-2 mb-4 border rounded" name="status" required>
        <option <?= $vehicle['status'] == 'active' ? 'selected' : '' ?>>active</option>
        <option <?= $vehicle['status'] == 'inactive' ? 'selected' : '' ?>>inactive</option>
        <option <?= $vehicle['status'] == 'in-maintenance' ? 'selected' : '' ?>>in-maintenance</option>
      </select>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Save Changes</button>
    </form>
    <a href="http://localhost/tailwindcssproject/vehicle_list.php" class="block mt-4 text-blue-600 hover:underline">← Cancel</a>
  </div>
</body>
</html>
