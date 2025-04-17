// Sample data for vehicles
const vehiclesData = [
    { id: "Truck 101", driver: "John Smith", status: "Active", location: "Chicago, IL", fuel: "80%", lastUpdated: "10 min ago" },
    { id: "Van 202", driver: "Mike Johnson", status: "Active", location: "Detroit, MI", fuel: "25%", lastUpdated: "35 min ago" },
    { id: "Truck 303", driver: "Unassigned", status: "Maintenance", location: "Indianapolis, IN", fuel: "60%", lastUpdated: "2 hrs ago" },
    { id: "Truck 404", driver: "Sarah Wilson", status: "Active", location: "Indianapolis, IN", fuel: "45%", lastUpdated: "1 hr ago" },
    { id: "Van 505", driver: "Alex Thompson", status: "Active", location: "Columbus, OH", fuel: "90%", lastUpdated: "30 min ago" }
];

// Sample data for detailed vehicles
const vehiclesDetailData = [
    { id: "Truck 101", type: "Truck", model: "Ford F-650", year: "2022", license: "TRK-101", status: "Active", driver: "John Smith" },
    { id: "Van 202", type: "Van", model: "Mercedes Sprinter", year: "2021", license: "VAN-202", status: "Active", driver: "Mike Johnson" },
    { id: "Truck 303", type: "Truck", model: "Volvo VNL", year: "2020", license: "TRK-303", status: "Maintenance", driver: "Unassigned" },
    { id: "Truck 404", type: "Truck", model: "Freightliner M2", year: "2022", license: "TRK-404", status: "Active", driver: "Sarah Wilson" },
    { id: "Van 505", type: "Van", model: "Ford Transit", year: "2023", license: "VAN-505", status: "Active", driver: "Alex Thompson" }
];

// Initialize dashboard stats
document.getElementById('totalVehicles').textContent = '12';
document.getElementById('activeDrivers').textContent = '10';
document.getElementById('totalDistance').textContent = '15,480 mi';
document.getElementById('maintenanceAlerts').textContent = '2';

// Populate vehicles table
const vehiclesTableBody = document.getElementById('vehiclesTableBody');
vehiclesData.forEach(vehicle => {
    const row = document.createElement('tr');
    const statusClass = vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const fuelClass = parseInt(vehicle.fuel) < 30 ? 'text-red-500' : 'text-green-500';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <i class="fas fa-truck text-gray-500 mr-2"></i>
                <div class="text-sm font-medium text-gray-900">${vehicle.id}</div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${vehicle.driver}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${vehicle.status}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${vehicle.location}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <i class="fas fa-gas-pump ${fuelClass} mr-2"></i>
                <div class="text-sm ${fuelClass}">${vehicle.fuel}</div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${vehicle.lastUpdated}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="#" class="text-blue-600 hover:text-blue-900 mr-3">View</a>
            <a href="#" class="text-blue-600 hover:text-blue-900">Edit</a>
        </td>
    `;
    vehiclesTableBody.appendChild(row);
});

// Initialize Charts
const ctx1 = document.getElementById('fuelChart').getContext('2d');
new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Fuel Consumption (gallons)',
            data: [450, 480, 460, 520, 490, 475],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctx2 = document.getElementById('mileageChart').getContext('2d');
new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Total Mileage',
            data: [2500, 2800, 2600, 3100, 2900, 3200],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Navigation handling
const contentSections = ['dashboard', 'vehicles', 'drivers', 'tracking', 'maintenance', 'fuel', 'reports', 'settings'];

function showContent(contentId) {
    // Hide all content sections
    contentSections.forEach(section => {
        document.getElementById(`${section}Content`).classList.add('hidden');
    });
    
    // Show selected content
    document.getElementById(`${contentId}Content`).classList.remove('hidden');
    
    // Update page title
    document.getElementById('pageTitle').textContent = contentId.charAt(0).toUpperCase() + contentId.slice(1);
    
    // Update active state in navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
        link.classList.add('text-gray-300', 'hover:bg-gray-700');
    });
    
    document.getElementById(`${contentId}Btn`).classList.add('bg-gray-700', 'text-white');
    document.getElementById(`${contentId}Btn`).classList.remove('text-gray-300', 'hover:bg-gray-700');
    
    // Close mobile menu
    document.getElementById('mobileMenu').classList.add('hidden');
}

// Setup event listeners for navigation
contentSections.forEach(section => {
    document.getElementById(`${section}Btn`).addEventListener('click', () => showContent(section));
});

// Mobile navigation
document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        showContent(item.getAttribute('data-page'));
    });
});

// Mobile menu toggle
document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('hidden');
});

document.getElementById('closeMenuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('hidden');
});

// User dropdown toggle
document.getElementById('userMenuBtn').addEventListener('click', () => {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('hidden');
});

// Notification panel toggle
document.getElementById('notificationBtn').addEventListener('click', () => {
    document.getElementById('notificationPanel').classList.toggle('hidden');
});

document.getElementById('closeNotifications').addEventListener('click', () => {
    document.getElementById('notificationPanel').classList.add('hidden');
});

// Add vehicle modal
document.getElementById('addVehicleBtn').addEventListener('click', () => {
    document.getElementById('addVehicleModal').classList.remove('hidden');
});

document.getElementById('closeVehicleModalBtn').addEventListener('click', () => {
    document.getElementById('addVehicleModal').classList.add('hidden');
});

document.getElementById('saveVehicleBtn').addEventListener('click', () => {
    // Here would go the logic to save the new vehicle
    document.getElementById('addVehicleModal').classList.add('hidden');
});

// Populate vehicles detail table
const vehiclesDetailTableBody = document.getElementById('vehiclesDetailTableBody');
if (vehiclesDetailTableBody) {
    vehiclesDetailData.forEach(vehicle => {
        const row = document.createElement('tr');
        const statusClass = vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vehicle.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.model}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.year}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.license}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${vehicle.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.driver}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" class="text-blue-600 hover:text-blue-900 mr-2">View</a>
                <a href="#" class="text-blue-600 hover:text-blue-900 mr-2">Edit</a>
                <a href="#" class="text-red-600 hover:text-red-900">Delete</a>
            </td>
        `;
        vehiclesDetailTableBody.appendChild(row);
    });
}

// Initialize page to dashboard view
showContent('dashboard');

// Initialize event listeners for search and filter interactions
document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
    // Search functionality would go here
    console.log('Searching for:', e.target.value);
});

// Event listener for window click to close dropdowns
window.addEventListener('click', function(event) {
    if (!event.target.matches('#userMenuBtn') && !event.target.closest('#userDropdown')) {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    }
    
    if (!event.target.matches('#notificationBtn') && !event.target.closest('#notificationPanel')) {
        const panel = document.getElementById('notificationPanel');
        if (!panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
    }
});

// Set up refresh buttons functionality
document.querySelectorAll('.refresh-btn').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        console.log(`Refreshing ${section} section`);
        // Refresh logic for each section would go here
    });
});