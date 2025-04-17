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
// Sample data for the dashboard
const fleetData = {
    vehicles: [
        { id: "truck-101", name: "Truck 101", driver: "John Smith", status: "Active", location: "Chicago, IL", fuel: 85, lastUpdated: "10 min ago" },
        { id: "van-202", name: "Van 202", driver: "Mike Johnson", status: "Active", location: "Detroit, MI", fuel: 65, lastUpdated: "35 min ago" },
        { id: "truck-303", name: "Truck 303", driver: "Emily Davis", status: "Maintenance", location: "Service Center", fuel: 20, lastUpdated: "2 hrs ago" },
        { id: "truck-404", name: "Truck 404", driver: "Robert Wilson", status: "Active", location: "Indianapolis, IN", fuel: 45, lastUpdated: "1 hr ago" },
        { id: "van-505", name: "Van 505", driver: "Sarah Brown", status: "Active", location: "Columbus, OH", fuel: 92, lastUpdated: "30 min ago" },
        { id: "truck-606", name: "Truck 606", driver: "David Miller", status: "Inactive", location: "Warehouse", fuel: 100, lastUpdated: "1 day ago" },
        { id: "van-707", name: "Van 707", driver: "Lisa Jones", status: "Active", location: "Cincinnati, OH", fuel: 78, lastUpdated: "45 min ago" },
        { id: "truck-808", name: "Truck 808", driver: "James Lee", status: "Active", location: "St. Louis, MO", fuel: 55, lastUpdated: "1.5 hrs ago" },
        { id: "van-909", name: "Van 909", driver: "Amanda Garcia", status: "Inactive", location: "Garage", fuel: 30, lastUpdated: "2 days ago" },
        { id: "truck-1010", name: "Truck 1010", driver: "Kevin Taylor", status: "Maintenance", location: "Service Center", fuel: 10, lastUpdated: "1 day ago" },
        { id: "van-1111", name: "Van 1111", driver: "Patricia Martinez", status: "Active", location: "Cleveland, OH", fuel: 88, lastUpdated: "2 hrs ago" },
        { id: "truck-1212", name: "Truck 1212", driver: "Thomas Anderson", status: "Active", location: "Louisville, KY", fuel: 72, lastUpdated: "3 hrs ago" }
    ],
    stats: {
        totalVehicles: 12,
        activeDrivers: 8,
        totalDistance: "24,567 km",
        maintenanceAlerts: 2
    },
    fuelData: {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [4500, 5200, 4800, 5100, 4700, 5500],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [2800, 3100, 2900, 3000, 3200, 3400],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [800, 950, 900, 1000, 950, 700, 600],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [500, 550, 600, 580, 620, 450, 400],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        },
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [45000, 48000, 52000, 56000, 60000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [28000, 30000, 32000, 35000, 38000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        }
    },
    mileageData: {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [12500, 13200, 12800, 14100, 13700, 14500],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [1800, 2100, 2000, 2200, 2150, 1700, 1600],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        },
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [145000, 158000, 172000, 186000, 200000],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        }
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize Dashboard
function initializeDashboard() {
    // Update stats
    updateStats();
    
    // Initialize charts
    initializeCharts();
    
    // Populate vehicles table
    populateVehiclesTable();
}

// Update Stats Section
function updateStats() {
    document.getElementById('totalVehicles').textContent = fleetData.stats.totalVehicles;
    document.getElementById('activeDrivers').textContent = fleetData.stats.activeDrivers;
    document.getElementById('totalDistance').textContent = fleetData.stats.totalDistance;
    document.getElementById('maintenanceAlerts').textContent = fleetData.stats.maintenanceAlerts;
    document.getElementById('totalVehicleCount').textContent = fleetData.stats.totalVehicles;
}

// Initialize Charts
function initializeCharts() {
    // Fuel Chart
    const fuelChartCtx = document.getElementById('fuelChart').getContext('2d');
    window.fuelChart = new Chart(fuelChartCtx, {
        type: 'line',
        data: fleetData.fuelData.monthly,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumption (L)'
                    }
                }
            }
        }
    });
    
    // Sample data for the dashboard
const fleetData = {
    vehicles: [
        { id: "truck-101", name: "Truck 101", driver: "John Smith", status: "Active", location: "Chicago, IL", fuel: 85, lastUpdated: "10 min ago" },
        { id: "van-202", name: "Van 202", driver: "Mike Johnson", status: "Active", location: "Detroit, MI", fuel: 65, lastUpdated: "35 min ago" },
        { id: "truck-303", name: "Truck 303", driver: "Emily Davis", status: "Maintenance", location: "Service Center", fuel: 20, lastUpdated: "2 hrs ago" },
        { id: "truck-404", name: "Truck 404", driver: "Robert Wilson", status: "Active", location: "Indianapolis, IN", fuel: 45, lastUpdated: "1 hr ago" },
        { id: "van-505", name: "Van 505", driver: "Sarah Brown", status: "Active", location: "Columbus, OH", fuel: 92, lastUpdated: "30 min ago" },
        { id: "truck-606", name: "Truck 606", driver: "David Miller", status: "Inactive", location: "Warehouse", fuel: 100, lastUpdated: "1 day ago" },
        { id: "van-707", name: "Van 707", driver: "Lisa Jones", status: "Active", location: "Cincinnati, OH", fuel: 78, lastUpdated: "45 min ago" },
        { id: "truck-808", name: "Truck 808", driver: "James Lee", status: "Active", location: "St. Louis, MO", fuel: 55, lastUpdated: "1.5 hrs ago" },
        { id: "van-909", name: "Van 909", driver: "Amanda Garcia", status: "Inactive", location: "Garage", fuel: 30, lastUpdated: "2 days ago" },
        { id: "truck-1010", name: "Truck 1010", driver: "Kevin Taylor", status: "Maintenance", location: "Service Center", fuel: 10, lastUpdated: "1 day ago" },
        { id: "van-1111", name: "Van 1111", driver: "Patricia Martinez", status: "Active", location: "Cleveland, OH", fuel: 88, lastUpdated: "2 hrs ago" },
        { id: "truck-1212", name: "Truck 1212", driver: "Thomas Anderson", status: "Active", location: "Louisville, KY", fuel: 72, lastUpdated: "3 hrs ago" }
    ],
    stats: {
        totalVehicles: 12,
        activeDrivers: 8,
        totalDistance: "24,567 km",
        maintenanceAlerts: 2
    },
    fuelData: {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [4500, 5200, 4800, 5100, 4700, 5500],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [2800, 3100, 2900, 3000, 3200, 3400],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [800, 950, 900, 1000, 950, 700, 600],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [500, 550, 600, 580, 620, 450, 400],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        },
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Trucks',
                    data: [45000, 48000, 52000, 56000, 60000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                },
                {
                    label: 'Vans',
                    data: [28000, 30000, 32000, 35000, 38000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                }
            ]
        }
    },
    mileageData: {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [12500, 13200, 12800, 14100, 13700, 14500],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [1800, 2100, 2000, 2200, 2150, 1700, 1600],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        },
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
                {
                    label: 'Distance (km)',
                    data: [145000, 158000, 172000, 186000, 200000],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                }
            ]
        }
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize Dashboard
function initializeDashboard() {
    // Update stats
    updateStats();
    
    // Initialize charts
    initializeCharts();
    
    // Populate vehicles table
    populateVehiclesTable();
}

// Update Stats Section
function updateStats() {
    document.getElementById('totalVehicles').textContent = fleetData.stats.totalVehicles;
    document.getElementById('activeDrivers').textContent = fleetData.stats.activeDrivers;
    document.getElementById('totalDistance').textContent = fleetData.stats.totalDistance;
    document.getElementById('maintenanceAlerts').textContent = fleetData.stats.maintenanceAlerts;
    document.getElementById('totalVehicleCount').textContent = fleetData.stats.totalVehicles;
}

// Initialize Charts
function initializeCharts() {
    // Fuel Chart
    const fuelChartCtx = document.getElementById('fuelChart').getContext('2d');
    window.fuelChart = new Chart(fuelChartCtx, {
        type: 'line',
        data: fleetData.fuelData.monthly,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumption (L)'
                    }
                }
            }
        }
    });
    
    // Mileage Chart
    const mileageChartCtx = document.getElementById('mileageChart').getContext('2d');
    window.mileageChart = new Chart(mileageChartCtx, {
        type: 'bar',
        data: fleetData.mileageData.monthly,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Distance (km)'
                    }
                }
            }
        }
    });
}

// Populate Vehicles Table
function populateVehiclesTable(page = 1) {
    const tableBody = document.getElementById('vehiclesTableBody');
    tableBody.innerHTML = '';
    
    const itemsPerPage = 5;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVehicles = fleetData.vehicles.slice(startIndex, endIndex);
    
    paginatedVehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        
        // Status class based on vehicle status
        let statusClass = '';
        switch(vehicle.status) {
            case 'Active':
                statusClass = 'bg-green-100 text-green-800';
                break;
            case 'Inactive':
                statusClass = 'bg-gray-100 text-gray-800';
                break;
            case 'Maintenance':
                statusClass = 'bg-red-100 text-red-800';
                break;
        }
        
        // Fuel level class
        let fuelClass = '';
        if (vehicle.fuel > 70) {
            fuelClass = 'text-green-600';
        } else if (vehicle.fuel > 30) {
            fuelClass = 'text-yellow-600';
        } else {
            fuelClass = 'text-red-600';
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-${vehicle.name.toLowerCase().includes('truck') ? 'truck' : 'shuttle-van'} text-gray-600"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${vehicle.name}</div>
                        <div class="text-sm text-gray-500">ID: ${vehicle.id}</div>
                    </div>
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
                    <div class="w-24 bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${vehicle.fuel}%"></div>
                    </div>
                    <span class="ml-2 text-sm ${fuelClass}">${vehicle.fuel}%</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${vehicle.lastUpdated}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3 view-vehicle" data-id="${vehicle.id}">View</button>
                <button class="text-green-600 hover:text-green-900 mr-3 edit-vehicle" data-id="${vehicle.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 delete-vehicle" data-id="${vehicle.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update active page in pagination
    const paginationLinks = document.querySelectorAll('.pagination-page');
    paginationLinks.forEach(link => {
        if (parseInt(link.getAttribute('data-page')) === page) {
            link.classList.add('bg-blue-50', 'text-blue-600');
            link.classList.remove('bg-white', 'text-gray-700');
        } else {
            link.classList.remove('bg-blue-50', 'text-blue-600');
            link.classList.add('bg-white', 'text-gray-700');
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Chart period filters
    document.querySelectorAll('.fuel-filter').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateChartData(window.fuelChart, fleetData.fuelData[period]);
            
            // Update active state
            document.querySelectorAll('.fuel-filter').forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
            });
            this.classList.remove('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
            this.classList.add('bg-blue-600', 'text-white');
        });
    });
    
    document.querySelectorAll('.mileage-filter').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateChartData(window.mileageChart, fleetData.mileageData[period]);
            
            // Update active state
            document.querySelectorAll('.mileage-filter').forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
            });
            this.classList.remove('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
            this.classList.add('bg-blue-600', 'text-white');
        });
    });
    
    // Pagination
    document.querySelectorAll('.pagination-page').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            populateVehiclesTable(page);
        });
    });
    
    document.querySelector('.pagination-prev').addEventListener('click', function(e) {
        e.preventDefault();
        const activePage = document.querySelector('.pagination-page.bg-blue-50');
        const currentPage = parseInt(activePage.getAttribute('data-page'));
        if (currentPage > 1) {
            populateVehiclesTable(currentPage - 1);
        }
    });
    
    document.querySelector('.pagination-next').addEventListener('click', function(e) {
        e.preventDefault();
        const activePage = document.querySelector('.pagination-page.bg-blue-50');
        const currentPage = parseInt(activePage.getAttribute('data-page'));
        const totalPages = Math.ceil(fleetData.vehicles.length / 5);
        if (currentPage < totalPages) {
            populateVehiclesTable(currentPage + 1);
        }
    });
    
    // Button actions
    document.getElementById('addVehicleBtn').addEventListener('click', function() {
        alert('Add vehicle functionality will be implemented here');
    });
    
    document.getElementById('viewFullMapBtn').addEventListener('click', function() {
        alert('Full map view will be implemented here');
    });
    
    document.getElementById('viewAllActivityBtn').addEventListener('click', function() {
        alert('All activity view will be implemented here');
    });
    
    // Quick Tour button
    const quickTourBtn = document.querySelector('.bg-blue-600 + button');
    if (quickTourBtn) {
        quickTourBtn.addEventListener('click', function() {
            alert('Quick tour will be implemented here');
        });
    }
    
    // Vehicle action buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-vehicle')) {
            const vehicleId = e.target.getAttribute('data-id');
            alert(`View details for ${vehicleId}`);
        } else if (e.target.classList.contains('edit-vehicle')) {
            const vehicleId = e.target.getAttribute('data-id');
            alert(`Edit ${vehicleId}`);
        } else if (e.target.classList.contains('delete-vehicle')) {
            const vehicleId = e.target.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete ${vehicleId}?`)) {
                alert(`${vehicleId} deleted`);
            }
        }
    });
}

// Update Chart Data
function updateChartData(chart, newData) {
    chart.data.labels = newData.labels;
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data = newData.datasets[index].data;
    });
    chart.update();
}
