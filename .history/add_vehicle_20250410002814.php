<?php
$connection = new mysqli("localhost", "root", "", "your_database");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $vehicle_name = $_POST['vehicle_name'];
  $vehicle_number = $_POST['vehicle_number'];
  $vehicle_type = $_POST['vehicle_type'];
  $status = $_POST['status'];

  $stmt = $connection->prepare("INSERT INTO vehicles (vehicle_name, vehicle_number, vehicle_type, status) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $vehicle_name, $vehicle_number, $vehicle_type, $status);
  $stmt->execute();
  $stmt->close();

  header("Location: vehicle_list.php");
  exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Add Vehicle</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
    <div class="bg-blue-600 px-6 py-5">
      <h2 class="text-2xl font-bold text-white flex items-center gap-2">
        <i class="fas fa-car-side"></i> Add New Vehicle
      </h2>
      <p class="text-blue-100 mt-1">Enter the details of the vehicle below</p>
    </div>

    <div class="p-8">
      <form method="POST" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
          <input name="vehicle_name" type="text" required class="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
          <input name="vehicle_number" type="text" required class="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <div class="flex gap-4">
            <label><input type="radio" name="vehicle_type" value="car" checked class="mr-2">Car</label>
            <label><input type="radio" name="vehicle_type" value="truck" class="mr-2">Truck</label>
            <label><input type="radio" name="vehicle_type" value="other" class="mr-2">Other</label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" required class="w-full p-3 border rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="in-maintenance">In Maintenance</option>
          </select>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 font-semibold">
          <i class="fas fa-plus mr-2"></i>Add Vehicle
        </button>
      </form>

      <div class="text-center mt-4">
        <a href="vehicle_list.php" class="text-blue-600 hover:text-blue-800 text-sm font-medium underline">Cancel and return to vehicle list</a>
      </div>
    </div>
  </div>
</body>
</html>
