import { useMemo } from 'react';
import { useArtwork } from '../contexts/ArtworkContext';
import { useUser } from '../contexts/UserContext';

export const useArtworkWithUser = () => {
  const { artworksData, loading: artworkLoading, error: artworkError } = useArtwork();
  const { users, loading: userLoading, error: userError } = useUser();

  const loading = artworkLoading || userLoading;
  const error = artworkError || userError;

  const artworksWithCreators = useMemo(() => {
    if (!artworksData || !users) return [];
    
    return artworksData.map(artwork => {
      const creator = users.find(user => user.email === artwork.creator);
      return {
        ...artwork,
        creatorData: creator
      };
    });
  }, [artworksData, users]);

  const getArtworksByCreator = (creatorEmail) => {
    return artworksWithCreators.filter(artwork => artwork.creator === creatorEmail);
  };

  const getArtworksByCategory = (category) => {
    return artworksWithCreators.filter(artwork => artwork.category === category);
  };

  const getArtworkWithCreator = (creator, createdAt) => {
    return artworksWithCreators.find(artwork => 
      artwork.creator === creator && artwork.createdAt === createdAt
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
