-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS blocked_dates CASCADE;
DROP TABLE IF EXISTS working_hours CASCADE;
DROP TABLE IF EXISTS professionals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (both clients and professionals)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'professional', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professionals table (extended profile for professional users)
CREATE TABLE professionals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  about TEXT,
  appointment_duration INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Working hours table
CREATE TABLE working_hours (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME,
  end_time TIME,
  is_working BOOLEAN DEFAULT true,
  UNIQUE(professional_id, day_of_week)
);

-- Blocked dates table
CREATE TABLE blocked_dates (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  UNIQUE(professional_id, blocked_date)
);

-- Appointments table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('booked', 'completed', 'cancelled', 'pending')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'confirmation', 'cancellation', 'update')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_professionals_category ON professionals(category);
CREATE INDEX idx_working_hours_professional ON working_hours(professional_id);
