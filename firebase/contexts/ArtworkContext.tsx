import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import GetArtworks from '../artworks/GetArtworks';
import GetUsers from '../users/GetUsers';
import {
    filterArtworksByKeyword,
    filterArtworksByCategory,
    filterArtworksByCreator,
} from '../../utils/searchUtils';
import type { ArtProject, AppUser } from '@/types';

interface ArtworkContextValue {
    artworksData: ArtProject[];
    usersData: AppUser[];
    filteredData: ArtProject[];
    loading: boolean;
    error: string | null;
    searchArtworks: (keyword: string) => void;
    filterByCategory: (category: string) => void;
    filterByCreator: (creatorEmail: string) => void;
    getArtworkById: (artworkId: string) => ArtProject | undefined;
    getUserByEmail: (email: string) => AppUser | undefined;
    refreshData: () => Promise<void>;
    clearFilters: () => void;
    getStats: () => { totalArtworks: number; totalUsers: number; totalCategories: number; totalSkills: number };
    setFilteredData: Dispatch<SetStateAction<ArtProject[]>>;
}

const ArtworkContext = createContext<ArtworkContextValue>(null!);

export const useArtwork = (): ArtworkContextValue => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
    const [artworksData, setArtworksData] = useState<ArtProject[]>([]);
    const [usersData, setUsersData] = useState<AppUser[]>([]);
    const [filteredData, setFilteredData] = useState<ArtProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [artworkData, userData] = await Promise.all([
                    GetArtworks(),
                    GetUsers()
                ]);
                setArtworksData(artworkData || []);
                setUsersData(userData || []);
                setFilteredData(artworkData || []);
            } catch (err: unknown) {
                console.error('Error fetching artwork data:', err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const searchArtworks = (searchKeyword: string) => {
        setFilteredData(filterArtworksByKeyword(artworksData, usersData, searchKeyword));
    };

    const filterByCategory = (category: string) => {
        setFilteredData(filterArtworksByCategory(artworksData, category));
    };

    const filterByCreator = (creatorEmail: string) => {
        setFilteredData(filterArtworksByCreator(artworksData, creatorEmail));
    };

    const getArtworkById = (artworkId: string): ArtProject | undefined => {
        return artworksData.find(artwork => artwork.id === artworkId);
    };

    const getUserByEmail = (email: string): AppUser | undefined => {
        return usersData.find(user => user.user_email === email);
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [artworkData, userData] = await Promise.all([
                GetArtworks(),
                GetUsers()
            ]);
            setArtworksData(artworkData || []);
            setUsersData(userData || []);
            setFilteredData(artworkData || []);
        } catch (err: unknown) {
            console.error('Error refreshing artwork data:', err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilteredData(artworksData);
    };

    const getStats = () => ({
        totalArtworks: artworksData.length,
        totalUsers: usersData.length,
        totalCategories: new Set(artworksData.map(a => a.project_category)).size,
        totalSkills: new Set(artworksData.flatMap(a => a.project_skills?.map(s => s.value) || [])).size,
    });

    const value: ArtworkContextValue = {
        artworksData,
        usersData,
        filteredData,
        loading,
        error,
        searchArtworks,
        filterByCategory,
        filterByCreator,
        getArtworkById,
        getUserByEmail,
        refreshData,
        clearFilters,
        getStats,
        setFilteredData,
    };

    return (
        <ArtworkContext.Provider value={value}>
            {children}
        </ArtworkContext.Provider>
    );
};
