import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import GetArtGalleries from '../tours/GetArtGalleries';
import AddArtGallery from '../tours/AddArtGallery';
import UpdateArtGallery from '../tours/UpdateArtGallery';
import DeleteTour from '../tours/DeleteTour';
import { useFetchData } from '../hooks/useFetchData';
import type { ArtGallery } from '@/types';

interface TourContextValue {
    tours: ArtGallery[];
    loading: boolean;
    error: string | null;
    fetchTours: () => Promise<void>;
    createTour: (tourData: any) => Promise<any>;
    updateTour: (tourId: any, updates: any) => Promise<any>;
    deleteTour: (tourId: string) => Promise<void>;
    getToursByUser: (userId: string) => ArtGallery[];
}

const TourContext = createContext<TourContextValue>(null!);

export const useTour = (): TourContextValue => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};

export const TourProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);

    const fetchFn = useCallback(GetArtGalleries, []);
    const { data: tours, loading, error: fetchError, refresh: fetchTours } = useFetchData(fetchFn, []);

    const createTour = async (tourData: any): Promise<any> => {
        try {
            return await AddArtGallery(tourData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const updateTour = async (tourId: any, updates: any): Promise<any> => {
        try {
            return await (UpdateArtGallery as any)(tourId, updates);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const deleteTour = async (tourId: string): Promise<void> => {
        try {
            await DeleteTour(tourId);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const getToursByUser = (userId: string): ArtGallery[] => {
        return (tours || []).filter((tour: any) => tour.createdBy === userId);
    };

    const value: TourContextValue = {
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
