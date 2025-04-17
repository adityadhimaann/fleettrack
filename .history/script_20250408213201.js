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
const contentSections = ['home','dashboard', 'vehicles', 'drivers', 'tracking', 'maintenance', 'fuel', 'reports', 'settings'];

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

// Initialize page to home view
document.addEventListener('DOMContentLoaded', function() {
    // First ensure home content exists
    const homeContent = document.getElementById('homeContent');
    if (!homeContent) {
        const main = document.querySelector('main');
        if (main) {
            const homeDiv = document.createElement('div');
            homeDiv.id = 'homeContent';
            homeDiv.className = 'hidden';
            homeDiv.innerHTML = `
                <header class="bg-blue-800 text-white p-5 shadow-md">
                    <h1 class="text-2xl font-bold">FleetTrack Dashboard</h1>
                </header>
                <section class="text-center py-20">
                    <h2 class="text-4xl font-semibold mb-4">Welcome to FleetTrack</h2>
                    <p class="text-lg mb-8 max-w-2xl mx-auto">
                        Monitor, manage, and maintain your vehicles in real-time with our intelligent fleet management system.
                    </p>
                    <div class="flex justify-center space-x-4">
                        <a href="#" id="vehiclesQuickBtn" class="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg">
                            View Vehicles
                        </a>
                        <a href="#" id="reportsQuickBtn" class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md text-lg">
                            Generate Reports
                        </a>
                    </div>
                </section>
            `;
            main.prepend(homeDiv);
        }
    }

    // Add home to content sections if not already present
    if (!contentSections.includes('home')) {
        contentSections.unshift('home');
    }

    // Setup home button click handler
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showContent('home');
        });
    }

    // Show home content by default
    showContent('home');
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
const addVehicleBtn1 = document.getElementById('addVehicleBtn1');
    const modal = document.getElementById('addVehicleModal1');
    const closeModalBtn1 = document.getElementById('closeModalBtn1');
    const vehicleForm = document.getElementById('vehicleForm');
    const responseMsg = document.getElementById('responseMsg');

    // Show modal on button click
    addVehicleBtn1.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Close modal on "×" button click
    closeModalBtn1.addEventListener('click', () => {
        modal.classList.add('hidden');
        responseMsg.textContent = ''; // Clear any message
    });

    // Optional: close modal by clicking outside the modal box
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            responseMsg.textContent = '';
        }
    });

    // Form submit via AJAX to PHP
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(vehicleForm);
        const res = await fetch('add_vehicle.php', {
            method: 'POST',
            body: formData
        });

        const text = await res.text();

        if (text.trim() === 'success') {
            responseMsg.textContent = 'Vehicle added successfully!';
            responseMsg.className = 'mt-2 text-green-600 text-sm';
            vehicleForm.reset();

            setTimeout(() => {
                modal.classList.add('hidden');
                responseMsg.textContent = '';
            }, 1000);
        } else {
            responseMsg.textContent = text;
            responseMsg.className = 'mt-2 text-red-600 text-sm';
        }
    });