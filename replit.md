# BookIt - Universal Appointment & Scheduling Management System

## Overview

BookIt is a React Native mobile application built with Expo that facilitates appointment booking and management between service professionals (doctors, lawyers, salons, consultants, etc.) and clients. The app provides role-specific interfaces for both professionals to manage their schedules and clients to discover and book appointments.

The application uses a dual-role architecture where users can authenticate as either a Professional or a Client, each receiving a tailored experience with distinct navigation flows and features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses Expo's managed workflow for cross-platform development (iOS, Android, Web)
- New Architecture enabled for improved performance
- React 19.1.0 with experimental React Compiler enabled

**Navigation Structure**: 
- Stack-based root navigation using `@react-navigation/native-stack`
- Role-specific bottom tab navigators (4 tabs each) for Professionals and Clients
- Modal presentation for detail screens (appointments, booking flow, professional details)
- Nested stack navigators within each tab for deeper navigation hierarchies

**State Management**:
- React Context API for authentication state (`AuthContext`)
- Local component state with React hooks (useState, useMemo)
- No global state management library (Redux, Zustand, etc.)

**UI/Animation Framework**:
- Reanimated 4.1.1 for performant animations
- Gesture Handler for touch interactions
- Keyboard Controller for keyboard-aware UI
- Expo Blur for native blur effects on iOS
- Safe Area Context for proper inset handling across devices

**Styling Approach**:
- StyleSheet-based styling (no CSS-in-JS libraries)
- Theme system with light/dark mode support via `useColorScheme` hook
- Centralized theme constants (colors, spacing, typography, shadows)
- Platform-specific adjustments using `Platform.select()`

**Component Architecture**:
- Functional components with hooks throughout
- Custom themed components (`ThemedView`, `ThemedText`) for consistent styling
- Specialized screen wrapper components (`ScreenScrollView`, `ScreenFlatList`, `ScreenKeyboardAwareScrollView`) handling safe areas and keyboard
- Error boundary implementation using class component (required by React)

### Authentication System

**Hardcoded Authentication** (No Backend):
- Two predefined user accounts with hardcoded credentials
- Professional: `doctor@app.com` / `professional123`
- Client: `client@app.com` / `client123`
- Role selection toggle on login screen
- Context-based auth state management
- No registration, password reset, or SSO features

**Design Rationale**: Hardcoded authentication eliminates backend dependencies for prototyping while demonstrating the full authentication flow and role-based navigation.

### Data Layer

**Mock Data Approach**:
- All data stored in `data/mockData.ts` as static TypeScript objects
- No database integration (ready for future API/database connection)
- Data models defined for: Professionals, Appointments, TimeSlots, Notifications, Categories
- Separate appointment arrays for client and professional views

**Data Structure**:
- Professional profiles with working hours, blocked dates, ratings
- Appointments with status tracking (booked, completed, cancelled, pending)
- Category-based professional filtering
- Time slot availability system

**Design Rationale**: Mock data allows rapid prototyping and UI development without backend infrastructure. The data models are structured to easily transition to a REST API or GraphQL backend.

### Navigation Architecture

**Role-Based Navigation**:
- **Professional Flow**: Dashboard → Schedule → Appointments → Profile (+ FAB for quick time blocking)
- **Client Flow**: Home → Browse → Appointments → Profile (+ FAB for quick booking)
- Shared modal screens: Appointment Details, Professional Details, Booking Flow, Notifications

**Navigation Decisions**:
- Bottom tabs for primary navigation (standard mobile pattern)
- Stack navigators nested within tabs for hierarchical navigation
- Modal presentation for transient tasks (booking, viewing details)
- Floating Action Button (FAB) positioned above tabs for quick actions

**Design Rationale**: Role-specific tab structures provide optimal workflows for each user type. Professionals need quick access to schedules and appointments, while clients prioritize browsing and booking.

### Screen Layout System

**Safe Area Management**:
- Custom `useScreenInsets` hook calculates padding based on:
  - Header height (from navigation)
  - Tab bar height (from bottom tabs)
  - Safe area insets (notches, home indicators)
- Wrapper components automatically apply correct insets

**Keyboard Handling**:
- `KeyboardAwareScrollView` on forms (native platforms)
- Falls back to standard `ScrollView` on web
- `KeyboardProvider` at root level for keyboard events

**Design Rationale**: Centralized inset logic prevents layout issues across different screen sizes and platforms. The hook-based approach keeps components clean and consistent.

### Theme System

**Color System**:
- Separate light and dark color palettes
- Semantic color naming (primary, accent, success, warning, error)
- Elevation-based background colors (root, default, secondary, tertiary)
- Platform-specific background handling for native blur effects

**Typography & Spacing**:
- Predefined typography scale (h1-h4, body, small, caption)
- Consistent spacing system (xs, sm, md, lg, xl)
- Border radius constants for consistent roundness
- Shadow presets for elevation effects

**Design Rationale**: A systematic approach to theming ensures visual consistency and makes future design updates easier. Semantic naming makes color intent clear.

### Performance Optimizations

**Animation Performance**:
- Reanimated for native-thread animations (avoiding JS thread)
- Worklets for gesture-driven animations
- Spring-based animations with consistent configuration

**List Rendering**:
- FlatList for efficient scrolling of large datasets
- useMemo for filtered/sorted data to prevent unnecessary recalculations

**Code Splitting**:
- Path aliases (`@/`) for clean imports
- Module resolver for organized file structure

## External Dependencies

### Core Framework
- **Expo SDK 54**: Managed React Native framework providing native modules and build tooling
- **React Navigation 7**: Navigation library with stack, tab, and modal navigators

### UI & Interaction
- **Reanimated 4**: High-performance animation library running on native thread
- **Gesture Handler 2**: Native gesture handling system
- **Keyboard Controller**: Advanced keyboard interaction management
- **Safe Area Context**: Safe area inset handling for modern devices

### Platform Features
- **Expo Blur**: Native blur effects (iOS)
- **Expo Haptics**: Haptic feedback
- **Expo Image**: Optimized image component
- **Expo Status Bar**: Status bar configuration
- **Expo Symbols**: SF Symbols support (iOS)

### Development Tools
- **TypeScript 5.9**: Type safety and developer experience
- **Babel Module Resolver**: Path alias support
- **ESLint + Prettier**: Code quality and formatting
- **Expo React Compiler**: Experimental React optimization (enabled)

### Future Integration Points
- Database: Currently using mock data, ready for Drizzle ORM integration
- Backend API: Data layer structured for REST/GraphQL integration
- Push Notifications: Infrastructure ready for appointment reminders
- Calendar Integration: Time slot system compatible with native calendar APIs