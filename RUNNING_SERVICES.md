# 🚀 Running Services

## ✅ Backend API Server
**Status:** Running  
**URL:** http://localhost:5000  
**API Base:** http://localhost:5000/api  
**Swagger Docs:** http://localhost:5000/api-docs  

---

## ✅ Super Admin Panel
**Status:** Running  
**URL:** http://localhost:4173  

---

## 🔑 Login Credentials

### Super Admin Account
- **Email:** `admin@appointmentapp.com`
- **Password:** `password123`

### Professional Account (for testing)
- **Email:** `sarah.johnson@example.com`
- **Password:** `password123`

### Client Account (for testing)
- **Email:** `john@example.com`
- **Password:** `password123`

---

## 📱 How to Access

### Admin Panel
1. Open your browser
2. Go to: **http://localhost:4173**
3. You'll see the Super Admin login page
4. Enter admin credentials (`admin@appointmentapp.com` / `password123`)
5. Click "Login to Admin Panel"

---

## 🎯 Features Available

### 📊 Dashboard
- Platform overview statistics (Total Users, Appointments, etc.)
- Quick action buttons

### 👥 User Management
- View all users (Clients, Professionals, Admins)
- Filter by role
- Search by name/email
- Delete users

### 🏥 Professional Management
- View detailed professional profiles
- See ratings and location
- View total appointments count

### 📅 Appointment Management
- View all platform appointments
- Filter by status (Booked, Pending, Completed, Cancelled)
- Search by client or professional name
- **Actions:** Mark as Completed, Cancel, Delete

---

## 🔧 Development Notes

### If you need to restart:

**Backend:**
```bash
cd backend
npm start
```

**Admin Panel:**
```bash
cd admin_panel
npm run build && npm run preview
```
