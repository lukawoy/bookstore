import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
});

// Favorite
export const fetchMyFavorite = (headers, limit, offset) => api.get(`myfavorite/?limit=${limit}&offset=${offset}`, headers);
export const fetchDeleteFavorite = (headers, bookId) => api.delete(`books/${bookId}/favorite/`, headers);
export const fetchAddFavorite = (headers, bookId, data) => api.post(`books/${bookId}/favorite/`, headers, data);

// Card
export const fetchCard = (headers, limit, offset) => api.get(`myshopinglist/?limit=${limit}&offset=${offset}`, headers);
export const fetchDeleteCard = (headers, bookId) => api.delete(`books/${bookId}/remove-book-from-cart/`, headers);
export const fetchAddCard = (headers, bookId, data) => api.post(`books/${bookId}/add-to-cart/`, headers, data);

// Book
export const fetchBooks = (headers, limit, offset, search) => api.get(`books/?limit=${limit}&offset=${offset}&search=${search}`, headers);
export const fetchOneBook = (headers, bookId) => api.get(`books/${bookId}/`, headers);
export const fetchRandBook = (headers) => api.get('books/random_book/', headers);

// Review
export const fetchReviews = () => api.get('reviews/');
export const fetchBookReviews = (bookId) => api.get(`books/${bookId}/reviews/`);
export const fetchAddReviews = (headers, bookId, data) => api.post(`books/${bookId}/reviews/`, headers, data);
export const fetchEditReviews = (headers, bookId, reviewId, data) => api.put(`books/${bookId}/reviews/${reviewId}/`, headers, data);
export const fetchDeleteReviews = (headers, bookId, reviewId) => api.delete(`books/${bookId}/reviews/${reviewId}/`, headers);

// Users
export const fetchlogin = (data) => api.post('auth/login/', data);
export const fetchRegister = (data) => api.post('users/', data);
export const fetchProfile = (headers) => api.get('users/me/', headers);
export const fetchResetEmail = (headers, data) => api.post('users/set_email/', headers, data);
export const fetchResetPassword = (headers, data) => api.post('users/set_password/', headers, data);
export const fetchDeleteUser = (headers, data) => api.delete('users/me/', headers, data);
