import React, { createContext, useContext, useState, ReactNode } from 'react';
import AddComment from '../comments/AddComment';
import UpdateComment from '../comments/UpdateComment';
import DeleteComment from '../comments/DeleteComment';
import GetComments from '../comments/GetComments';
import type { Comment } from '@/types';

interface CommentContextValue {
    comments: Record<string, any[]>;
    loading: Record<string, boolean>;
    error: string | null;
    addComment: (artworkId: string, commentData: any) => Promise<any>;
    updateComment: (artworkId: string, commentId: any, updates: any) => Promise<any>;
    deleteComment: (artworkId: string, commentId: any) => Promise<void>;
    getComments: (artworkId: string) => Promise<any[]>;
    getCommentCount: (artworkId: string) => number;
}

const CommentContext = createContext<CommentContextValue>(null!);

export const useComment = (): CommentContextValue => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error('useComment must be used within a CommentProvider');
    }
    return context;
};

export const CommentProvider = ({ children }: { children: ReactNode }) => {
    const [comments, setComments] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const addComment = async (artworkId: string, commentData: any): Promise<any> => {
        try {
            const newComment = await (AddComment as any)(artworkId, commentData);
            setComments(prev => ({
                ...prev,
                [artworkId]: [...(prev[artworkId] || []), newComment]
            }));
            return newComment;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const updateComment = async (artworkId: string, commentId: any, updates: any): Promise<any> => {
        try {
            const updatedComment = await (UpdateComment as any)(commentId, updates);
            setComments(prev => ({
                ...prev,
                [artworkId]: prev[artworkId]?.map((comment: any) =>
                    comment.id === commentId ? updatedComment : comment
                ) || []
            }));
            return updatedComment;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const deleteComment = async (artworkId: string, commentId: any): Promise<void> => {
        try {
            await (DeleteComment as any)(commentId);
            setComments(prev => ({
                ...prev,
                [artworkId]: prev[artworkId]?.filter((comment: any) => comment.id !== commentId) || []
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        }
    };

    const getComments = async (artworkId: string): Promise<any[]> => {
        if (comments[artworkId]) {
            return comments[artworkId];
        }
        setLoading(prev => ({ ...prev, [artworkId]: true }));
        try {
            const artworkComments = await (GetComments as any)(artworkId);
            setComments(prev => ({ ...prev, [artworkId]: artworkComments }));
            return artworkComments;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, [artworkId]: false }));
        }
    };

    const getCommentCount = (artworkId: string): number => {
        return comments[artworkId]?.length || 0;
    };

    const value: CommentContextValue = {
        comments,
        loading,
        error,
        addComment,
        updateComment,
        deleteComment,
        getComments,
        getCommentCount
    };

    return (
        <CommentContext.Provider value={value}>
            {children}
        </CommentContext.Provider>
    );
};
