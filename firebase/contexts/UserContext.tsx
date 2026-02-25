import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import GetUsers from '../users/GetUsers';
import GetUser from '../users/GetUser';
import AddUser from '../users/AddUser';
import UpdateUser from '../users/UpdateUser';
import { useFetchData } from '../hooks/useFetchData';
import type { AppUser } from '@/types';

interface UserContextValue {
    users: AppUser[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    fetchUserByEmail: (email: string) => Promise<any>;
    createUser: (userData: any) => Promise<any>;
    updateUser: (userId: any, updates: any) => Promise<any>;
    searchUsers: (query: string) => AppUser[];
    getUserById: (userId: string) => AppUser | undefined;
}

const UserContext = createContext<UserContextValue>(null!);

export const useUser = (): UserContextValue => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);

    const fetchFn = useCallback(GetUsers, []);
    const { data: users, loading, error: fetchError, refresh: fetchUsers } = useFetchData(fetchFn, []);

    const fetchUserByEmail = async (email: string): Promise<any> => {
        try {
            return await GetUser(email);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const createUser = async (userData: any): Promise<any> => {
        try {
            return await AddUser(userData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const updateUser = async (userId: any, updates: any): Promise<any> => {
        try {
            return await (UpdateUser as any)(userId, updates);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const searchUsers = (query: string): AppUser[] => {
        if (!query) return users || [];
        return (users || []).filter((user: any) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
        );
    };

    const getUserById = (userId: string): AppUser | undefined => {
        return (users || []).find((user: any) => user.id === userId);
    };

    const value: UserContextValue = {
        users: users || [],
        loading,
        error: error || fetchError,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        updateUser,
        searchUsers,
        getUserById,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
