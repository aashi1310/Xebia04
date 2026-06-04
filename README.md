# Authentication Dashboard

A modern React-based Authentication Dashboard built using React (Vite), React Router, Local Storage, and React Toastify. The application provides a complete user authentication flow with Registration, Login, Dashboard, Profile Management, Password Management, Settings, and Help Center functionality.

## Features

### Authentication
- User Registration
- User Login
- Protected Dashboard Route
- Session Management using Local Storage
- Logout Functionality

### Dashboard
- Personalized Welcome Section
- User Profile Card
- User Avatar Generation
- Account Information Display
- Dashboard Statistics

### Quick Actions
- Edit Profile
- Change Password
- Settings
- Help Center

### Profile Management
- Update Name
- Update Email
- Email Validation
- Duplicate Email Prevention

### Password Management
- Change Password
- Current Password Verification
- Password Validation
- Secure Update Flow

### Settings
- Light and Dark Theme Support
- Remember Me Option
- Email Notification Preferences
- Marketing Notification Preferences
- Persistent User Preferences

### Help Center
- Contact Information
- Frequently Asked Questions
- Privacy Information

### User Experience
- Responsive Design
- Mobile Friendly Layout
- Toast Notifications
- Form Validation
- Loading States
- Smooth Transitions
- Modern User Interface

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- React Hooks

### State & Storage
- Local Storage

### Notifications
- React Toastify

### Styling
- CSS3
- Responsive Design

## Project Structure

```bash
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│
├── components/modals/
│   ├── EditProfileModal.jsx
│   ├── ChangePasswordModal.jsx
│   ├── SettingsModal.jsx
│   └── HelpCenterModal.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
│
├── styles/
│   ├── App.css
│   ├── Dashboard.css
│   ├── Modal.css
│   └── Navbar.css
│
├── App.jsx
├── main.jsx
│
public/
package.json
README.md
```

## Application Flow

### Registration

1. User enters:
   - Full Name
   - Email Address
   - Password
   - Confirm Password

2. Validation Checks:
   - Required fields
   - Valid email format
   - Password length
   - Password confirmation
   - Duplicate email prevention

3. User data is stored in Local Storage.

### Login

1. User enters:
   - Email
   - Password

2. Credentials are verified.

3. User session is stored in Local Storage.

4. User is redirected to Dashboard.

### Dashboard

The dashboard displays:

- User Name
- User Email
- Registration Date
- User Avatar
- Total Registered Users
- Last Login Information

Quick Action buttons allow users to:

- Edit Profile
- Change Password
- Manage Settings
- Access Help Center

## Local Storage Structure

### Users

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "createdAt": "2026-06-04"
  }
]
```

### Current User

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Settings

```json
{
  "theme": "dark",
  "rememberMe": true,
  "emailNotifications": true,
  "marketingNotifications": false
}
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/authentication-dashboard.git
```

### Navigate to Project Directory

```bash
cd authentication-dashboard
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Future Enhancements

- Backend Integration
- JWT Authentication
- MongoDB Database
- Profile Image Upload
- Email Verification
- Forgot Password Functionality
- Multi-Factor Authentication
- Activity Logs
- Admin Dashboard
- User Management System

## Learning Outcomes

This project demonstrates:

- React Fundamentals
- React Router
- Component-Based Architecture
- State Management with Hooks
- Form Handling and Validation
- Local Storage Integration
- Protected Routes
- Responsive UI Development
- User Authentication Flow
- Modular Code Organization

## Author

**Aashika Jain**

Engineering Student | Full Stack Development Enthusiast

## License

This project is created for educational and internship assessment purposes.
