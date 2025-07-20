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

export const getContentList = async ({ queryKey }: { queryKey: [string, number, number] }) => {
    const [_key, page, limit] = queryKey;
    const { data } = await api.get('/content?page=' + page + '&limit=' + limit);
    return data
};
