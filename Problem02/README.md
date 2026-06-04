# 🔐 AuthDash – Authentication Dashboard

A modern, full-featured **React.js** authentication system built with **Vite**, featuring a dark glassmorphism UI, complete user registration/login flows, and a rich protected dashboard — all powered by **localStorage** (no backend required).

---

## ✨ Features

### 🔒 Authentication
- **Registration** – Full Name, Email, Password, Confirm Password with live validation
- **Login** – Email & password with credential verification
- **Protected Routes** – Dashboard requires authentication; auto-redirects to login

### 📊 Dashboard
- Personalized greeting (Good morning / afternoon / evening)
- Statistics cards: Total users, account status, member since date
- User profile card with avatar initials and online badge
- Recent activity feed
- Quick action buttons
- Registered users list with "You" badge for the current user

### 🎨 UI & UX
- Dark-mode glassmorphism design with indigo + cyan gradient theme
- Sticky navbar with glassmorphism effect
- Password strength meter (Weak / Medium / Strong)
- Real-time field validation with inline error & success messages
- Password show/hide toggle on all password fields
- Loading spinners on submit buttons
- Toast notification system (success / error / info) with slide animations
- Smooth page transition animations
- Fully responsive – works on mobile, tablet, desktop
- Mobile hamburger navigation menu

---

## 🛠️ Tech Stack

| Technology       | Purpose                          |
|-----------------|----------------------------------|
| React.js (v18)  | UI framework                     |
| Vite            | Build tool & dev server          |
| React Router v6 | Client-side routing              |
| localStorage    | Data persistence (no backend)    |
| Vanilla CSS     | Styling with CSS variables       |
| Inter (Google Fonts) | Typography                  |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky responsive navbar
│   └── ProtectedRoute.jsx  # Auth guard for routes
├── context/
│   └── ToastContext.jsx    # Global toast notification system
├── pages/
│   ├── Login.jsx           # Login page with validation
│   ├── Register.jsx        # Registration page with strength meter
│   ├── Dashboard.jsx       # Protected user dashboard
│   └── NotFound.jsx        # 404 page
├── styles/
│   ├── Auth.css            # Login & Register styles
│   ├── Dashboard.css       # Dashboard & stats styles
│   └── Navbar.css          # Navbar styles
├── utils/
│   └── storage.js          # localStorage CRUD utilities
├── App.jsx                 # Root with BrowserRouter + routes
├── index.css               # Global design system & tokens
└── main.jsx                # React DOM entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 7

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## 🗄️ localStorage Schema

### Users list (`authdash_users`)
```json
[
  {
    "id": 1717483200000,
    "name": "Aashika Jain",
    "email": "aashika@gmail.com",
    "password": "password123",
    "createdAt": "2026-06-04"
  }
]
```

### Current session (`authdash_current_user`)
```json
{
  "id": 1717483200000,
  "name": "Aashika Jain",
  "email": "aashika@gmail.com"
}
```

---

## 🔐 Routes

| Path         | Access      | Description             |
|-------------|-------------|-------------------------|
| `/`          | Public      | Redirects to `/login`   |
| `/login`     | Public      | Login form              |
| `/register`  | Public      | Registration form       |
| `/dashboard` | 🔒 Protected | User dashboard          |
| `/*`         | Public      | 404 Not Found page      |

---

## 🎨 Design System

| Token              | Value                     |
|-------------------|---------------------------|
| Background        | `#0a0e1a`                 |
| Surface           | `#111827`                 |
| Primary           | `#6366f1` (Indigo)        |
| Secondary         | `#06b6d4` (Cyan)          |
| Success           | `#10b981`                 |
| Error             | `#ef4444`                 |
| Font              | Inter (Google Fonts)      |

---

## 📝 Notes

> ⚠️ **Security Notice**: This project stores passwords in plain text in localStorage for demonstration purposes only. In a real production application, always hash passwords server-side (e.g., bcrypt) and use a secure backend with HTTPS.

---

Built with ❤️ as an internship assessment project.
