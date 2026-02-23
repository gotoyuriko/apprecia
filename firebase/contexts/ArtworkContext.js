import { createContext, useContext, useEffect, useState } from 'react';
import GetArtworks from '../artworks/GetArtworks';
import GetUsers from '../users/GetUsers';
import {
    filterArtworksByKeyword,
    filterArtworksByCategory,
    filterArtworksByCreator,
} from '../../utils/searchUtils';

// Create the context
const ArtworkContext = createContext();

// Custom hook to use the artwork context
export const useArtwork = () => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};

// Provider component
export const ArtworkProvider = ({ children }) => {
    const [artworksData, setArtworksData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch artworks and users in parallel
                const [artworkData, userData] = await Promise.all([
                    GetArtworks(),
                    GetUsers()
                ]);
                
                setArtworksData(artworkData || []);
                setUsersData(userData || []);
                setFilteredData(artworkData || []);
            } catch (err) {
                console.error('Error fetching artwork data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Search and filter functionality
    const searchArtworks = (searchKeyword) => {
        setFilteredData(filterArtworksByKeyword(artworksData, usersData, searchKeyword));
    };

    // Filter by category/type
    const filterByCategory = (category) => {
        setFilteredData(filterArtworksByCategory(artworksData, category));
    };

    // Filter by creator
    const filterByCreator = (creatorEmail) => {
        setFilteredData(filterArtworksByCreator(artworksData, creatorEmail));
    };

    // Get artwork by ID
    const getArtworkById = (artworkId) => {
        return artworksData.find(artwork => artwork.id === artworkId);
    };

    // Get user by email
    const getUserByEmail = (email) => {
        return usersData.find(user => user.user_email === email);
    };

    // Refresh data
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
        } catch (err) {
            console.error('Error refreshing artwork data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Clear filters
    const clearFilters = () => {
        setFilteredData(artworksData);
    };

    // Get statistics
    const getStats = () => {
        return {
            totalArtworks: artworksData.length,
            totalUsers: usersData.length,
            totalCategories: new Set(artworksData.map(a => a.project_category)).size,
            totalSkills: new Set(artworksData.flatMap(a => a.project_skills?.map(s => s.value) || [])).size,
        };
    };

    const value = {
        // State
        artworksData,
        usersData,
        filteredData,
        loading,
        error,
        
        // Actions
        searchArtworks,
        filterByCategory,
        filterByCreator,
        getArtworkById,
        getUserByEmail,
        refreshData,
        clearFilters,
        getStats,
        
        // Setters
        setFilteredData,
    };

    return (
        <ArtworkContext.Provider value={value}>
            {children}
        </ArtworkContext.Provider>
    );
}; 