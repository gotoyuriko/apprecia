import React, { createContext, useContext, useState } from 'react';
import AddComment from '../comments/AddComment';
import UpdateComment from '../comments/UpdateComment';
import DeleteComment from '../comments/DeleteComment';
import GetComments from '../comments/GetComments';

const CommentContext = createContext();

export const useComment = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const addComment = async (artworkId, commentData) => {
    try {
      const newComment = await AddComment(artworkId, commentData);
      setComments(prev => ({
        ...prev,
        [artworkId]: [...(prev[artworkId] || []), newComment]
      }));
      return newComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateComment = async (artworkId, commentId, updates) => {
    try {
      const updatedComment = await UpdateComment(commentId, updates);
      setComments(prev => ({
        ...prev,
        [artworkId]: prev[artworkId]?.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ) || []
      }));
      return updatedComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteComment = async (artworkId, commentId) => {
    try {
      await DeleteComment(commentId);
      setComments(prev => ({
        ...prev,
        [artworkId]: prev[artworkId]?.filter(comment => comment.id !== commentId) || []
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getComments = async (artworkId) => {
    if (comments[artworkId]) {
      return comments[artworkId];
    }

    setLoading(prev => ({ ...prev, [artworkId]: true }));
    try {
      const artworkComments = await GetComments(artworkId);
      setComments(prev => ({
        ...prev,
        [artworkId]: artworkComments
      }));
      return artworkComments;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [artworkId]: false }));
    }
  };

  const getCommentCount = (artworkId) => {
    return comments[artworkId]?.length || 0;
  };

  const value = {
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
