const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get the JWT token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper function to set the JWT token in localStorage
const setToken = (token) => localStorage.setItem("token", token);

// Helper function to remove the JWT token from localStorage
const removeToken = () => localStorage.removeItem("token");

// Generic fetch wrapper to handle API requests
const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = getToken(); // Automatically fetch token
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Auto-include token
  }

  const config = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
};

// Authentication APIs
const login = async (username, password) => {
  const data = await apiRequest("/auth/login", "POST", { username, password });
  setToken(data.token);
  return { token: data.token, role: data.role };
};

const register = async (username, password, role) => {
  const data = await apiRequest("/auth/register", "POST", {
    username,
    password,
    role,
  });
  return data;
};

// Product APIs
const getProducts = async () => {
  return apiRequest("/products");
};

const searchProducts = async (searchTerm) => {
  // Assuming backend supports a query parameter for searching by name or SKU
  // If not, we'll filter locally after fetching all products
  const products = await getProducts();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const addProduct = async (productData) => {
  return apiRequest("/products", "POST", productData); // Token is now auto-included
};

const updateProduct = async (id, productData) => {
  const token = getToken();
  return apiRequest(`/products/${id}`, "PUT", productData, token);
};

// Transaction APIs
const createTransaction = async (cashierId, items, total) => {
  const token = getToken();
  return apiRequest(
    "/transactions",
    "POST",
    { cashierId, items, total },
    token
  );
};

const getTransactions = async () => {
  const token = getToken();
  return apiRequest("/transactions", token);
};

// Logout function to clear token
const logout = () => {
  removeToken();
};

export {
  login,
  register,
  getProducts,
  searchProducts,
  addProduct,
  updateProduct,
  createTran