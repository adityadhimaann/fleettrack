<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "fleetdb";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM vehicles ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FleetTrack - Vehicle List</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Vehicles Management</h1>
    <table class="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="py-3 px-5 text-left">ID</th>
          <th class="py-3 px-5 text-left">Type</th>
          <th class="py-3 px-5 text-left">Number</th>
          <th class="py-3 px-5 text-left">Status</th>
          <th class="py-3 px-5 text-left">Actions</th>
        </tr>
      </thead>
      <tbody class="text-gray-800 divide-y divide-gray-200">
        <?php if ($result->num_rows > 0): ?>
          <?php while($row = $result->fetch_assoc()): ?>
            <tr>
              <td class="py-3 px-5"><?= htmlspecialchars($row['id']) ?></td>
              <td class="py-3 px-5"><?= ucfirst(htmlspecialchars($row['vehicle_type'])) ?></td>
              <td class="py-3 px-5"><?= htmlspecialchars($row['vehicle_number']) ?></td>
              <td class="py-3 px-5">
                <?php if ($row['status'] == 'active'): ?>
                  <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                <?php elseif ($row['status'] == 'in-maintenance'): ?>
                  <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Maintenance</span>
                <?php else: ?>
                  <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Inactive</span>
                <?php endif; ?>
              </td>
              <td class="py-3 px-5">
                <a href="/Applications/XAMPP/xamppfiles/htdocs/tailwindcssproject/vehicle_list.php" class="text-blue-600 hover:underline mr-3">View</a>
                <a href="#" class="text-green-600 hover:underline mr-3">Edit</a>
                <a href="#" class="text-red-600 hover:underline">Delete</a>
              </td>
            </tr>
          <?php endwhile; ?>
        <?php else: ?>
          <tr>
            <td colspan="5" class="text-center py-6 text-gray-500">No vehicles found.</td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</body>
</html>

<?php $conn->close(); ?>
