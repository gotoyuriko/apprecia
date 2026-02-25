import React, { createContext, useContext, useState, ReactNode } from 'react';
import UpdateLike from '../likes/UpdateLike';

interface LikeContextValue {
    likes: Record<string, number>;
    userLikes: Record<string, Record<string, boolean>>;
    loading: Record<string, boolean>;
    error: string | null;
    toggleLike: (creator: string, createdAt: string, userId: string) => Promise<void>;
    hasUserLiked: (creator: string, createdAt: string, userId: string) => boolean;
    getLikeCount: (creator: string, createdAt: string) => number;
    setArtworkLikes: (creator: string, createdAt: string, likeCount: number, userLikeStatus?: Record<string, boolean>) => void;
}

const LikeContext = createContext<LikeContextValue>(null!);

export const useLike = (): LikeContextValue => {
    const context = useContext(LikeContext);
    if (!context) {
        throw new Error('useLike must be used within a LikeProvider');
    }
    return context;
};

export const LikeProvider = ({ children }: { children: ReactNode }) => {
    const [likes, setLikes] = useState<Record<string, number>>({});
    const [userLikes, setUserLikes] = useState<Record<string, Record<string, boolean>>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const toggleLike = async (creator: string, createdAt: string, userId: string): Promise<void> => {
        const artworkKey = `${creator}_${createdAt}`;
        const currentlyLiked = userLikes[artworkKey]?.[userId] || false;
        const newLikedState = !currentlyLiked;

        setUserLikes(prev => ({
            ...prev,
            [artworkKey]: { ...prev[artworkKey], [userId]: newLikedState }
        }));
        setLikes(prev => ({
            ...prev,
            [artworkKey]: (prev[artworkKey] || 0) + (newLikedState ? 1 : -1)
        }));

        try {
            await UpdateLike(creator, createdAt, newLikedState, userId);
        } catch (err: unknown) {
            setUserLikes(prev => ({
                ...prev,
                [artworkKey]: { ...prev[artworkKey], [userId]: currentlyLiked }
            }));
            setLikes(prev => ({
                ...prev,
                [artworkKey]: (prev[artworkKey] || 0) + (currentlyLiked ? 1 : -1)
            }));
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const hasUserLiked = (creator: string, createdAt: string, userId: string): boolean => {
        const artworkKey = `${creator}_${createdAt}`;
        return userLikes[artworkKey]?.[userId] || false;
    };

    const getLikeCount = (creator: string, createdAt: string): number => {
        const artworkKey = `${creator}_${createdAt}`;
        return likes[artworkKey] || 0;
    };

    const setArtworkLikes = (
        creator: string,
        createdAt: string,
        likeCount: number,
        userLikeStatus: Record<string, boolean> = {}
    ): void => {
        const artworkKey = `${creator}_${createdAt}`;
        setLikes(prev => ({ ...prev, [artworkKey]: likeCount }));
        setUserLikes(prev => ({ ...prev, [artworkKey]: userLikeStatus }));
    };

    const value: LikeContextValue = {
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
