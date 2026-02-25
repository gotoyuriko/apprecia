import { useMemo } from 'react';
import { useArtwork } from '../contexts/ArtworkContext';
import { useUser } from '../contexts/UserContext';
import type { ArtProject, AppUser } from '@/types';

type ArtworkWithCreator = ArtProject & { creatorData: AppUser | undefined };

export const useArtworkWithUser = () => {
    const { artworksData, loading: artworkLoading, error: artworkError } = useArtwork();
    const { users, loading: userLoading, error: userError } = useUser();

    const loading = artworkLoading || userLoading;
    const error = artworkError || userError;

    const artworksWithCreators = useMemo((): ArtworkWithCreator[] => {
        if (!artworksData || !users) return [];
        return artworksData.map(artwork => {
            const creator = users.find((user: any) => user.email === artwork.project_creator);
            return { ...artwork, creatorData: creator };
        });
    }, [artworksData, users]);

    const getArtworksByCreator = (creatorEmail: string): ArtworkWithCreator[] => {
        return artworksWithCreators.filter(artwork => artwork.project_creator === creatorEmail);
    };

    const getArtworksByCategory = (category: string): ArtworkWithCreator[] => {
        return artworksWithCreators.filter(artwork => artwork.project_category === category);
    };

    const getArtworkWithCreator = (creator: string, createdAt: string): ArtworkWithCreator | undefined => {
        return artworksWithCreators.find(artwork =>
            artwork.project_creator === creator && artwork.project_createdAt === createdAt
        );
    };

    return {
        artworksWithCreators,
        loading,
        error,
        getArtworksByCreator,
        getArtworksByCategory,
        getArtworkWithCreator
    };
};
