import React, { createContext, useContext, useState, useCallback } from 'react';
import GetUsers from '../users/GetUsers';
import GetUser from '../users/GetUser';
import AddUser from '../users/AddUser';
import UpdateUser from '../users/UpdateUser';
import { useFetchData } from '../hooks/useFetchData';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // useFetchData handles the initial load, loading flag, and error state.
  const fetchFn = useCallback(GetUsers, []);
  const { data: users, loading, error: fetchError, refresh: fetchUsers } = useFetchData(fetchFn, []);

  const fetchUserByEmail = async (email) => {
    try {
      return await GetUser(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createUser = async (userData) => {
    try {
      return await AddUser(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      return await UpdateUser(userId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchUsers = (query) => {
    if (!query) return users;
    return users.filter(user =>
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const value = {
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
