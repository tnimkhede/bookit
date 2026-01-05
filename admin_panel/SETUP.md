# Admin Panel Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Running backend server (see backend/SETUP.md)

## Installation Steps

### 1. Install Dependencies

```bash
cd admin_panel
npm install
```

### 2. Environment Configuration

The admin panel connects to the backend API. By default, it uses `http://localhost:5000/api`.

If your backend runs on a different port, update the API URL in:
- `src/services/api.js`
- `src/services/analyticsService.js`

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will start at `http://localhost:5173`

## Default Login Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

> **Important**: Change these credentials after first login via the Settings page!

## Features

### Dashboard
- Platform overview statistics
- Interactive charts (appointments trend, status distribution)
- Quick action buttons
- Real-time data updates

### Users Management
- View all users (clients and professionals)
- Search and filter functionality
- User role management
- Delete users

### Professionals Management
- View all professionals
- Approve/reject professional applications
- Category filtering
- Rating management

### Appointments Management
- View all appointments
- Filter by status
- Update appointment status
- View appointment details

### Analytics (New)
- Comprehensive data visualization
- Appointment trends over time
- User growth analytics
- Professional performance metrics
- Category distribution charts
- Date range selector (7/30/90 days)

### Settings (New)
- Profile management
- Password change
- Theme toggle (Dark/Light mode)
- Notification preferences

## UI/UX Features

### Modern Design System
- Vibrant gradient color palette
- Glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design for all screen sizes

### Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage
- Smooth theme transitions

### Interactive Charts
- Built with Recharts library
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Fully responsive

### Animations
- Page transitions
- Card hover effects
- Button interactions
- Loading states

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Deployment

The built files can be deployed to any static hosting service:

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Traditional Server:**
```bash
# Copy dist folder to your web server
scp -r dist/* user@server:/var/www/html/admin
```

## Project Structure

```
admin_panel/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx   # Top navigation bar
│   │   ├── Sidebar.jsx  # Side navigation
│   │   ├── Layout.jsx   # Main layout wrapper
│   │   └── StatsCard.jsx # Statistics card component
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.jsx # Theme management
│   ├── hooks/           # Custom hooks
│   │   └── useTheme.js  # Theme hook
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Professionals.jsx
│   │   ├── Appointments.jsx
│   │   ├── Analytics.jsx (New)
│   │   ├── Settings.jsx (New)
│   │   └── Login.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── index.js
│   │   └── analyticsService.js (New)
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

To specify a custom port:
```bash
npm run dev -- --port 3000
```

### API Connection Issues

If you see "Network Error" or API connection failures:

1. Verify the backend server is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check CORS settings in backend `server.js`

3. Verify API URLs in service files match your backend

### Build Errors

If you encounter build errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

### Theme Not Persisting

If theme changes don't persist:
- Check browser localStorage is enabled
- Clear browser cache and try again

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. **Code Splitting**: Vite automatically code-splits for optimal loading
2. **Lazy Loading**: Consider lazy loading routes for faster initial load
3. **Image Optimization**: Use WebP format for images
4. **Caching**: Configure proper cache headers on your server

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage
2. **HTTPS**: Always use HTTPS in production
3. **API Keys**: Never commit API keys to version control
4. **CORS**: Configure proper CORS origins in backend

## Support

For issues or questions:
- Check backend logs for API errors
- Use browser DevTools to debug frontend issues
- Review network tab for API call failures
