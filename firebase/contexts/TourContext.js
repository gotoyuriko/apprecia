import React, { createContext, useContext, useState, useCallback } from 'react';
import GetArtGalleries from '../tours/GetArtGalleries';
import AddArtGallery from '../tours/AddArtGallery';
import UpdateArtGallery from '../tours/UpdateArtGallery';
import DeleteTour from '../tours/DeleteTour';
import { useFetchData } from '../hooks/useFetchData';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // useFetchData handles the initial load, loading flag, and error state.
  const fetchFn = useCallback(GetArtGalleries, []);
  const { data: tours, loading, error: fetchError, refresh: fetchTours } = useFetchData(fetchFn, []);

  const createTour = async (tourData) => {
    try {
      return await AddArtGallery(tourData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTour = async (tourId, updates) => {
    try {
      return await UpdateArtGallery(tourId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTour = async (tourId) => {
    try {
      await DeleteTour(tourId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getToursByUser = (userId) => {
    return (tours || []).filter(tour => tour.createdBy === userId);
  };

  const value = {
    tours: tours || [],
    loading,
    error: error || fetchError,
    fetchTours,
    createTour,
    updateTour,
    deleteTour,
    getToursByUser,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};
