/**
 * FleetTrack - Enhanced JavaScript Application
 * Modern ES6+ implementation with improved performance and security
 */

class FleetTrackApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'home';
        this.charts = {};
        this.eventListeners = new Map();
        this.apiBase = '/';
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.loadUserSession();
            this.setupEventListeners();
            this.initializeCharts();
            this.loadInitialData();
            this.setupPeriodicUpdates();
            
            console.log('FleetTrack application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showNotification('Failed to initialize application', 'error');
        }
    }
    
    /**
     * Load user session information
     */
    async loadUserSession() {
        try {
            const response = await this.apiCall('GET', 'api/user/session');
            if (response.success) {
                this.currentUser = response.data;
                this.updateUserInterface();
            }
        } catch (error) {
            console.log('No active session found');
        }
    }
    
    /**
     * Setup event listeners with proper cleanup
     */
    setupEventListeners() {
        // Navigation events
        this.addEventListeners([
            { selector: '#homeBtn', event: 'click', handler: () => this.showView('home') },
            { selector: '#dashboardBtn', event: 'click', handler: () => this.showView('dashboard') },
            { selector: '#vehiclesBtn', event: 'click', handler: () => this.showView('vehicles') },
            { selector: '#driversBtn', event: 'click', handler: () => this.showView('drivers') },
            { selector: '#trackingBtn', event: 'click', handler: () => this.showView('tracking') },
            { selector: '#reportsBtn', event: 'click', handler: () => this.showView('reports') },
            { selector: '#settingsBtn', event: 'click', handler: () => this.showView('settings') }
        ]);
        
        // Form submissions
        this.addEventListeners([
            { selector: '#loginForm', event: 'submit', handler: (e) => this.handleLogin(e) },
            { selector: '#registrationForm', event: 'submit', handler: (e) => this.handleRegistration(e) },
            { selector: '#addVehicleForm', event: 'submit', handler: (e) => this.handleAddVehicle(e) },
            { selector: '#addDriverForm', event: 'submit', handler: (e) => this.handleAddDriver(e) }
        ]);
        
        // Search and filter events
        this.addEventListeners([
            { selector: '#vehicleSearch', event: 'input', handler: (e) => this.filterVehicles(e.target.value) },
            { selector: '#driverSearch', event: 'input', handler: (e) => this.filterDrivers(e.target.value) },
            { selector: '#statusFilter', event: 'change', handler: (e) => this.filterByStatus(e.target.value) }
        ]);
        
        // Modal events
        this.addEventListeners([
            { selector: '[data-modal-open]', event: 'click', handler: (e) => this.openModal(e.target.dataset.modalOpen) },
            { selector: '[data-modal-close]', event: 'click', handler: (e) => this.closeModal() },
            { selector: '.modal-overlay', event: 'click', handler: (e) => this.handleModalOverlayClick(e) }
        ]);
        
        // Logout functionality
        this.addEventListener('#logoutBtn', 'click', () => this.handleLogout());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Window events
        window.addEventListener('beforeunload', () => this.cleanup());
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
    }
    
    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(selector, event, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
            
            // Track for cleanup
            if (!this.eventListeners.has(selector)) {
                this.eventListeners.set(selector, []);
            }
            this.eventListeners.get(selector).push({ event, handler });
        }
    }
    
    /**
     * Add multiple event listeners
     */
    addEventListeners(listeners) {
        listeners.forEach(({ selector, event, handler }) => {
            this.addEventListener(selector, event, handler);
        });
    }
    
    /**
     * Handle user login
     */
    async handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember_me: formData.get('remember_me') === 'on'
        };
        
        try {
            this.showLoading(true);
            const response = await this.apiCall('POST', 'login.php', loginData);
            
            if (response.success) {
                this.currentUser = response.data;
                this.showNotification(response.message, 'success');
                this.updateUserInterface();
                this.redirectToDashboard();
            } else {
                this.showNotification(response.message, 'error');
            }
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Handle user registration
     */
    async handleRegistration(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Add CSRF token
        const csrfToken = await this.getCSRFToken();
        formData.append('csrf_token', csrfToken);
        
        try {
            this.showLoading(true);
            const response = await this.apiCall('POST', 'connect.php', formData);
            
            if (response.success) {
                this.showNotification(response.message, 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showNotification(response.message, 'error');
            }
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Handle logout
     */
    async handleLogout() {
        try {
            const response = await this.apiCall('POST', 'api/auth/logout');
            this.currentUser = null;
            this.showNotification('Logged out successfully', 'success');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout on client side
            this.currentUser = null;
            window.location.href = 'login.html';
        }
    }
    
    /**
     * Show different views
     */
    showView(viewName) {
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-gray-700');
            link.classList.add('text-gray-300', 'hover:bg-gray-700');
        });
        
        const activeLink = document.querySelector(`#${viewName}Btn`);
        if (activeLink) {
            activeLink.classList.add('bg-gray-700');
            activeLink.classList.remove('text-gray-300', 'hover:bg-gray-700');
        }
        
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected content
        const contentSection = document.querySelector(`#${viewName}Content`);
        if (contentSection) {
            contentSection.classList.remove('hidden');
            this.currentView = viewName;
            
            // Load view-specific data
            this.loadViewData(viewName);
        }
    }
    
    /**
     * Load data for specific view
     */
    async loadViewData(viewName) {
        switch (viewName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'vehicles':
                await this.loadVehiclesData();
                break;
            case 'drivers':
                await this.loadDriversData();
                break;
            case 'tracking':
                await this.loadTrackingData();
                break;
            case 'reports':
                await this.loadReportsData();
                break;
        }
    }
    
    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        try {
            const [stats, vehicles, alerts] = await Promise.all([
                this.apiCall('GET', 'api/dashboard/stats'),
                this.apiCall('GET', 'api/vehicles/summary'),
                this.apiCall('GET', 'api/alerts/active')
            ]);
            
            this.updateDashboardStats(stats.data);
            this.updateVehiclesSummary(vehicles.data);
            this.updateAlerts(alerts.data);
            this.updateCharts();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    /**
     * Load vehicles data
     */
    async loadVehiclesData() {
        try {
            const response = await this.apiCall('GET', 'api/vehicles');
            if (response.success) {
                this.renderVehiclesTable(response.data);
            }
        } catch (error) {
            console.error('Failed to load vehicles:', error);
            this.showNotification('Failed to load vehicles', 'error');
        }
    }
    
    /**
     * Load drivers data
     */
    async loadDriversData() {
        try {
            const response = await this.apiCall('GET', 'api/drivers');
            if (response.success) {
                this.renderDriversTable(response.data);
            }
        } catch (error) {
            console.error('Failed to load drivers:', error);
            this.showNotification('Failed to load drivers', 'error');
        }
    }
    
    /**
     * Initialize charts with Chart.js
     */
    initializeCharts() {
        this.initializeFuelChart();
        this.initializeMaintenanceChart();
        this.initializeUtilizationChart();
    }
    
    /**
     * Initialize fuel consumption chart
     */
    initializeFuelChart() {
        const ctx = document.getElementById('fuelChart');
        if (!ctx) return;
        
        this.charts.fuel = new Chart(ctx, {
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
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    /**
     * Initialize maintenance cost chart
     */
    initializeMaintenanceChart() {
        const ctx = document.getElementById('maintenanceChart');
        if (!ctx) return;
        
        this.charts.maintenance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Maintenance Cost ($)',
                    data: [1200, 800, 1500, 900, 1100, 750],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    /**
     * Initialize vehicle utilization chart
     */
    initializeUtilizationChart() {
        const ctx = document.getElementById('utilizationChart');
        if (!ctx) return;
        
        this.charts.utilization = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Maintenance', 'Idle'],
                datasets: [{
                    data: [65, 15, 20],
                    backgroundColor: [
                        'rgb(34, 197, 94)',
                        'rgb(245, 158, 11)',
                        'rgb(156, 163, 175)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    /**
     * Update charts with new data
     */
    async updateCharts() {
        try {
            const chartsData = await this.apiCall('GET', 'api/dashboard/charts');
            
            if (chartsData.success) {
                // Update fuel chart
                if (this.charts.fuel && chartsData.data.fuel) {
                    this.charts.fuel.data.datasets[0].data = chartsData.data.fuel;
                    this.charts.fuel.update();
                }
                
                // Update maintenance chart
                if (this.charts.maintenance && chartsData.data.maintenance) {
                    this.charts.maintenance.data.datasets[0].data = chartsData.data.maintenance;
                    this.charts.maintenance.update();
                }
                
                // Update utilization chart
                if (this.charts.utilization && chartsData.data.utilization) {
                    this.charts.utilization.data.datasets[0].data = chartsData.data.utilization;
                    this.charts.utilization.update();
                }
            }
        } catch (error) {
            console.error('Failed to update charts:', error);
        }
    }
    
    /**
     * Render vehicles table
     */
    renderVehiclesTable(vehicles) {
        const tbody = document.getElementById('vehiclesTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = vehicles.map(vehicle => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fas fa-truck text-gray-500 mr-2"></i>
                        <div class="text-sm font-medium text-gray-900">${this.escapeHtml(vehicle.vehicle_name)}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${this.escapeHtml(vehicle.vehicle_number)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getStatusClass(vehicle.status)}">
                        ${this.capitalizeFirst(vehicle.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.escapeHtml(vehicle.vehicle_type)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fas fa-gas-pump ${this.getFuelClass(vehicle.current_fuel_level)} mr-2"></i>
                        <div class="text-sm ${this.getFuelClass(vehicle.current_fuel_level)}">${vehicle.current_fuel_level}%</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(vehicle.updated_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="app.viewVehicle(${vehicle.id})" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button onclick="app.editVehicle(${vehicle.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
            </tr>
        `).join('');
    }
    
    /**
     * API call wrapper with error handling
     */
    async apiCall(method, endpoint, data = null) {
        const url = this.apiBase + endpoint;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        
        if (data) {
            if (data instanceof FormData) {
                options.body = data;
                delete options.headers['Content-Type']; // Let browser set it for FormData
            } else {
                options.body = JSON.stringify(data);
            }
        }
        
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }
    
    /**
     * Get CSRF token
     */
    async getCSRFToken() {
        try {
            const response = await this.apiCall('GET', 'api/csrf-token');
            return response.token;
        } catch (error) {
            console.error('Failed to get CSRF token:', error);
            return '';
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${this.getNotificationClass(type)}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getNotificationIcon(type)} mr-2"></i>
                <span>${this.escapeHtml(message)}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
        const loader = document.getElementById('loadingIndicator');
        if (loader) {
            loader.classList.toggle('hidden', !show);
        }
    }
    
    /**
     * Setup periodic updates
     */
    setupPeriodicUpdates() {
        // Update dashboard every 30 seconds
        setInterval(() => {
            if (this.currentView === 'dashboard') {
                this.loadDashboardData();
            }
        }, 30000);
        
        // Update vehicle locations every 10 seconds
        setInterval(() => {
            if (this.currentView === 'tracking') {
                this.loadTrackingData();
            }
        }, 10000);
    }
    
    /**
     * Utility functions
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }
    
    getStatusClass(status) {
        const classes = {
            'active': 'bg-green-100 text-green-800',
            'maintenance': 'bg-yellow-100 text-yellow-800',
            'inactive': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    getFuelClass(level) {
        return parseInt(level) < 30 ? 'text-red-500' : 'text-green-500';
    }
    
    getNotificationClass(type) {
        const classes = {
            'success': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'warning': 'bg-yellow-500 text-white',
            'info': 'bg-blue-500 text-white'
        };
        return classes[type] || classes.info;
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        // Remove event listeners
        this.eventListeners.forEach((listeners, selector) => {
            const element = document.querySelector(selector);
            if (element) {
                listeners.forEach(({ event, handler }) => {
                    element.removeEventListener(event, handler);
                });
            }
        });
        
        this.eventListeners.clear();
    }
}

/**
 * Utility function for debouncing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FleetTrackApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FleetTrackApp;
}