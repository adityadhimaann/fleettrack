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

// Function to safely update element text content
function safeUpdateTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Function to safely add event listener
function safeAddEventListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, callback);
    }
}

// Initialize dashboard stats
safeUpdateTextContent('totalVehicles', '12');
safeUpdateTextContent('activeDrivers', '10');
safeUpdateTextContent('totalDistance', '15,480 mi');
safeUpdateTextContent('maintenanceAlerts', '2');

// Populate vehicles table
const vehiclesTableBody = document.getElementById('vehiclesTableBody');
if (vehiclesTableBody) {
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
}

// Initialize Charts safely
function initializeCharts() {
    const fuelChartElement = document.getElementById('fuelChart');
    if (fuelChartElement) {
        const ctx1 = fuelChartElement.getContext('2d');
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
    }

    const mileageChartElement = document.getElementById('mileageChart');
    if (mileageChartElement) {
        const ctx2 = mileageChartElement.getContext('2d');
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
    }
}

// Try to initialize charts
try {
    initializeCharts();
} catch (error) {
    console.error("Error initializing charts:", error);
}

// Navigation handling
// Removed 'home' from contentSections if there's no homeBtn and homeContent
const contentSections = ['dashboard', 'vehicles', 'drivers', 'tracking', 'maintenance', 'fuel', 'reports', 'settings'];

function showContent(contentId) {
    // Validate contentId is in our list of sections
    if (!contentSections.includes(contentId)) {
        console.error(`Invalid content ID: ${contentId}`);
        return;
    }
    
    // Hide all content sections
    contentSections.forEach(section => {
        const sectionElement = document.getElementById(`${section}Content`);
        if (sectionElement) {
            sectionElement.classList.add('hidden');
        }
    });
    
    // Show selected content
    const selectedContent = document.getElementById(`${contentId}Content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    } else {
        console.error(`Content element not found: ${contentId}Content`);
        return;
    }
    
    // Update page title
    safeUpdateTextContent('pageTitle', contentId.charAt(0).toUpperCase() + contentId.slice(1));
    
    // Update active state in navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
        link.classList.add('text-gray-300', 'hover:bg-gray-700');
    });
    
    const activeBtn = document.getElementById(`${contentId}Btn`);
    if (activeBtn) {
        activeBtn.classList.add('bg-gray-700', 'text-white');
        activeBtn.classList.remove('text-gray-300', 'hover:bg-gray-700');
    }
    
    // Close mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// Setup event listeners for navigation
contentSections.forEach(section => {
    safeAddEventListener(`${section}Btn`, 'click', () => showContent(section));
});

// Mobile navigation
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        if (page) {
            showContent(page);
        }
    });
});

// Mobile menu toggle
safeAddEventListener('menuBtn', 'click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('hidden');
    }
});

safeAddEventListener('closeMenuBtn', 'click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
});

// User dropdown toggle
safeAddEventListener('userMenuBtn', 'click', () => {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
});

// Notification panel toggle
safeAddEventListener('notificationBtn', 'click', () => {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.toggle('hidden');
    }
});

safeAddEventListener('closeNotifications', 'click', () => {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.add('hidden');
    }
});

// Add vehicle modal
safeAddEventListener('addVehicleBtn', 'click', () => {
    const addVehicleModal = document.getElementById('addVehicleModal');
    if (addVehicleModal) {
        addVehicleModal.classList.remove('hidden');
    }
});

safeAddEventListener('closeVehicleModalBtn', 'click', () => {
    const addVehicleModal = document.getElementById('addVehicleModal');
    if (addVehicleModal) {
        addVehicleModal.classList.add('hidden');
    }
});

safeAddEventListener('saveVehicleBtn', 'click', () => {
    // Here would go the logic to save the new vehicle
    const addVehicleModal = document.getElementById('addVehicleModal');
    if (addVehicleModal) {
        addVehicleModal.classList.add('hidden');
    }
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
document.addEventListener('DOMContentLoaded', function() {
    // Try to show dashboard, fallback to first available section if dashboard isn't available
    try {
        showContent('dashboard');
    } catch (error) {
        console.error("Failed to initialize dashboard view:", error);
        for (const section of contentSections) {
            const sectionElement = document.getElementById(`${section}Content`);
            if (sectionElement) {
                showContent(section);
                break;
            }
        }
    }
});

// Initialize event listeners for search and filter interactions
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
        // Search functionality would go here
        console.log('Searching for:', e.target.value);
    });
}

// Event listener for window click to close dropdowns
window.addEventListener('click', function(event) {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown && 
        !event.target.matches('#userMenuBtn') && 
        !event.target.closest('#userDropdown')) {
        if (!userDropdown.classList.contains('hidden')) {
            userDropdown.classList.add('hidden');
        }
    }
    
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    
    if (notificationBtn && notificationPanel && 
        !event.target.matches('#notificationBtn') && 
        !event.target.closest('#notificationPanel')) {
        if (!notificationPanel.classList.contains('hidden')) {
            notificationPanel.classList.add('hidden');
        }
    }
});

// Set up refresh buttons functionality
const refreshButtons = document.querySelectorAll('.refresh-btn');
refreshButtons.forEach(button => {
    button.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        if (section) {
            console.log(`Refreshing ${section} section`);
            // Refresh logic for each section would go here
        }
    });
});
// First, add the home content div to your HTML if it doesn't exist
// This function will be called when the script loads
function ensureHomeContentExists() {
    if (!document.getElementById('homeContent')) {
        const mainContentArea = document.querySelector('.flex-1.flex.flex-col.overflow-y-auto');
        if (mainContentArea) {
            const homeContentDiv = document.createElement('div');
            homeContentDiv.id = 'homeContent';
            homeContentDiv.className = 'hidden';
            
            // Create the home page content
            homeContentDiv.innerHTML = `
                <div class="py-6">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 class="text-3xl font-bold text-gray-900">Fleet Management Home</h1>
                    </div>
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <!-- Welcome Section -->
                        <div class="bg-white shadow rounded-lg p-6 mt-6">
                            <div class="flex items-center">
                                <div class="bg-blue-500 rounded-full p-3">
                                    <i class="fas fa-truck text-white text-xl"></i>
                                </div>
                                <div class="ml-4">
                                    <h2 class="text-2xl font-semibold text-gray-800">Welcome to Fleet Management System</h2>
                                    <p class="text-gray-600 mt-1">Manage your vehicles, drivers, and operations efficiently</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="mt-8">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
                                    <div class="flex items-center">
                                        <div class="bg-green-100 rounded-full p-3">
                                            <i class="fas fa-plus text-green-600"></i>
                                        </div>
                                        <h3 class="ml-3 text-lg font-medium text-gray-800">Add New Vehicle</h3>
                                    </div>
                                    <p class="mt-2 text-sm text-gray-600">Register a new vehicle to your fleet</p>
                                    <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full">Add Vehicle</button>
                                </div>
                                
                                <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
                                    <div class="flex items-center">
                                        <div class="bg-blue-100 rounded-full p-3">
                                            <i class="fas fa-user-plus text-blue-600"></i>
                                        </div>
                                        <h3 class="ml-3 text-lg font-medium text-gray-800">Add New Driver</h3>
                                    </div>
                                    <p class="mt-2 text-sm text-gray-600">Add a new driver to your team</p>
                                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 w-full">Add Driver</button>
                                </div>
                                
                                <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
                                    <div class="flex items-center">
                                        <div class="bg-purple-100 rounded-full p-3">
                                            <i class="fas fa-route text-purple-600"></i>
                                        </div>
                                        <h3 class="ml-3 text-lg font-medium text-gray-800">Plan Route</h3>
                                    </div>
                                    <p class="mt-2 text-sm text-gray-600">Create and optimize delivery routes</p>
                                    <button class="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300 w-full">Plan Route</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div class="mt-8">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                            <div class="bg-white shadow rounded-lg overflow-hidden">
                                <ul class="divide-y divide-gray-200">
                                    <li class="px-6 py-4 flex items-center">
                                        <div class="bg-blue-100 rounded-full p-2">
                                            <i class="fas fa-truck text-blue-600"></i>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900">Truck 101 completed delivery</p>
                                            <p class="text-sm text-gray-500">30 minutes ago</p>
                                        </div>
                                    </li>
                                    <li class="px-6 py-4 flex items-center">
                                        <div class="bg-yellow-100 rounded-full p-2">
                                            <i class="fas fa-gas-pump text-yellow-600"></i>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900">Van 202 refueled</p>
                                            <p class="text-sm text-gray-500">1 hour ago</p>
                                        </div>
                                    </li>
                                    <li class="px-6 py-4 flex items-center">
                                        <div class="bg-red-100 rounded-full p-2">
                                            <i class="fas fa-exclamation-triangle text-red-600"></i>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900">Maintenance alert for Truck 303</p>
                                            <p class="text-sm text-gray-500">2 hours ago</p>
                                        </div>
                                    </li>
                                    <li class="px-6 py-4 flex items-center">
                                        <div class="bg-green-100 rounded-full p-2">
                                            <i class="fas fa-user-check text-green-600"></i>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900">Sarah Wilson started shift</p>
                                            <p class="text-sm text-gray-500">3 hours ago</p>
                                        </div>
                                    </li>
                                </ul>
                                <div class="bg-gray-50 px-6 py-3">
                                    <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">View all activity</a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Fleet Overview -->
                        <div class="mt-8">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Fleet Overview</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-white shadow rounded-lg p-6">
                                    <h3 class="text-lg font-medium text-gray-800 mb-4">Vehicle Status</h3>
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm text-gray-600">Active</span>
                                        <span class="text-sm font-medium text-gray-900">10 vehicles</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-green-500 h-2.5 rounded-full" style="width: 83%"></div>
                                    </div>
                                    
                                    <div class="flex justify-between items-center mb-2 mt-4">
                                        <span class="text-sm text-gray-600">Maintenance</span>
                                        <span class="text-sm font-medium text-gray-900">2 vehicles</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 17%"></div>
                                    </div>
                                </div>
                                
                                <div class="bg-white shadow rounded-lg p-6">
                                    <h3 class="text-lg font-medium text-gray-800 mb-4">Driver Assignments</h3>
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm text-gray-600">Assigned</span>
                                        <span class="text-sm font-medium text-gray-900">10 drivers</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-blue-500 h-2.5 rounded-full" style="width: 83%"></div>
                                    </div>
                                    
                                    <div class="flex justify-between items-center mb-2 mt-4">
                                        <span class="text-sm text-gray-600">Unassigned</span>
                                        <span class="text-sm font-medium text-gray-900">2 drivers</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-gray-500 h-2.5 rounded-full" style="width: 17%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            mainContentArea.appendChild(homeContentDiv);
        }
    }
}

// Add 'home' to content sections if it's not already there
function updateContentSections() {
    // This assumes contentSections is a global variable in your existing code
    if (typeof contentSections !== 'undefined') {
        if (!contentSections.includes('home')) {
            contentSections.unshift('home');
        }
    } else {
        // Define contentSections if it doesn't exist
        window.contentSections = ['home', 'dashboard', 'vehicles', 'drivers', 'tracking', 'maintenance', 'fuel', 'reports', 'settings'];
    }
}

// Update the showContent function to handle the home button
function setupHomeButton() {
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showContent('home');
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ensureHomeContentExists();
    updateContentSections();
    setupHomeButton();
});