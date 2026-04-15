const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/+$/, '');

export const API_ENDPOINTS = {
    products: `${baseUrl}/api/products`,
    cart: `${baseUrl}/api/cart`,
    orders: `${baseUrl}/api/orders`,
    authRegister: `${baseUrl}/api/auth/register`,
    authLogin: `${baseUrl}/api/auth/login`,
    authRefresh: `${baseUrl}/api/auth/refresh`,
};