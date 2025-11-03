import axios from "axios";
import config from "../config";

// Create axios instances for different services
const createServiceInstance = (serviceConfig) => {
  const instance = axios.create({
    baseURL: serviceConfig.baseURL,
    timeout: serviceConfig.timeout,
    headers: serviceConfig.headers
  });

  // Attach auth token on every request (from localStorage)
  instance.interceptors.request.use((config) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (token) {
        // Support both common header styles used across services
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["x-access-token"] = token;
      }
    } catch (_) {
      // ignore storage errors in SSR
    }
    return config;
  });

  // Add response interceptor
  instance.interceptors.response.use(
    function (response) {
      return response.data ? response.data : response;
    },
    function (error) {
      let message;
      const status = error.response?.status || error.status;
      
      switch (status) {
        case 500:
          message = "Internal Server Error";
          break;
        case 401:
          message = error.response?.data?.message || "Invalid credentials or unauthorized access";
          break;
        case 403:
          message = error.response?.data?.message || "Access forbidden. Insufficient permissions";
          break;
        case 404:
          message = error.response?.data?.message || "Sorry! the data you are looking for could not be found";
          break;
        case 422:
          message = error.response?.data?.message || "Validation error";
          break;
        case 429:
          message = error.response?.data?.message || "Too many requests. Please try again later";
          break;
        default:
          message = error.response?.data?.message || error.message || "An error occurred";
      }
      return Promise.reject(message);
    }
  );

  return instance;
};

// Create service instances
export const authAPI = createServiceInstance(config.SERVICES.AUTH);
export const listingAPI = createServiceInstance(config.SERVICES.LISTING);
export const bookingAPI = createServiceInstance(config.SERVICES.BOOKING);
export const paymentAPI = createServiceInstance(config.SERVICES.PAYMENT);
export const communicationAPI = createServiceInstance(config.SERVICES.COMMUNICATION);
export const reviewAPI = createServiceInstance(config.SERVICES.REVIEW);
export const pricingAPI = createServiceInstance(config.SERVICES.PRICING);

// Default API instance (for backward compatibility)
axios.defaults.baseURL = config.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    const status = error.response?.status || error.status;
    
    switch (status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials or unauthorized access";
        break;
      case 403:
        message = "Access forbidden. Insufficient permissions";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      case 422:
        message = error.response?.data?.message || "Validation error";
        break;
      case 429:
        message = "Too many requests. Please try again later";
        break;
      default:
        message = error.response?.data?.message || error.message || "An error occurred";
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

/**
 * Sets the admin authorization header
 * @param {*} token
 */
const setAdminAuthorization = (token) => {
  axios.defaults.headers.common["x-access-token"] = token;
};

/**
 * Clears all authorization headers
 */
const clearAuthorization = () => {
  delete axios.defaults.headers.common["Authorization"];
  delete axios.defaults.headers.common["x-access-token"];
};

class APIClient {
  constructor(serviceInstance = axios) {
    this.service = serviceInstance;
  }

  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    // Sanitize params and let axios build the query string to avoid sending undefined values
    if (params && typeof params === 'object') {
      const sanitized = {};
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
          sanitized[key] = value;
        }
      });
      return this.service.get(url, { params: sanitized });
    }
    return this.service.get(url);
  }

  /**
   * post given data to url
   */
  create = (url, data) => {
    return this.service.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    return this.service.put(url, data);
  };

  /**
   * Patch data (partial update)
   */
  patch = (url, data) => {
    return this.service.patch(url, data);
  };

  /**
   * Delete
   */
  delete = (url, config) => {
    return this.service.delete(url, { ...config });
  };
}

// Create service-specific API clients
export const AuthAPIClient = new APIClient(authAPI);
export const ListingAPIClient = new APIClient(listingAPI);
export const BookingAPIClient = new APIClient(bookingAPI);
export const PaymentAPIClient = new APIClient(paymentAPI);
export const CommunicationAPIClient = new APIClient(communicationAPI);
export const ReviewAPIClient = new APIClient(reviewAPI);
export const PricingAPIClient = new APIClient(pricingAPI);
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, setAdminAuthorization, clearAuthorization, getLoggedinUser };