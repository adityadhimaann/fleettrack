# 🚛 FleetTrack - Enhanced Fleet Management System

A comprehensive, modern fleet management system built with PHP, JavaScript, and MySQL. FleetTrack provides real-time vehicle tracking, driver management, maintenance scheduling, and detailed analytics for fleet operations.

## ✨ Features

### 🔐 Authentication & Security
- **Secure User Authentication** with password hashing and session management
- **Role-based Access Control** (Admin, Manager, Driver)
- **CSRF Protection** and input validation
- **Rate Limiting** for login attempts
- **Session Security** with automatic timeout and regeneration

### 🚗 Vehicle Management
- **Real-time Vehicle Tracking** with GPS integration
- **Comprehensive Vehicle Profiles** (make, model, year, license, etc.)
- **Fuel Level Monitoring** with low fuel alerts
- **Maintenance Scheduling** and history tracking
- **Vehicle Status Management** (Active, Maintenance, Inactive)

### 👥 Driver Management
- **Driver Profiles** with license information
- **Assignment Management** between drivers and vehicles
- **Performance Tracking** and reporting
- **Emergency Contact Information**

### 📊 Dashboard & Analytics
- **Interactive Charts** using Chart.js
- **Real-time Statistics** and KPIs
- **Fuel Consumption Analysis**
- **Maintenance Cost Tracking**
- **Vehicle Utilization Reports**

### 🔧 Technical Features
- **Modern ES6+ JavaScript** with class-based architecture
- **Responsive Design** with Tailwind CSS
- **Database Optimization** with proper indexing
- **Error Logging** and monitoring
- **API-first Architecture** for scalability

## 🚀 Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Node.js (for Tailwind CSS compilation)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/fleettrack.git
   cd fleettrack
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `fleettrack_db`
   - Update database credentials in `config.php`
   - The application will automatically create tables on first run

4. **Configuration**
   - Copy `config.php.example` to `config.php` (if exists)
   - Update database credentials and other settings
   - Set appropriate file permissions

5. **Build Assets**
   ```bash
   npm run build
   ```

6. **Start Development Server**
   ```bash
   php -S localhost:8000
   ```

## 📁 Project Structure

```
fleettrack/
├── classes/                 # PHP Classes
│   ├── Auth.php            # Authentication management
│   ├── Database.php        # Database operations
│   └── Validator.php       # Input validation
├── js/                     # JavaScript files
│   └── app.js             # Main application logic
├── api/                    # API endpoints
├── logs/                   # Application logs
├── config.php             # Configuration file
├── index.html             # Main dashboard
├── login.html             # Login page
├── signup.html            # Registration page
├── style.css              # Enhanced styles
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## 🔧 Configuration

### Database Configuration
Update the database settings in `config.php`:

```php
class DatabaseConfig {
    const HOST = 'localhost';
    const USERNAME = 'your_username';
    const PASSWORD = 'your_password';
    const DATABASE = 'fleettrack_db';
}
```

### Application Settings
Customize application behavior in `config.php`:

```php
class AppConfig {
    const APP_NAME = 'FleetTrack';
    const TIMEZONE = 'America/New_York';
    const SESSION_TIMEOUT = 3600; // 1 hour
    const PASSWORD_MIN_LENGTH = 8;
    const MAX_LOGIN_ATTEMPTS = 5;
}
```

## 🎨 Customization

### Styling
- The application uses Tailwind CSS for styling
- Custom styles are defined in `style.css`
- Modify `tailwind.config.js` for theme customization

### JavaScript
- Main application logic is in `js/app.js`
- Uses modern ES6+ features and class-based architecture
- Modular design for easy extension

## 📱 API Endpoints

### Authentication
- `POST /login.php` - User login
- `POST /connect.php` - User registration
- `POST /api/auth/logout` - User logout

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle

### Drivers
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Add new driver
- `PUT /api/drivers/{id}` - Update driver

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/charts` - Chart data

## 🔒 Security Features

- **Password Hashing** using PHP's `password_hash()`
- **Prepared Statements** to prevent SQL injection
- **CSRF Token Protection** on all forms
- **Input Validation** and sanitization
- **Session Security** with secure cookies
- **Rate Limiting** for login attempts
- **SQL Injection Prevention** through parameterized queries

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For PHP testing:
```bash
composer test
```

## 📊 Performance Optimizations

- **Database Indexing** on frequently queried columns
- **Connection Pooling** with singleton pattern
- **Lazy Loading** for large datasets
- **Caching** for frequently accessed data
- **Optimized Queries** with proper joins
- **Asset Minification** for production

## 🌍 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@fleettrack.com
- Documentation: [docs.fleettrack.com](https://docs.fleettrack.com)

## 🔄 Version History

### v2.0.0 (Latest)
- Enhanced security features
- Modern JavaScript architecture
- Improved database design
- Better error handling
- Responsive design improvements

### v1.0.0
- Initial release
- Basic fleet management features
- Simple authentication system

## 🏗️ Development

### Prerequisites for Development
- PHP development environment
- MySQL/MariaDB
- Node.js and npm
- Git

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Watch for changes
npm run watch

# Run linting
npm run lint

# Run tests
npm run test
```

## 🚀 Deployment

### Production Deployment
1. Set `ENVIRONMENT` to `'production'` in `config.php`
2. Update database credentials
3. Run `npm run build` to compile assets
4. Set proper file permissions
5. Configure web server (Apache/Nginx)
6. Enable HTTPS
7. Set up regular backups

### Environment Variables
Create a `.env` file for sensitive configuration:
```
DB_HOST=localhost
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=fleettrack_db
APP_ENV=production
```

---

**Built with ❤️ for efficient fleet management**
