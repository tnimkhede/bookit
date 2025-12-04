# Design Guidelines: Universal Appointment & Scheduling Management System

## Architecture Decisions

### Authentication
**Hardcoded Login Required**
- Use hardcoded email/password authentication with role selection
- **Hardcoded Credentials:**
  - Professional: email: `doctor@app.com`, password: `professional123`
  - Client: email: `client@app.com`, password: `client123`
- Login screen must include:
  - Role selector toggle (Professional/Client) above login fields
  - Email and password input fields
  - "Login" button
  - Visual feedback on incorrect credentials
- No SSO, no registration flow (all accounts pre-exist)
- Include logout option in profile/settings
- Mock authentication state using React Context

### Navigation Architecture
**Bottom Tab Navigation** (4 tabs + Floating Action Button)
- **For Professionals:**
  - Tab 1: Dashboard (calendar icon)
  - Tab 2: Schedule (clock icon)
  - Tab 3: Appointments (list icon)
  - Tab 4: Profile (user icon)
  - FAB: Quick Block Time (positioned bottom-right, above tabs)

- **For Clients:**
  - Tab 1: Home (home icon)
  - Tab 2: Browse (search icon)
  - Tab 3: Appointments (calendar icon)
  - Tab 4: Profile (user icon)
  - FAB: Quick Book (positioned bottom-right, above tabs)

**Modal Screens** (full-screen, slide from bottom):
- Appointment details
- Booking flow (multi-step)
- Professional details
- Schedule editor
- Notifications list

## Screen Specifications

### 1. Login Screen (Stack-Only)
- **Purpose:** Authenticate user and determine role
- **Layout:**
  - No header
  - Centered content on gradient background
  - Top inset: insets.top + 48
  - Bottom inset: insets.bottom + 24
- **Components:**
  - App logo/title at top
  - Segmented control for role selection (Professional/Client)
  - Email input field
  - Password input field with show/hide toggle
  - Primary action button "Login"
  - Error message display area
- **Interactions:**
  - Smooth role switch animation
  - Keyboard-aware scrolling
  - Input validation feedback

### 2. Professional Dashboard (Tab 1)
- **Purpose:** Daily overview of appointments and quick stats
- **Layout:**
  - Custom header with greeting and date
  - ScrollView root with pull-to-refresh
  - Top inset: insets.top + 24
  - Bottom inset: tabBarHeight + 24
- **Components:**
  - Welcome header with professional name
  - Today's date with calendar mini-widget
  - Quick stats cards (Total Today, Completed, Pending, Cancelled)
  - "Today's Schedule" section with timeline view
  - Upcoming appointments list (3-5 items)
  - Each appointment card shows: time, client name, purpose, status badge
- **Visual Design:**
  - Use card elevation for stats
  - Timeline with connecting dots and lines
  - Color-coded status badges

### 3. Client Home (Tab 1)
- **Purpose:** Quick access to upcoming appointments and recommended professionals
- **Layout:**
  - Transparent header with search icon (right)
  - ScrollView root
  - Top inset: headerHeight + 16
  - Bottom inset: tabBarHeight + 24
- **Components:**
  - Hero section with user greeting
  - "Next Appointment" featured card (if exists)
  - Category quick access (horizontal scroll: Doctors, Salons, Lawyers, Consultants, Tutors)
  - "Recommended Professionals" section with cards
  - Professional cards show: avatar, name, category, rating (hardcoded), next available slot
- **Interactions:**
  - Category chips are tappable, navigate to filtered browse
  - Professional cards tap to details

### 4. Browse Professionals (Client Tab 2)
- **Purpose:** Search and filter professionals
- **Layout:**
  - Header with search bar (placeholder: "Search by name or category")
  - Filter chips below header (sticky)
  - FlatList root
  - Top inset: headerHeight + 8
  - Bottom inset: tabBarHeight + 16
- **Components:**
  - Search bar with icon
  - Horizontal filter chips (All, Doctors, Salons, Lawyers, Consultants, Tutors)
  - Professional list items with:
    - Avatar (generated asset)
    - Name and category
    - Location icon + city
    - Star icon + rating
    - "Next available: Tomorrow 2:00 PM" text
    - Right arrow icon
- **Interactions:**
  - Real-time search filter (local)
  - Active filter chip highlighted
  - Tap professional to view details

### 5. Appointment Booking Flow (Modal)
- **Purpose:** Multi-step booking process
- **Layout:**
  - Default navigation header with back button (left), "Cancel" (right)
  - Step indicator below header
  - Scrollable form content
  - Fixed bottom button area
  - Bottom inset: insets.bottom + 16
- **Steps:**
  - Step 1: Select Date (calendar view)
  - Step 2: Select Time Slot (grid of available slots)
  - Step 3: Add Purpose (textarea input)
  - Step 4: Confirmation Summary
- **Components:**
  - Progress indicator (1/4, 2/4, etc.)
  - Calendar with available dates highlighted
  - Time slot chips (available in primary color, booked in gray, selected in accent)
  - Text input for purpose
  - Summary card
  - "Next" and "Confirm Booking" buttons
- **Interactions:**
  - Smooth transitions between steps
  - Disable unavailable slots
  - Validation before proceeding

### 6. Appointments List (Tab 3)
- **Purpose:** View all appointments with filtering
- **Layout:**
  - Default header with "Appointments" title
  - Segmented tabs below header (Upcoming, Past, Cancelled)
  - FlatList root
  - Top inset: headerHeight + 48
  - Bottom inset: tabBarHeight + 16
- **Components:**
  - Tab selector (Upcoming/Past/Cancelled)
  - Grouped by date headers
  - Appointment cards with:
    - Date and time
    - Professional/Client name (depending on role)
    - Category badge
    - Status indicator
    - Quick actions (Cancel, Reschedule for upcoming)
- **Interactions:**
  - Swipe-to-cancel on upcoming appointments
  - Tap card for full details

### 7. Professional Schedule Management (Professional Tab 2)
- **Purpose:** View and manage working hours
- **Layout:**
  - Default header with "My Schedule" title, "Edit" button (right)
  - ScrollView root
  - Top inset: headerHeight + 16
  - Bottom inset: tabBarHeight + 24
- **Components:**
  - Weekly calendar overview
  - Working hours display for each day
  - Appointment duration setting display
  - Blocked dates section (list with delete option)
  - "Add Blocked Date" button
- **Visual Design:**
  - Day cards with toggle switch (Working/Off)
  - Time range display
  - Red badges for blocked dates

### 8. Profile Screen (Tab 4)
- **Purpose:** User settings and account management
- **Layout:**
  - Custom header with profile info
  - ScrollView root
  - Top inset: 0 (full-bleed header)
  - Bottom inset: tabBarHeight + 24
- **Components:**
  - Header section with avatar, name, role badge
  - Settings sections:
    - Account Info (name, email, phone)
    - Notifications Settings (toggles)
    - About (version, terms, privacy)
    - Logout button (danger color)
- **Interactions:**
  - Tap sections to edit (modal forms)
  - Logout with confirmation alert

## Design System

### Color Palette
**Primary Colors:**
- Primary: `#6366F1` (Indigo) - Main brand color
- PrimaryDark: `#4F46E5` - Pressed states
- Accent: `#10B981` (Green) - Success, confirmed appointments
- Background: `#F9FAFB` (Light Gray)
- Surface: `#FFFFFF`

**Status Colors:**
- Success: `#10B981` (Completed)
- Warning: `#F59E0B` (Pending)
- Error: `#EF4444` (Cancelled)
- Info: `#3B82F6` (Booked)

**Text Colors:**
- TextPrimary: `#111827`
- TextSecondary: `#6B7280`
- TextTertiary: `#9CA3AF`
- TextInverse: `#FFFFFF`

### Typography
- **Heading1:** 28px, Bold, TextPrimary
- **Heading2:** 24px, SemiBold, TextPrimary
- **Heading3:** 20px, SemiBold, TextPrimary
- **Body:** 16px, Regular, TextPrimary
- **BodySmall:** 14px, Regular, TextSecondary
- **Caption:** 12px, Regular, TextTertiary
- **Button:** 16px, Medium, TextInverse

### Component Specifications

**Cards:**
- Background: Surface
- Border radius: 12px
- Padding: 16px
- Elevation: 2 (use shadow for Material Design)
- Shadow: shadowOffset {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 4

**Buttons:**
- Primary: Background Primary, Text Inverse, Height 48px, Border radius 8px
- Secondary: Border Primary, Text Primary, Height 48px, Border radius 8px
- Pressed: Scale 0.98, Opacity 0.9

**Input Fields:**
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Height: 48px
- Padding: 12px 16px
- Focus: Border Primary, Border width 2px

**FAB (Floating Action Button):**
- Background: Accent
- Size: 56x56px
- Border radius: 28px (circular)
- Position: Bottom-right, 16px from edge, above tab bar
- Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Icon: Plus or relevant action icon
- Pressed: Scale 0.95

**Tab Bar:**
- Height: 60px
- Background: Surface
- Active icon: Primary color
- Inactive icon: TextTertiary
- Label: 12px, active in Primary, inactive in TextTertiary

### Required Assets
1. **Professional Avatars** (8 variations):
   - Doctor avatar (male/female)
   - Salon stylist avatar (male/female)
   - Lawyer avatar (male/female)
   - Consultant avatar (male/female)
   - Match app aesthetic: professional, friendly, modern

2. **Category Icons** (custom or Feather):
   - Doctor: stethoscope
   - Salon: scissors
   - Lawyer: briefcase
   - Consultant: users
   - Tutor: book-open

3. **App Icon/Logo:**
   - Calendar with checkmark aesthetic
   - Primary and Accent colors

### Accessibility
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for text
- Support screen readers with proper labels
- Keyboard navigation for inputs
- Loading states for all async actions