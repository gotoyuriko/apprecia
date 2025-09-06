import { useState, useMemo } from 'react';
import { useArtwork } from './ArtworkContext';

export const useArtworkFilters = () => {
    const { filteredData, artworksData } = useArtwork();
    const [sortBy, setSortBy] = useState('newest');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [skillFilter, setSkillFilter] = useState('all');

    // Get unique categories and skills for filter options
    const filterOptions = useMemo(() => {
        const categories = new Set();
        const skills = new Set();

        artworksData.forEach(artwork => {
            if (artwork.project_category) {
                categories.add(artwork.project_category);
            }
            if (artwork.project_skills) {
                artwork.project_skills.forEach(skill => {
                    skills.add(skill.value);
                });
            }
        });

        return {
            categories: Array.from(categories).sort(),
            skills: Array.from(skills).sort()
        };
    }, [artworksData]);

    // Apply filters and sorting
    const filteredAndSortedData = useMemo(() => {
        let filtered = [...filteredData];

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(artwork => 
                artwork.project_category === categoryFilter ||
                artwork.project_skills?.some(skill => skill.value === categoryFilter) ||
                artwork.project_tags?.some(tag => tag.value === categoryFilter)
            );
        }

        // Apply skill filter
        if (skillFilter !== 'all') {
            filtered = filtered.filter(artwork => 
                artwork.project_skills?.some(skill => skill.value === skillFilter) ||
                artwork.project_tags?.some(tag => tag.value === skillFilter)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.project_createdAt) - new Date(a.project_createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.project_createdAt) - new Date(b.project_createdAt));
                break;
            case 'mostLiked':
                filtered.sort((a, b) => (b.project_likesCount || 0) - (a.project_likesCount || 0));
                break;
            case 'mostViewed':
                filtered.sort((a, b) => (b.project_viewsCount || 0) - (a.project_viewsCount || 0));
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.project_title.localeCompare(b.project_title));
                break;
            default:
                break;
        }

        return filtered;
    }, [filteredData, categoryFilter, skillFilter, sortBy]);

    // Reset all filters
    const resetFilters = () => {
        setCategoryFilter('all');
        setSkillFilter('all');
        setSortBy('newest');
    };

    return {
        // State
        sortBy,
        setSortBy,
        categoryFilter,
        setCategoryFilter,
        skillFilter,
        setSkillFilter,
        
        // Data
        filteredAndSortedData,
        filterOptions,
        
        // Actions
        resetFilters,
        
        // Computed values
        totalResults: filteredAndSortedData.length,
        hasActiveFilters: categoryFilter !== 'all' || skillFilter !== 'all'
    };
}; 