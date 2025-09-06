import React, { createContext, useContext, useState, useEffect } from 'react';
import GetArtGalleries from '../tours/GetArtGalleries';
import AddArtGallery from '../tours/AddArtGallery';
import UpdateArtGallery from '../tours/UpdateArtGallery';
import DeleteTour from '../tours/DeleteTour';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetArtGalleries();
      setTours(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTour = async (tourData) => {
    try {
      const newTour = await AddArtGallery(tourData);
      setTours(prev => [...prev, newTour]);
      return newTour;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTour = async (tourId, updates) => {
    try {
      const updatedTour = await UpdateArtGallery(tourId, updates);
      setTours(prev => prev.map(tour => tour.id === tourId ? updatedTour : tour));
      return updatedTour;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTour = async (tourId) => {
    try {
      await DeleteTour(tourId);
      setTours(prev => prev.filter(tour => tour.id !== tourId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getToursByUser = (userId) => {
    return tours.filter(tour => tour.createdBy === userId);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const value = {
    tours,
    loading,
    error,
    fetchTours,
    createTour,
    updateTour,
    deleteTour,
    getToursByUser
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};
