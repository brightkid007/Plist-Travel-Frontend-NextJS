// API Configuration for Microservices
const config = {
  // Base URLs for different microservices
  API_URLS: {
    // Authentication & User Service
    AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8081/api",
    
    // Listing Service
    LISTING_SERVICE: process.env.NEXT_PUBLIC_LISTING_SERVICE_URL || "http://localhost:8082/api",
    
    // Booking Service
    BOOKING_SERVICE: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || "http://localhost:8083/api",
    
    // Payment Service
    PAYMENT_SERVICE: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8084/api",
    
    // Communication Service
    COMMUNICATION_SERVICE: process.env.NEXT_PUBLIC_COMMUNICATION_SERVICE_URL || "http://localhost:8085/api",
    
    // Review & Rating Service
    REVIEW_SERVICE: process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL || "http://localhost:8086/api",
    
    // Pricing & Loyalty Service
    PRICING_SERVICE: process.env.NEXT_PUBLIC_PRICING_SERVICE_URL || "http://localhost:8087/api",
    
    // Admin Service (if separate)
    ADMIN_SERVICE: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || "http://localhost:8088/api",
  },

  // Default API URL (for backward compatibility)
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",

  // Service-specific configurations
  SERVICES: {
    AUTH: {
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8081/api",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    LISTING: {
      baseURL: process.env.NEXT_PUBLIC_LISTING_SERVICE_URL || "http://localhost:8082/api",
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    BOOKING: {
      baseURL: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || "http://localhost:8083/api",
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
     PAYMENT: {
       baseURL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8084/api",
       timeout: 30000,
       headers: {
         'Content-Type': 'application/json',
       }
     },
    COMMUNICATION: {
      baseURL: process.env.NEXT_PUBLIC_COMMUNICATION_SERVICE_URL || "http://localhost:8085/api",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    REVIEW: {
      baseURL: process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL || "http://localhost:8086/api",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    PRICING: {
      baseURL: process.env.NEXT_PUBLIC_PRICING_SERVICE_URL || "http://localhost:8087/api",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    ADMIN: {
      baseURL: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || "http://localhost:8088/api",
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },

  // Environment
  ENV: process.env.NODE_ENV || 'development',
  
  // Debug mode
  DEBUG: process.env.NODE_ENV === 'development',
};

export default config;
