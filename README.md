# Lakeside Hotel Demo Client

A modern, responsive hotel booking application built with React and Vite. This application provides a complete hotel management system with room booking, user authentication, and administrative features.

## 🏨 Features

### For Guests

- **Room Browsing**: Browse available rooms with detailed information and images
- **Room Search**: Search rooms by date range and room type
- **Booking System**: Book rooms with real-time availability checking
- **User Authentication**: Secure login and registration system
- **Booking Management**: View and manage existing bookings
- **Booking Search**: Find bookings using confirmation codes
- **User Profile**: Manage personal information and preferences

### For Administrators

- **Room Management**: Add, edit, and delete rooms
- **Booking Overview**: View all bookings across the hotel
- **User Management**: Manage user accounts and profiles
- **Room Type Management**: Handle different room categories
- **Photo Management**: Upload and manage room photos

### Technical Features

- **Responsive Design**: Mobile-first approach with Bootstrap
- **Real-time Updates**: Dynamic room availability checking
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Clean API integration with backend services
- **Modern UI/UX**: Intuitive interface with smooth interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API server running (default: http://localhost:9192)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GosuCode/LakeSide-Hotel-Frontend
   cd LakeSide-Hotel-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
src/
├── components/
│   ├── admin/          # Administrative components
│   ├── auth/           # Authentication components
│   ├── booking/        # Booking-related components
│   ├── common/         # Shared/reusable components
│   ├── home/           # Home page components
│   ├── layout/         # Layout components (Header, Footer, NavBar)
│   ├── room/           # Room management components
│   └── utils/          # Utility functions and API calls
├── assets/
│   └── images/         # Static images and assets
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## 🎨 Technologies Used

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + React Bootstrap
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Date Handling**: Moment.js, date-fns
- **Icons**: React Icons
- **Authentication**: JWT (JSON Web Tokens)

## 📱 Key Components

### Authentication System

- Secure login and registration
- JWT token management
- Protected routes
- User profile management

### Room Management

- Room listing with filters
- Room details and images
- Availability checking
- Room type categorization

### Booking System

- Date range selection
- Real-time availability
- Booking confirmation
- Booking history and management

### Admin Panel

- Room CRUD operations
- User management
- Booking overview
- System administration

## 🔒 Security Features

- JWT-based authentication
- Protected routes for authenticated users
- Secure API communication
- Input validation and sanitization

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Production

1. Build the application: `npm run build`
2. Upload the contents of the `dist/` folder to your web server
3. Configure your server to serve the application from the root path
4. Ensure your backend API is accessible from the production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a demo application. For production use, ensure proper security measures, error handling, and testing are implemented.
