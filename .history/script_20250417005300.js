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
const contentSections = ['home', 'dashboard', 'vehicles', 'drivers', 'tracking', 'maintenance', 'fuel', 'reports', 'settings'];

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
document.addEventListener('DOMContentLoaded', function () {
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
        homeBtn.addEventListener('click', function (e) {
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
    searchInput.addEventListener('keyup', function (e) {
        // Search functionality would go here
        console.log('Searching for:', e.target.value);
    });
}

// Event listener for window click to close dropdowns
window.addEventListener('click', function (event) {
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
    button.addEventListener('click', function () {
        const section = this.getAttribute('data-section');
        if (section) {
            console.log(`Refreshing ${section} section`);
            // Refresh logic for each section would go here
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
        console.error("jQuery is not loaded! Please include jQuery in your page.");
        return;
    }

    console.log("Script loaded. Setting up event handlers...");

    // Show form when button is clicked
    $("#addVehicleBtn1").on("click", function () {
        console.log("Add Vehicle button clicked");
        $("#addVehicleForm").removeClass("hidden");
        $("#addVehicleBtn1").addClass("hidden");
    });

    // Hide form when cancel is clicked
    $("#cancelBtn").on("click", function () {
        $("#addVehicleForm").addClass("hidden");
        $("#addVehicleBtn1").removeClass("hidden");
        resetForm();
    });

    // Handle form submission
    $("#vehicleForm").on("submit", function (e) {
        e.preventDefault();

        const vehicleName = $("#vehicle_name").val().trim();
        const vehicleNumber = $("#vehicle_number").val().trim();

        // Basic validation
        if (!vehicleName || !vehicleNumber) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        // Submit data via AJAX
        $.ajax({
            url: "add_vehicle.php",
            type: "POST",
            data: {
                vehicle_name: vehicleName,
                vehicle_number: vehicleNumber
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    showMessage("Vehicle added successfully!", "success");
                    resetForm();
                    // Hide form and show button after successful addition
                    setTimeout(function () {
                        $("#addVehicleForm").addClass("hidden");
                        $("#addVehicleBtn1").removeClass("hidden");
                        $("#messageArea").addClass("hidden");
                    }, 2000);
                } else {
                    showMessage("Error: " + response.message, "error");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                showMessage("Server error. Please try again later.", "error");
            }
        });
    });

    // Helper functions
    function resetForm() {
        $("#vehicleForm")[0].reset();
        $("#messageArea").addClass("hidden");
    }

    function showMessage(message, type) {
        const bgColor = type === "success" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700";

        $("#messageArea")
            .removeClass("hidden bg-green-100 bg-red-100 border-green-500 border-red-500 text-green-700 text-red-700")
            .addClass(bgColor)
            .html(`<div class="border-l-4 p-4 ${bgColor}">${message}</div>`)
            .removeClass("hidden");
    }

    console.log("Event handlers have been set up");
});

// Alternative vanilla JavaScript approach if jQuery is causing issues
document.addEventListener("DOMContentLoaded", function () {
    // Only use this if the jQuery approach isn't working
    if (typeof jQuery === 'undefined') {
        console.log("Using vanilla JavaScript as fallback");

        const addBtn = document.getElementById("addVehicleBtn1");
        const cancelBtn = document.getElementById("cancelBtn");
        const vehicleForm = document.getElementById("addVehicleForm");

        if (addBtn) {
            addBtn.addEventListener("click", function () {
                console.log("Button clicked (vanilla JS)");
                vehicleForm.classList.remove("hidden");
                addBtn.classList.add("hidden");
            });
        } else {
            console.error("Button with ID 'addVehicleBtn1' not found!");
        }

        if (cancelBtn) {
            cancelBtn.addEventListener("click", function () {
                vehicleForm.classList.add("hidden");
                addBtn.classList.remove("hidden");
                // Form reset would be implemented here
            });
        }
    }
});
// JavaScript for handling vehicle tracking and ride requests

// Function to simulate an API call with a delay
function mockApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000); // Simulate a 1-second delay
    });
}

// Mock function to simulate vehicle tracking
async function trackVehicle(vehicleName) {
    // Simulate an API call to get vehicle data
    const vehicleData = {
        name: vehicleName,
        lastUpdate: new Date().toLocaleString(),
        currentSpeed: Math.floor(Math.random() * 100), // Random speed for demo
        distanceTraveled: Math.floor(Math.random() * 500), // Random distance for demo
        fuelLevel: Math.floor(Math.random() * 100), // Random fuel level for demo
        engineStatus: Math.random() > 0.5 ? 'On' : 'Off',
        currentLocation: 'Latitude: 12.9716, Longitude: 77.5946', // Example coordinates
        driverName: 'John Doe'
    };

    // Show loading indicator
    document.getElementById('searchBtn').innerText = 'Loading...';
    document.getElementById('searchBtn').disabled = true;

    try {
        const data = await mockApiCall(vehicleData);
        // Update the UI with vehicle data
        document.getElementById('vehicleTitle').innerText = data.name;
        document.getElementById('lastUpdate').querySelector('span').innerText = data.lastUpdate;
        document.getElementById('currentSpeed').innerText = data.currentSpeed + ' km/h';
        document.getElementById('distanceTraveled').innerText = data.distanceTraveled + ' km';
        document.getElementById('fuelLevel').innerText = data.fuelLevel + '%';
        document.getElementById('engineStatus').innerText = data.engineStatus;
        document.getElementById('currentLocation').innerText = data.currentLocation;
        document.getElementById('driverName').innerText = data.driverName;

        // Show vehicle info section
        document.getElementById('vehicleInfo').classList.remove('hidden');
        document.getElementById('searchError').classList.add('hidden');

        // Simulate showing the map (you would integrate a mapping library here)
        showMap(data.currentLocation);
    } catch (error) {
        console.error("Error fetching vehicle data:", error);
        document.getElementById('searchError').classList.remove('hidden');
    } finally {
        // Reset button state
        document.getElementById('searchBtn').innerText = 'Search';
        document.getElementById('searchBtn').disabled = false;
    }
}

// Mock function to simulate showing the map
function showMap(location) {
    // Here you would integrate a mapping library like Google Maps or Leaflet
    console.log("Showing map for location:", location);
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', function () {
    const vehicleName = document.getElementById('vehicleName').value;
    if (vehicleName) {
        trackVehicle(vehicleName);
    } else {
        document.getElementById('searchError').classList.remove('hidden');
    }
});

// Event listener for the ride request button
document.getElementById('requestRideBtn').addEventListener('click', function () {
    const vehicleName = document.getElementById('vehicleName').value;
    if (vehicleName) {
        requestRide(vehicleName);
    } else {
        alert("Please search for a vehicle first.");
    }
});

// Mock function to simulate ride request
async function requestRide(vehicleName) {
    // Show loading indicator
    document.getElementById('requestRideBtn').innerText = 'Requesting...';
    document.getElementById('requestRideBtn').disabled = true;

    try {
        // Simulate an API call to request a ride
        const rideStatus = await mockApiCall("Ride requested for " + vehicleName + ". Waiting for driver confirmation...");

        // Update the ride status in the UI
        // Update the ride status in the UI
        document.getElementById('rideStatus').querySelector('span').innerText = rideStatus;
        document.getElementById('rideStatus').classList.remove('hidden');

        // Optionally, you can simulate further updates to the ride status
        setTimeout(() => {
            document.getElementById('rideStatus').querySelector('span').innerText = "Driver is on the way!";
        }, 3000); // Update after 3 seconds

    } catch (error) {
        console.error("Error requesting ride:", error);
        alert("There was an error requesting the ride. Please try again.");
    } finally {
        // Reset button state
        document.getElementById('requestRideBtn').innerText = 'Request Ride';
        document.getElementById('requestRideBtn').disabled = false;
    }
}

// Optional: Function to simulate real-time updates for vehicle tracking
function startRealTimeUpdates(vehicleName) {
    setInterval(() => {
        // Simulate fetching updated vehicle data
        const updatedData = {
            currentSpeed: Math.floor(Math.random() * 100),
            distanceTraveled: Math.floor(Math.random() * 500),
            fuelLevel: Math.floor(Math.random() * 100),
            engineStatus: Math.random() > 0.5 ? 'On' : 'Off',
            currentLocation: 'Latitude: 12.9716, Longitude: 77.5946' // Example coordinates
        };

        // Update the UI with the new data
        document.getElementById('currentSpeed').innerText = updatedData.currentSpeed + ' km/h';
        document.getElementById('distanceTraveled').innerText = updatedData.distanceTraveled + ' km';
        document.getElementById('fuelLevel').innerText = updatedData.fuelLevel + '%';
        document.getElementById('engineStatus').innerText = updatedData.engineStatus;
        document.getElementById('currentLocation').innerText = updatedData.currentLocation;

        // Optionally, update the map with the new location
        showMap(updatedData.currentLocation);
    }, 5000); // Update every 5 seconds
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', function () {
    const vehicleName = document.getElementById('vehicleName').value;
    if (vehicleName) {
        trackVehicle(vehicleName);
        startRealTimeUpdates(vehicleName); // Start real-time updates when tracking starts
    } else {
        document.getElementById('searchError').classList.remove('hidden');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Sample data
    const maintenanceRecords = [
        {
            id: '001',
            vehicleId: 'truck1',
            vehicleName: 'Delivery Truck 1 (DT-001)',
            serviceType: 'Oil Change',
            serviceTypeCategory: 'routine',
            status: 'completed',
            date: '2025-04-01',
            technician: 'Robert Chen',
            cost: 120.50,
            notes: 'Regular 10,000 mile service. Oil filter replaced, fluid levels checked.'
        },
        {
            id: '002',
            vehicleId: 'car1',
            vehicleName: 'Company Car 1 (CC-001)',
            serviceType: 'Tire Rotation',
            serviceTypeCategory: 'tire',
            status: 'completed',
            date: '2025-04-05',
            technician: 'Lisa Wong',
            cost: 85.00,
            notes: 'All tires rotated, pressure checked. Right rear tire showing wear.'
        },
        {
            id: '003',
            vehicleId: 'van1',
            vehicleName: 'Service Van 1 (SV-001)',
            serviceType: 'Brake Replacement',
            serviceTypeCategory: 'repair',
            status: 'in-progress',
            date: '2025-04-16',
            technician: 'Thomas Moore',
            cost: 420.75,
            notes: 'Front brake pads and rotors replacement. Possible issue with brake line.'
        },
        {
            id: '004',
            vehicleId: 'truck1',
            vehicleName: 'Delivery Truck 1 (DT-001)',
            serviceType: 'Annual Inspection',
            serviceTypeCategory: 'inspection',
            status: 'scheduled',
            date: '2025-04-22',
            technician: 'Robert Chen',
            cost: 250.00,
            notes: 'Full safety and emissions inspection required.'
        },
        {
            id: '005',
            vehicleId: 'car1',
            vehicleName: 'Company Car 1 (CC-001)',
            serviceType: 'Air Filter Replacement',
            serviceTypeCategory: 'routine',
            status: 'scheduled',
            date: '2025-04-28',
            technician: 'Lisa Wong',
            cost: 55.25,
            notes: 'Replace cabin and engine air filters.'
        },
        {
            id: '006',
            vehicleId: 'truck2',
            vehicleName: 'Delivery Truck 2 (DT-002)',
            serviceType: 'Transmission Service',
            serviceTypeCategory: 'repair',
            status: 'scheduled',
            date: '2025-05-03',
            technician: 'Thomas Moore',
            cost: 850.00,
            notes: 'Fluid flush and filter replacement.'
        },
        {
            id: '007',
            vehicleId: 'van1',
            vehicleName: 'Service Van 1 (SV-001)',
            serviceType: 'Battery Replacement',
            serviceTypeCategory: 'repair',
            status: 'overdue',
            date: '2025-04-10',
            technician: 'Robert Chen',
            cost: 180.00,
            notes: 'Replace battery and check alternator performance.'
        }
    ];

    const vehicles = [
        { id: 'truck1', name: 'Delivery Truck 1', fullId: 'DT-001' },
        { id: 'car1', name: 'Company Car 1', fullId: 'CC-001' },
        { id: 'van1', name: 'Service Van 1', fullId: 'SV-001' },
        { id: 'truck2', name: 'Delivery Truck 2', fullId: 'DT-002' },
        { id: 'car2', name: 'Company Car 2', fullId: 'CC-002' },
        { id: 'van2', name: 'Service Van 2', fullId: 'SV-002' }
    ];

    const technicians = [
        { id: 'tech1', name: 'Robert Chen' },
        { id: 'tech2', name: 'Lisa Wong' },
        { id: 'tech3', name: 'Thomas Moore' },
        { id: 'tech4', name: 'Sarah Johnson' }
    ];

    // Populate vehicle dropdowns
    function populateVehicleDropdowns() {
        const dropdowns = ['vehicleSelect', 'historyVehicleSelect'];

        dropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;

            vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.name} (${vehicle.fullId})`;
                dropdown.appendChild(option);
            });
        });
    }

    // Populate technician dropdown
    function populateTechnicianDropdown() {
        const dropdown = document.getElementById('technician');
        if (!dropdown) return;

        technicians.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech.id;
            option.textContent = tech.name;
            dropdown.appendChild(option);
        });
    }

    // Update maintenance stats
    function updateMaintenanceStats() {
        document.getElementById('upcomingCount').textContent = maintenanceRecords.filter(r => r.status === 'scheduled').length;
        document.getElementById('inProgressCount').textContent = maintenanceRecords.filter(r => r.status === 'in-progress').length;
        document.getElementById('completedCount').textContent = maintenanceRecords.filter(r => r.status === 'completed').length;
        document.getElementById('overdueCount').textContent = maintenanceRecords.filter(r => r.status === 'overdue').length;
    }

    // Populate maintenance table
    function populateMaintenanceTable(records) {
        const tableBody = document.getElementById('maintenanceTableBody');
        tableBody.innerHTML = '';

        if (records.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No maintenance records found
                  </td>
                `;
            tableBody.appendChild(emptyRow);
            return;
        }

        records.forEach(record => {
            const row = document.createElement('tr');

            // Define status style
            let statusStyle = '';
            switch (record.status) {
                case 'completed':
                    statusStyle = 'bg-green-100 text-green-800';
                    break;
                case 'in-progress':
                    statusStyle = 'bg-yellow-100 text-yellow-800';
                    break;
                case 'scheduled':
                    statusStyle = 'bg-blue-100 text-blue-800';
                    break;
                case 'overdue':
                    statusStyle = 'bg-red-100 text-red-800';
                    break;
            }

            row.innerHTML = `
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">${record.vehicleName}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    ${record.serviceType}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle}">
                      ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    ${formatDate(record.date)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    ${record.technician}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    $${record.cost.toFixed(2)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 view-details" data-id="${record.id}">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-gray-600 hover:text-gray-900 mr-3 edit-record" data-id="${record.id}">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-record" data-id="${record.id}">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                `;

            tableBody.appendChild(row);
        });

        // Add click event listeners to action buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function () {
                const recordId = this.getAttribute('data-id');
                alert(`View details for record ${recordId}`);
                // Implement view details functionality
            });
        });

        document.querySelectorAll('.edit-record').forEach(btn => {
            btn.addEventListener('click', function () {
                const recordId = this.getAttribute('data-id');
                alert(`Edit record ${recordId}`);
                // Implement edit record functionality
            });
        });

        document.querySelectorAll('.delete-record').forEach(btn => {
            btn.addEventListener('click', function () {
                const recordId = this.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete maintenance record ${recordId}?`)) {
                    alert(`Record ${recordId} deleted`);
                    // Implement delete record functionality
                }
            });
        });
    }

    // Filter maintenance records
    function filterMaintenanceRecords() {
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchTerm = document.getElementById('maintenanceSearch').value.toLowerCase();

        let filteredRecords = [...maintenanceRecords];

        if (statusFilter !== 'all') {
            filteredRecords = filteredRecords.filter(record => record.status === statusFilter);
        }

        if (typeFilter !== 'all') {
            filteredRecords = filteredRecords.filter(record => record.serviceTypeCategory === typeFilter);
        }

        if (searchTerm) {
            filteredRecords = filteredRecords.filter(record =>
                record.vehicleName.toLowerCase().includes(searchTerm) ||
                record.serviceType.toLowerCase().includes(searchTerm) ||
                record.technician.toLowerCase().includes(searchTerm)
            );
        }

        // Update records showing count
        document.getElementById('recordsShowing').textContent = `1-${Math.min(filteredRecords.length, 10)}`;
        document.getElementById('totalRecords').textContent = filteredRecords.length;

        populateMaintenanceTable(filteredRecords);
    }

    // Setup service history view
    function setupServiceHistory() {
        document.getElementById('viewHistoryBtn').addEventListener('click', function () {
            const vehicleId = document.getElementById('historyVehicleSelect').value;

            if (!vehicleId) {
                alert('Please select a vehicle');
                return;
            }

            const vehicle = vehicles.find(v => v.id === vehicleId);
            const vehicleRecords = maintenanceRecords.filter(r => r.vehicleId === vehicleId);

            document.getElementById('serviceHistoryContainer').classList.remove('hidden');
            document.getElementById('serviceHistoryTitle').textContent = `Service History for ${vehicle.name} (${vehicle.fullId})`;

            // Populate timeline
            const timeline = document.getElementById('serviceHistoryTimeline');
            timeline.innerHTML = '';

            if (vehicleRecords.length === 0) {
                timeline.innerHTML = '<p class="text-gray-500">No service history available for this vehicle.</p>';
            } else {
                // Sort records by date, newest first
                vehicleRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

                vehicleRecords.forEach(record => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'relative';

                    // Define dot color based on status
                    let dotColor = 'bg-gray-400';
                    switch (record.status) {
                        case 'completed':
                            dotColor = 'bg-green-500';
                            break;
                        case 'in-progress':
                            dotColor = 'bg-yellow-500';
                            break;
                        case 'scheduled':
                            dotColor = 'bg-blue-500';
                            break;
                        case 'overdue':
                            dotColor = 'bg-red-500';
                            break;
                    }

                    timelineItem.innerHTML = `
                      <div class="absolute -left-6 mt-1">
                        <div class="h-4 w-4 rounded-full ${dotColor} border-2 border-white"></div>
                      </div>
                      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm ml-2">
                        <div class="flex justify-between">
                          <span class="font-medium text-gray-800">${record.serviceType}</span>
                          <span class="text-sm text-gray-500">${formatDate(record.date)}</span>
                        </div>
                        <p class="text-gray-600 text-sm mt-1">${record.notes || 'No additional notes'}</p>
                        <div class="flex justify-between mt-2 text-sm">
                          <span>Technician: ${record.technician}</span>
                          <span class="font-medium">Cost: $${record.cost.toFixed(2)}</span>
                        </div>
                      </div>
                    `;

                    timeline.appendChild(timelineItem);
                });

                // Update metrics
                const completedServices = vehicleRecords.filter(r => r.status === 'completed');
                const totalCost = completedServices.reduce((sum, record) => sum + record.cost, 0);
                const avgCost = completedServices.length ? totalCost / completedServices.length : 0;

                // Get current year services
                const currentYear = new Date().getFullYear();
                const servicesThisYear = completedServices.filter(r =>
                    new Date(r.date).getFullYear() === currentYear
                ).length;

                // Calculate days since last service
                const lastServiceDate = completedServices.length ? new Date(completedServices[0].date) : null;
                const daysSince = lastServiceDate ?
                    Math.floor((new Date() - lastServiceDate) / (1000 * 60 * 60 * 24)) : 'N/A';

                document.getElementById('totalCostYTD').textContent = `$${totalCost.toFixed(2)}`;
                document.getElementById('avgCostPerService').textContent = `$${avgCost.toFixed(2)}`;
                document.getElementById('servicesThisYear').textContent = servicesThisYear;
                document.getElementById('daysSinceLastService').textContent = daysSince;
            }
        });
    }

    // Handle maintenance form submission
    function setupMaintenanceForm() {
        document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const vehicleId = document.getElementById('vehicleSelect').value;
            const vehicle = vehicles.find(v => v.id === vehicleId);
            const vehicleName = `${vehicle.name} (${vehicle.fullId})`;
            const serviceType = document.getElementById('serviceType');
            const serviceTypeName = serviceType.options[serviceType.selectedIndex].text;
            const date = document.getElementById('scheduledDate').value;
            const technicianId = document.getElementById('technician').value;
            const technician = technicians.find(t => t.id === technicianId).name;
            const cost = parseFloat(document.getElementById('estimatedCost').value);
            const notes = document.getElementById('serviceNotes').value;

            // Create new maintenance record
            const newRecord = {
                id: (maintenanceRecords.length + 1).toString().padStart(3, '0'),
                vehicleId: vehicleId,
                vehicleName: vehicleName,
                serviceType: serviceTypeName,
                serviceTypeCategory: document.getElementById('serviceType').value,
                status: 'scheduled',
                date: date,
                technician: technician,
                cost: cost,
                notes: notes
            };

            // Add to records
            maintenanceRecords.push(newRecord);

            // Update display
            updateMaintenanceStats();
            filterMaintenanceRecords();

            // Close modal
            // Close modal
            document.getElementById('maintenanceModal').classList.add('hidden');
            document.getElementById('maintenanceForm').reset(); // Reset the form fields
        });
    }

    // Format date to a more readable format
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Initialize the application
    function init() {
        populateVehicleDropdowns();
        populateTechnicianDropdown();
        updateMaintenanceStats();
        populateMaintenanceTable(maintenanceRecords);
        setupServiceHistory();
        setupMaintenanceForm();

        // Add event listeners for filters and search
        document.getElementById('statusFilter').addEventListener('change', filterMaintenanceRecords);
        document.getElementById('typeFilter').addEventListener('change', filterMaintenanceRecords);
        document.getElementById('maintenanceSearch').addEventListener('input', filterMaintenanceRecords);
    }

    // Call the init function when the DOM is fully loaded
    init();
});
// Fuel Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Fuel Management System
    initFuelManagement();
});

function initFuelManagement() {
    // Sample data for demonstration
    const vehicles = [
        { id: 1, name: 'Truck #101', type: 'Delivery Truck' },
        { id: 2, name: 'Van #203', type: 'Service Van' },
        { id: 3, name: 'Sedan #305', type: 'Company Car' },
        { id: 4, name: 'SUV #407', type: 'Field Operations' },
        { id: 5, name: 'Truck #509', type: 'Heavy Duty' }
    ];

    const fuelTransactions = [
        { id: 1, vehicleId: 1, date: '2025-04-10', gallons: 12.5, pricePerGallon: 3.45, odometer: 45280, notes: 'Regular maintenance trip' },
        { id: 2, vehicleId: 2, date: '2025-04-09', gallons: 8.2, pricePerGallon: 3.50, odometer: 32150, notes: 'Field service call' },
        { id: 3, vehicleId: 3, date: '2025-04-08', gallons: 9.7, pricePerGallon: 3.55, odometer: 22780, notes: 'Client meeting' },
        { id: 4, vehicleId: 1, date: '2025-04-05', gallons: 14.3, pricePerGallon: 3.40, odometer: 44850, notes: 'Long distance delivery' },
        { id: 5, vehicleId: 4, date: '2025-04-04', gallons: 11.8, pricePerGallon: 3.52, odometer: 36420, notes: 'Site inspection' },
        { id: 6, vehicleId: 5, date: '2025-04-03', gallons: 18.5, pricePerGallon: 3.65, odometer: 58750, notes: 'Equipment transport' },
        { id: 7, vehicleId: 2, date: '2025-04-02', gallons: 7.9, pricePerGallon: 3.48, odometer: 31820, notes: 'Routine patrol' },
        { id: 8, vehicleId: 3, date: '2025-04-01', gallons: 10.2, pricePerGallon: 3.42, odometer: 22450, notes: 'Sales meeting' }
    ];

    // Previous fuel readings for MPG calculation
    const previousReadings = {
        1: { odometer: 44500, date: '2025-04-01' },
        2: { odometer: 31500, date: '2025-04-01' },
        3: { odometer: 22000, date: '2025-04-01' },
        4: { odometer: 36000, date: '2025-04-01' },
        5: { odometer: 58400, date: '2025-04-01' }
    };

    // Initialize charts and tables
    initDashboardStats(fuelTransactions, vehicles);
    initFuelCharts(fuelTransactions, vehicles);
    populateVehicleDropdown(vehicles);
    setupFuelTransactionsTable(fuelTransactions, vehicles, previousReadings);
    setupModalHandlers(vehicles, fuelTransactions, previousReadings);
}

function initDashboardStats(fuelTransactions, vehicles) {
    // Calculate total consumption
    const totalGallons = fuelTransactions.reduce((sum, tx) => sum + tx.gallons, 0);
    document.getElementById('totalConsumption').textContent = `${totalGallons.toFixed(1)} gallons`;
    document.getElementById('consumptionChange').textContent = '+5.2% from last month';

    // Calculate average MPG
    document.getElementById('avgMpg').textContent = '22.5 mpg';
    document.getElementById('mpgChange').textContent = '+1.8% from last month';

    // Calculate total cost
    const totalCost = fuelTransactions.reduce((sum, tx) => sum + (tx.gallons * tx.pricePerGallon), 0);
    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('costChange').textContent = '+3.4% from last month';

    // Set active vehicles
    document.getElementById('activeVehicles').textContent = vehicles.length;
}

function initFuelCharts(fuelTransactions, vehicles) {
    // Group transactions by month for the consumption chart
    const monthlyData = groupTransactionsByMonth(fuelTransactions);
    
    // Fuel Consumption Chart
    const fuelConsumptionCtx = document.getElementById('fuelConsumptionChart').getContext('2d');
    new Chart(fuelConsumptionCtx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Gallons',
                data: monthlyData.gallons,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Gallons'
                    }
                }
            }
        }
    });

    // Cost Analysis Chart
    const costAnalysisCtx = document.getElementById('costAnalysisChart').getContext('2d');
    new Chart(costAnalysisCtx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Total Cost',
                data: monthlyData.costs,
                fill: false,
                borderColor: 'rgb(239, 68, 68)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cost ($)'
                    }
                }
            }
        }
    });
}

function groupTransactionsByMonth(transactions) {
    // For demonstration, we'll create sample monthly data
    // In a real app, this would process actual transaction data
    
    return {
        labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        gallons: [85.2, 92.5, 88.7, 79.3, 87.6, 93.1],
        costs: [278.5, 305.4, 298.2, 275.6, 295.8, 320.2]
    };
}

function populateVehicleDropdown(vehicles) {
    const vehicleSelect = document.getElementById('vehicle');
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = vehicle.name;
        vehicleSelect.appendChild(option);
    });
}

function setupFuelTransactionsTable(transactions, vehicles, previousReadings) {
    const tableBody = document.getElementById('fuelTransactionsTable');
    const noTransactionsDiv = document.getElementById('noTransactions');
    const showingCountSpan = document.getElementById('showingCount');
    const totalCountSpan = document.getElementById('totalCount');
    
    // Clear existing table rows
    tableBody.innerHTML = '';
    
    // Hide "no transactions" message if we have data
    if (transactions.length > 0) {
        noTransactionsDiv.classList.add('hidden');
    } else {
        noTransactionsDiv.classList.remove('hidden');
    }
    
    // Update pagination info
    showingCountSpan.textContent = Math.min(transactions.length, 10);
    totalCountSpan.textContent = transactions.length;
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add transaction rows
    sortedTransactions.forEach(tx => {
        const vehicle = vehicles.find(v => v.id === tx.vehicleId);
        const row = document.createElement('tr');
        
        // Calculate MPG if previous reading exists
        let mpg = 'N/A';
        const prevReading = previousReadings[tx.vehicleId];
        if (prevReading && prevReading.odometer < tx.odometer) {
            const distance = tx.odometer - prevReading.odometer;
            mpg = (distance / tx.gallons).toFixed(1);
        }
        
        const totalCost = (tx.gallons * tx.pricePerGallon).toFixed(2);
        const formattedDate = new Date(tx.date).toLocaleDateString();
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${vehicle ? vehicle.name : 'Unknown'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${formattedDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${tx.gallons.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${tx.pricePerGallon.toFixed(3)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${totalCost}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${tx.odometer.toLocaleString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${mpg}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${tx.id}" class="edit-btn text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                <button data-id="${tx.id}" class="delete-btn text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit/delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const txId = parseInt(this.getAttribute('data-id'));
            openEditModal(txId, transactions, vehicles);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const txId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this transaction?')) {
                // In a real app, you would call an API to delete the transaction
                // For this demo, we'll just reload the table without the deleted transaction
                const updatedTransactions = transactions.filter(tx => tx.id !== txId);
                setupFuelTransactionsTable(updatedTransactions, vehicles, previousReadings);
            }
        });
    });
    
    // Setup pagination
    document.getElementById('prevPage').disabled = true; // First page
    document.getElementById('nextPage').disabled = transactions.length <= 10; // Disable if all fit on one page
}

function setupModalHandlers(vehicles, transactions, previousReadings) {
    const modal = document.getElementById('fuelModal');
    const addBtn = document.getElementById('addFuelBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('fuelForm');
    
    // Open modal when Add Transaction is clicked
    addBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add Fuel Transaction';
        form.reset();
        document.getElementById('transactionId').value = '';
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        modal.classList.remove('hidden');
    });
    
    // Close modal when Cancel is clicked
    cancelBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transactionId = document.getElementById('transactionId').value;
        const isNewTransaction = !transactionId;
        
        // Get form values
        const formData = {
            vehicleId: parseInt(document.getElementById('vehicle').value),
            date: document.getElementById('transactionDate').value,
            gallons: parseFloat(document.getElementById('gallons').value),
            pricePerGallon: parseFloat(document.getElementById('pricePerGallon').value),
            odometer: parseInt(document.getElementById('odometer').value),
            notes: document.getElementById('notes').value
        };
        
        // Validate form data
        if (!formData.vehicleId || !formData.date || isNaN(formData.gallons) || 
            isNaN(formData.pricePerGallon) || isNaN(formData.odometer)) {
            alert('Please fill in all required fields correctly.');
            return;
        }
        
        // In a real app, you would call an API to save the transaction
        // For this demo, we'll just update the local data
        
        if (isNewTransaction) {
            // Add new transaction
            const newTransaction = {
                id: transactions.length + 1,
                ...formData
            };
            transactions.push(newTransaction);
        } else {
            // Update existing transaction
            const txIndex = transactions.findIndex(tx => tx.id === parseInt(transactionId));
            if (txIndex !== -1) {
                transactions[txIndex] = {
                    ...transactions[txIndex],
                    ...formData
                };
            }
        }
        
        // Close modal and refresh table
        modal.classList.add('hidden');
        setupFuelTransactionsTable(transactions, vehicles, previousReadings);
        
        // Update dashboard stats and charts
        initDashboardStats(transactions, vehicles);
        initFuelCharts(transactions, vehicles);
    });
}

function openEditModal(transactionId, transactions, vehicles) {
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (!transaction) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Fuel Transaction';
    document.getElementById('transactionId').value = transaction.id;
    document.getElementById('vehicle').value = transaction.vehicleId;
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('gallons').value = transaction.gallons;
    document.getElementById('pricePerGallon').value = transaction.pricePerGallon;
    document.getElementById('odometer').value = transaction.odometer;
    document.getElementById('notes').value = transaction.notes || '';
    
    document.getElementById('fuelModal').classList.remove('hidden');
}
document.querySelectorAll('.generate-report-btn').forEach(button => {
    button.addEventListener('click', function () {
      const reportType = this.getAttribute('data-report');
      generateMockReport(reportType);
    });
  });

  function generateMockReport(reportName) {
    const timestamp = new Date().toLocaleString();
    const content = `Fleet Management Report\n----------------------\nReport: ${reportName}\nGenerated on: ${timestamp}\n\n[This is a mock report. Replace this with actual data later.]`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${reportName.replace(/ /g, '_')}_Report.txt`;
    link.click();
  }
   // Chart.js - Vehicle Utilization
   const ctx = document.getElementById('vehicleUtilizationChart').getContext('2d');
   new Chart(ctx, {
     type: 'bar',
     data: {
       labels: ['Vehicle A', 'Vehicle B', 'Vehicle C', 'Vehicle D'],
       datasets: [{
         label: 'Utilization (%)',
         data: [82, 65, 93, 76],
         backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
       }]
     },
     options: {
       responsive: true,
       plugins: {
         legend: { display: false },
         title: {
           display: true,
           text: 'Utilization Rate per Vehicle'
         }
       }
     }
   });

   // Leaflet Map for live vehicle location
   const map = L.map('fleetMap').setView([28.6139, 77.2090], 12); // Example: New Delhi
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; OpenStreetMap contributors'
   }).addTo(map);

   // Example markers
   L.marker([28.6139, 77.2090]).addTo(map).bindPopup('Vehicle A - Active');
   L.marker([28.6289, 77.2066]).addTo(map).bindPopup('Vehicle B - Idle');
   L.marker([28.6081, 77.2345]).addTo(map).bindPopup('Vehicle C - In Transit');

   // Report Generation (Mocked)
   document.querySelectorAll('.generate-report-btn').forEach(btn => {
     btn.addEventListener('click', () => {
       const reportName = btn.dataset.report;
       const content = `Fleet Report\n=============\nType: ${reportName}\nDate: ${new Date().toLocaleString()}\n\nData: [Placeholder for real backend data]\n`;
       const blob = new Blob([content], { type: 'text/plain' });
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = `${reportName.replace(/\s+/g, '_')}_Report.txt`;
       link.click();
     });
   });
   // JavaScript to handle form submission and validation
   document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const smsNotifications = document.getElementById('smsNotifications').checked;
    const pushNotifications = document.getElementById('pushNotifications').checked;
    const language = document.getElementById('language').value;
    const theme = document.getElementById('theme').value;

    // Validate form data
    if (!username || !email || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    // Simulate saving settings (you would typically send this data to your server)
    console.log("Settings saved:", {
        username,
        email,
        password,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        language,
        theme
    });

    // Provide user feedback
    document.getElementById('feedbackText').innerText = "Settings saved successfully!";
    document.getElementById('feedbackMessage').classList.remove('hidden');

    // Optionally, reset the form
    document.getElementById('settingsForm').reset();
});
