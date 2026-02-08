import axios from "axios";

// Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// //Request Interceptor: Auto-attach Token
// apiClient.interceptors.request.use(
//   (config) => {
//     const savedUser = localStorage.getItem("saaga_user");
//     if (savedUser) {
//       const { token } = JSON.parse(savedUser);
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// 3. Auth Errors Handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expires, auto-logout 
      localStorage.removeItem("saaga_user");
    }
    return Promise.reject(error);
  },
);

// API Endpoints
const api = {
  // Public Routes (No Login Required)
  public: {
    getServices: () => apiClient.get("/api/public/services"),
    getShopProducts: () => apiClient.get("/api/public/shop"),
    getOffers: () => apiClient.get("/api/public/offers"),
    getCategories: () => apiClient.get("/api/public/categories"),
    getStaff: () => apiClient.get("/api/public/staff"),
    // Dynamic Slot Fetching
    getSlots: (date, serviceIds) =>
      apiClient.get(`/api/public/slots?date=${date}&serviceIds=${serviceIds}`),
  },

  // Auth Routes
  auth: {
    sendOtp: (phone) => apiClient.post("/api/auth/send-otp", { phone }),
    verifyOtp: (phone, otp, name) =>
      apiClient.post("/api/auth/verify-otp", { phone, otp, name }),
  },

  // Booking Routes (Login Required - Token Auto-Attached)
  bookings: {
    create: (data) => apiClient.post("/api/bookings", data),
    getMyBookings: () => apiClient.get("/api/bookings/my-bookings"),
    cancel: (id) => apiClient.put(`/api/bookings/${id}/cancel`),
  },
};

export default api;
