import { Product } from '../types';

const API_BASE_URL = '/api';

// Helper to get the token from localStorage
const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user).token;
  }
  return null;
};

// Helper to construct authorization headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const addProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  return response.json();
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${updatedProduct._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedProduct),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};
