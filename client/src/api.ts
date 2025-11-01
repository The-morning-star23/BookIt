import axios from 'axios';

// Get the root URL from the environment variable we created
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: `${API_ROOT}/api`,
});

export default api;
export { API_ROOT };