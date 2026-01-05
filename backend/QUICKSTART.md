# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Create the Database
```bash
cd backend
./scripts/setup-db.sh
```

### Step 2: Initialize Tables & Seed Data
```bash
npm run init-db
```

### Step 3: Start the Server
```bash
npm run dev
```

## ✅ Verify It's Working

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Appointment Booking API is running"
}
```

## 🔑 Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it for authenticated requests!

## 📱 Connect Your React Native App

Update your API base URL to:
- **Local development**: `http://localhost:5000/api`
- **Android emulator**: `http://10.0.2.2:5000/api`
- **Physical device**: `http://YOUR_IP:5000/api`

## 📚 Full Documentation

See [README.md](./README.md) for complete API documentation and examples.
