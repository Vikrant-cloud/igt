import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentUser, loginUser, logoutUser } from '@/api/auth';
import { toast } from 'react-toastify';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    subscriptionStatus?: string;
    currentPeriodEnd?: string | number;
    profilePicture?: string;
    isVerified?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, role: string) => Promise<{ message?: string; user: User; token: string;[key: string]: any }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser()
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login: any = async (email: string, password: string, role: string) => {
        let loggedInUser = {};
        await loginUser(email, password, role).then((res) => {
            toast.success(res.data.message);
            loggedInUser = res.data.user;
        }).catch((error) => {
            toast.error(error.response.data.message);
        })
        await fetchCurrentUser().then((res) => {
            setUser(res.data.user);
        }).catch((error) => {
            toast.error(error.response.message)
        })
        setLoading(false);
        return loggedInUser
    };

    const logout = async () => {
        await logoutUser();
        toast.success("Logout successfull.");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
