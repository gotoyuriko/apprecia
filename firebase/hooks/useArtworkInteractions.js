import { useState, useCallback } from 'react';
import { useLike } from '../contexts/LikeContext';
import { useComment } from '../contexts/CommentContext';
import { useAuth } from '../contexts/AuthContext';
import UpdateView from '../projectviews/UpdateView';

export const useArtworkInteractions = (artwork) => {
  const { toggleLike, hasUserLiked, getLikeCount } = useLike();
  const { addComment, getComments, getCommentCount } = useComment();
  const { currentUser } = useAuth();
  const [viewUpdated, setViewUpdated] = useState(false);

  const isLiked = hasUserLiked(artwork.creator, artwork.createdAt, currentUser?.uid);
  const likeCount = getLikeCount(artwork.creator, artwork.createdAt);
  const commentCount = getCommentCount(`${artwork.creator}_${artwork.createdAt}`);

  const handleLikeToggle = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      await toggleLike(artwork.creator, artwork.createdAt, currentUser.uid);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [artwork.creator, artwork.createdAt, currentUser, toggleLike]);

  const handleAddComment = useCallback(async (commentText) => {
    if (!currentUser || !commentText.trim()) return;

    const commentData = {
      text: commentText,
      author: currentUser.uid,
      authorEmail: currentUser.email,
      createdAt: new Date().toISOString()
    };

    try {
      const artworkId = `${artwork.creator}_${artwork.createdAt}`;
      await addComment(artworkId, commentData);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, [artwork.creator, artwork.createdAt, currentUser, addComment]);

  const handleViewUpdate = useCallback(async () => {
    if (viewUpdated || !currentUser) return;

    try {
      await UpdateView(artwork.creator, artwork.createdAt, currentUser);
      setViewUpdated(true);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  }, [artwork.creator, artwork.createdAt, viewUpdated, currentUser]);

  const loadComments = useCallback(async () => {
    const artworkId = `${artwork.creator}_${artwork.createdAt}`;
    try {
      return await getComments(artworkId);
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  }, [artwork.creator, artwork.createdAt, getComments]);

  return {
    isLiked,
    likeCount,
    commentCount,
    handleLikeToggle,
    handleAddComment,
    handleViewUpdate,
    loadComments,
    canInteract: !!currentUser
  };
};
