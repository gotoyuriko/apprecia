import React, { createContext, useContext, useState, useEffect } from 'react';
import GetUsers from '../users/GetUsers';
import GetUser from '../users/GetUser';
import AddUser from '../users/AddUser';
import UpdateUser from '../users/UpdateUser';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByEmail = async (email) => {
    try {
      const user = await GetUser(email);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await AddUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const updatedUser = await UpdateUser(userId, updates);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      return updatedUser;
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserByEmail,
    createUser,
    updateUser,
    searchUsers,
    getUserById
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
