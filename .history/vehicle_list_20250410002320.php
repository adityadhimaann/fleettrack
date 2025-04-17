<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vehicle List</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</head>

<body class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
  <!-- Header -->
  <div class="max-w-5xl mx-auto mb-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
      <i class="fas fa-list-ul text-blue-600"></i>
      Vehicle List
    </h1>
    <p class="text-gray-600">Below is a list of all vehicles in the system.</p>
  </div>

  <!-- Vehicle Table -->
  <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-gray-700">
        <thead class="bg-blue-600 text-white text-left">
          <tr>
            <th class="px-6 py-4">#</th>
            <th class="px-6 py-4">Vehicle Name</th>
            <th class="px-6 py-4">Vehicle Number</th>
            <th class="px-6 py-4">Type</th>
            <th class="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <?php
            // Example data (in practice you'd fetch this from a database)
            $vehicles = [
              ['name' => 'Honda City', 'number' => 'KA01AB1234', 'type' => 'Car', 'status' => 'Active'],
              ['name' => 'Tata Ace', 'number' => 'KA05CD5678', 'type' => 'Truck', 'status' => 'In Maintenance'],
              ['name' => 'Suzuki Swift', 'number' => 'MH12XY9999', 'type' => 'Car', 'status' => 'Inactive'],
            ];

            foreach ($vehicles as $index => $vehicle) {
              echo "<tr class='hover:bg-gray-50 transition'>
                      <td class='px-6 py-4 font-medium'>" . ($index + 1) . "</td>
                      <td class='px-6 py-4'>{$vehicle['name']}</td>
                      <td class='px-6 py-4'>{$vehicle['number']}</td>
                      <td class='px-6 py-4'>{$vehicle['type']}</td>
                      <td class='px-6 py-4'>
                        <span class='px-3 py-1 rounded-full text-xs font-semibold " .
                          ($vehicle['status'] == 'Active' ? 'bg-green-100 text-green-700' :
                          ($vehicle['status'] == 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700')) .
                        "'>{$vehicle['status']}</span>
                      </td>
                    </tr>";
            }
          ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add New Vehicle Button -->
  <div class="max-w-5xl mx-auto mt-6 text-right">
    <a href="/add_vehicle.php"
      class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition duration-200 shadow-md hover:shadow-lg">
      <i class="fas fa-plus mr-2"></i> Add New Vehicle
    </a>
  </div>
</body>
</html>
