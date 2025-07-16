import api from '../utils/axios';

interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export const loginUser = (email: string, password: string, role: string) =>
    api.post('/auth/login', { email, password, role });

export const logoutUser = () =>
    api.post('/auth/logout');

export const createUser = (user: User) =>
    api.post('/auth/signup', { ...user });

export const fetchCurrentUser = () =>
    api.get('/users/profile');

export const fetchUsers = async () => {
    const { data } = await api.get('/users');
    return data
};
