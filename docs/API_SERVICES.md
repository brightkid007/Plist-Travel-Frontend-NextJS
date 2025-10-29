# API Services Configuration

This document explains how to configure the microservices architecture for the Plist Travel SaaS Frontend.

## Service URLs

The application supports multiple microservices with different base URLs:

### Development URLs (Default)
```javascript
AUTH_SERVICE: "http://localhost:3001/api"
LISTING_SERVICE: "http://localhost:3002/api"
BOOKING_SERVICE: "http://localhost:3003/api"
PAYMENT_SERVICE: "http://localhost:3004/api"
COMMUNICATION_SERVICE: "http://localhost:3005/api"
REVIEW_SERVICE: "http://localhost:3006/api"
PRICING_SERVICE: "http://localhost:3007/api"
ADMIN_SERVICE: "http://localhost:3008/api"
```

### Production URLs
Set these environment variables in your production environment:

```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.plisttravel.com/api
NEXT_PUBLIC_LISTING_SERVICE_URL=https://listing.plisttravel.com/api
NEXT_PUBLIC_BOOKING_SERVICE_URL=https://booking.plisttravel.com/api
NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://payment.plisttravel.com/api
NEXT_PUBLIC_COMMUNICATION_SERVICE_URL=https://communication.plisttravel.com/api
NEXT_PUBLIC_REVIEW_SERVICE_URL=https://review.plisttravel.com/api
NEXT_PUBLIC_PRICING_SERVICE_URL=https://pricing.plisttravel.com/api
NEXT_PUBLIC_ADMIN_SERVICE_URL=https://admin.plisttravel.com/api
```

## Service-Specific API Clients

### Authentication Service
```javascript
import { AuthAPIClient } from "@/helpers/api_helper";
import { loginUser, registerUser } from "@/helpers/auth_helper";

// Direct API calls
const response = await AuthAPIClient.get("/users");

// Using helper functions
const user = await loginUser(credentials);
```

### Listing Service
```javascript
import { ListingAPIClient } from "@/helpers/api_helper";
import { getListings, createListing } from "@/helpers/listing_helper";

// Direct API calls
const response = await ListingAPIClient.get("/listings");

// Using helper functions
const listings = await getListings({ status: 'active' });
```

### Booking Service
```javascript
import { BookingAPIClient } from "@/helpers/api_helper";
import { getBookings, createBooking } from "@/helpers/booking_helper";

// Direct API calls
const response = await BookingAPIClient.get("/bookings");

// Using helper functions
const bookings = await getBookings({ status: 'confirmed' });
```

### Admin Service
```javascript
import { AdminAPIClient } from "@/helpers/api_helper";
import { getAdminDashboard, getAdminUsers } from "@/helpers/backend_helper";

// Direct API calls
const response = await AdminAPIClient.get("/dashboard");

// Using helper functions
const dashboard = await getAdminDashboard();
```

## Configuration

### Environment Variables
Create a `.env.local` file in your project root:

```bash
# Authentication Service
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001/api

# Listing Service
NEXT_PUBLIC_LISTING_SERVICE_URL=http://localhost:3002/api

# Booking Service
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3003/api

# Payment Service
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004/api

# Communication Service
NEXT_PUBLIC_COMMUNICATION_SERVICE_URL=http://localhost:3005/api

# Review Service
NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost:3006/api

# Pricing Service
NEXT_PUBLIC_PRICING_SERVICE_URL=http://localhost:3007/api

# Admin Service
NEXT_PUBLIC_ADMIN_SERVICE_URL=http://localhost:3008/api
```

### Service Configuration
Each service has its own configuration in `config/index.js`:

```javascript
SERVICES: {
  AUTH: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3001/api",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  // ... other services
}
```

## Usage Examples

### Admin Dashboard Integration
```javascript
// In admin dashboard component
import { 
  getAdminDashboard, 
  getAdminUsers, 
  getAdminBookings 
} from "@/helpers/backend_helper";

const loadDashboardData = async () => {
  try {
    const [dashboard, users, bookings] = await Promise.all([
      getAdminDashboard(),
      getAdminUsers({ limit: 10 }),
      getAdminBookings({ status: 'pending' })
    ]);
    
    setDashboardData(dashboard);
    setUsers(users);
    setBookings(bookings);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
};
```

### User Authentication
```javascript
// In login component
import { loginUser, setUserAuth } from "@/helpers/auth_helper";

const handleLogin = async (credentials) => {
  try {
    const response = await loginUser(credentials);
    setUserAuth(response.token);
    setLoggedInUser(response.user);
    router.push("/dashboard");
  } catch (error) {
    setError(error.message);
  }
};
```

### Listing Management
```javascript
// In listing component
import { getListings, createListing } from "@/helpers/listing_helper";

const loadListings = async () => {
  try {
    const listings = await getListings({ 
      status: 'active',
      category: 'hotel' 
    });
    setListings(listings);
  } catch (error) {
    console.error("Failed to load listings:", error);
  }
};
```

## Benefits

1. **Service Isolation**: Each microservice has its own API client
2. **Independent Scaling**: Services can be scaled independently
3. **Fault Tolerance**: Failure in one service doesn't affect others
4. **Technology Flexibility**: Each service can use different technologies
5. **Team Autonomy**: Different teams can work on different services
6. **Easy Testing**: Services can be mocked independently

## Migration Guide

### From Single API to Microservices

1. **Update imports**:
   ```javascript
   // Old
   import { APIClient } from "@/helpers/api_helper";
   
   // New
   import { AuthAPIClient, ListingAPIClient } from "@/helpers/api_helper";
   ```

2. **Update API calls**:
   ```javascript
   // Old
   const api = new APIClient();
   const users = await api.get("/users");
   
   // New
   const users = await AuthAPIClient.get("/users");
   ```

3. **Use service-specific helpers**:
   ```javascript
   // Old
   import { getUsers } from "@/helpers/backend_helper";
   
   // New
   import { getUsers } from "@/helpers/auth_helper";
   ```
