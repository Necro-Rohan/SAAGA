// API Base URL
const API_BASE_URL = 'http://localhost:5001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('adminToken');
};

// Helper function to create authenticated fetch requests
const authFetch = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
        throw new Error('Unauthorized - redirecting to login');
    }

    return response;
};

// API methods
export const api = {
    // Generic methods
    get: (endpoint, options = {}) => authFetch(endpoint, { method: 'GET', ...options }),
    post: (endpoint, data, options = {}) => authFetch(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
    put: (endpoint, data, options = {}) => authFetch(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
    delete: (endpoint, options = {}) => authFetch(endpoint, { method: 'DELETE', ...options }),

    // Bookings
    bookings: {
        getAll: () => api.get('/api/admin/bookings'),
    },

    // Services
    services: {
        getAll: () => api.get('/api/admin/services'),
        create: (data) => api.post('/api/admin/services', data),
        update: (id, data) => api.put(`/api/admin/services/${id}`, data),
        delete: (id) => api.delete(`/api/admin/services/${id}`),
    },

    // Products
    products: {
        getAll: () => api.get('/api/admin/products'),
        create: (data) => api.post('/api/admin/products', data),
        update: (id, data) => api.put(`/api/admin/products/${id}`, data),
        delete: (id) => api.delete(`/api/admin/products/${id}`),
    },

    // Offers
    offers: {
        getAll: () => api.get('/api/admin/offers'),
        create: (data) => api.post('/api/admin/offers', data),
        delete: (id) => api.delete(`/api/admin/offers/${id}`),
    },

    // Profile
    profile: {
        get: () => api.get('/api/admin/profile'),
    },
};

export default api;
