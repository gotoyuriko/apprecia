import React, { createContext, useContext, useState } from 'react';
import UpdateLike from '../likes/UpdateLike';

const LikeContext = createContext();

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
};

export const LikeProvider = ({ children }) => {
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const toggleLike = async (creator, createdAt, userId) => {
    const artworkKey = `${creator}_${createdAt}`;
    const currentlyLiked = userLikes[artworkKey]?.[userId] || false;
    const newLikedState = !currentlyLiked;

    // Optimistic update
    setUserLikes(prev => ({
      ...prev,
      [artworkKey]: {
        ...prev[artworkKey],
        [userId]: newLikedState
      }
    }));

    setLikes(prev => ({
      ...prev,
      [artworkKey]: (prev[artworkKey] || 0) + (newLikedState ? 1 : -1)
    }));

    try {
      await UpdateLike(creator, createdAt, newLikedState, userId);
    } catch (err) {
      // Revert optimistic update on error
      setUserLikes(prev => ({
        ...prev,
        [artworkKey]: {
          ...prev[artworkKey],
          [userId]: currentlyLiked
        }
      }));

      setLikes(prev => ({
        ...prev,
        [artworkKey]: (prev[artworkKey] || 0) + (currentlyLiked ? 1 : -1)
      }));

      setError(err.message);
      throw err;
    }
  };

  const hasUserLiked = (creator, createdAt, userId) => {
    const artworkKey = `${creator}_${createdAt}`;
    return userLikes[artworkKey]?.[userId] || false;
  };

  const getLikeCount = (creator, createdAt) => {
    const artworkKey = `${creator}_${createdAt}`;
    return likes[artworkKey] || 0;
  };

  const setArtworkLikes = (creator, createdAt, likeCount, userLikeStatus = {}) => {
    const artworkKey = `${creator}_${createdAt}`;
    setLikes(prev => ({
      ...prev,
      [artworkKey]: likeCount
    }));
    setUserLikes(prev => ({
      ...prev,
      [artworkKey]: userLikeStatus
    }));
  };

  const value = {
    likes,
    userLikes,
    loading,
    error,
    toggleLike,
    hasUserLiked,
    getLikeCount,
    setArtworkLikes
  };

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  );
};
