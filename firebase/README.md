# Firebase Architecture Documentation

## Overview

This directory contains the refactored Firebase integration for the Apprecia project, featuring a context-based architecture that provides centralized state management, improved performance, and better developer experience.

## Architecture

### Context Providers

The application uses a hierarchical context structure that provides data and functionality throughout the component tree:

```
AuthProvider
└── UserProvider
    └── ArtworkProvider
        └── TourProvider
            └── CommentProvider
                └── LikeProvider
```

### Contexts

#### AuthContext
- **Location**: `contexts/AuthContext.js`
- **Purpose**: Manages user authentication state
- **Key Functions**: `signIn`, `signOut`, `signUp`, `currentUser`

#### UserContext
- **Location**: `contexts/UserContext.js`
- **Purpose**: Manages user data and operations
- **Key Functions**: 
  - `fetchUsers()` - Get all users
  - `fetchUserByEmail(email)` - Get user by email
  - `createUser(userData)` - Create new user
  - `updateUser(userId, updates)` - Update user data
  - `searchUsers(query)` - Search users
  - `getUserById(userId)` - Get user by ID

#### ArtworkContext
- **Location**: `contexts/ArtworkContext.js`
- **Purpose**: Manages artwork data and operations
- **Key Functions**: 
  - `fetchArtworks()` - Get all artworks
  - `createArtwork(artworkData)` - Create new artwork
  - `updateArtwork(artworkId, updates)` - Update artwork
  - `deleteArtwork(artworkId)` - Delete artwork

#### TourContext
- **Location**: `contexts/TourContext.js`
- **Purpose**: Manages virtual tour data and operations
- **Key Functions**:
  - `fetchTours()` - Get all tours
  - `createTour(tourData)` - Create new tour
  - `updateTour(tourId, updates)` - Update tour
  - `deleteTour(tourId)` - Delete tour
  - `getToursByUser(userId)` - Get tours by user

#### CommentContext
- **Location**: `contexts/CommentContext.js`
- **Purpose**: Manages comment operations and state
- **Key Functions**:
  - `addComment(artworkId, commentData)` - Add comment
  - `updateComment(artworkId, commentId, updates)` - Update comment
  - `deleteComment(artworkId, commentId)` - Delete comment
  - `getComments(artworkId)` - Get comments for artwork
  - `getCommentCount(artworkId)` - Get comment count

#### LikeContext
- **Location**: `contexts/LikeContext.js`
- **Purpose**: Manages like operations with optimistic updates
- **Key Functions**:
  - `toggleLike(creator, createdAt, userId)` - Toggle like status
  - `hasUserLiked(creator, createdAt, userId)` - Check if user liked
  - `getLikeCount(creator, createdAt)` - Get like count
  - `setArtworkLikes(creator, createdAt, count, userStatus)` - Set like data

### Custom Hooks

#### useArtworkWithUser
- **Location**: `hooks/useArtworkWithUser.js`
- **Purpose**: Combines artwork and user data
- **Returns**: 
  - `artworksWithCreators` - Artworks with creator information
  - `getArtworksByCreator(email)` - Filter by creator
  - `getArtworksByCategory(category)` - Filter by category
  - `getArtworkWithCreator(creator, createdAt)` - Get specific artwork

#### useArtworkInteractions
- **Location**: `hooks/useArtworkInteractions.js`
- **Purpose**: Manages artwork interactions (likes, comments, views)
- **Parameters**: `artwork` object
- **Returns**:
  - `isLiked` - Current like status
  - `likeCount` - Number of likes
  - `commentCount` - Number of comments
  - `handleLikeToggle()` - Toggle like
  - `handleAddComment(text)` - Add comment
  - `handleViewUpdate()` - Update view count
  - `loadComments()` - Load comments
  - `canInteract` - Whether user can interact

#### useVirtualTour
- **Location**: `hooks/useVirtualTour.js`
- **Purpose**: Manages virtual tour operations
- **Parameters**: `tourId`
- **Returns**:
  - `tour` - Tour data
  - `rooms` - Tour rooms
  - `currentRoom` - Current room
  - `currentRoomIndex` - Current room index
  - `canEditTour` - Edit permissions
  - `addRoom(roomData)` - Add room
  - `deleteRoom(roomId)` - Delete room
  - `updateRoom(roomId, data)` - Update room
  - `switchRoom(index)` - Switch to room
  - `nextRoom()` - Go to next room
  - `previousRoom()` - Go to previous room

## Usage Examples

### Using Contexts

```jsx
import { useArtwork, useAuth, useLike } from '@/firebase/contexts';

function MyComponent() {
  const { artworksData, loading } = useArtwork();
  const { currentUser } = useAuth();
  const { toggleLike, hasUserLiked } = useLike();
  
  // Component logic here
}
```

### Using Custom Hooks

```jsx
import { useArtworkInteractions } from '@/firebase/hooks';

function ArtworkCard({ artwork }) {
  const {
    isLiked,
    likeCount,
    handleLikeToggle,
    handleAddComment
  } = useArtworkInteractions(artwork);
  
  return (
    <div>
      <button onClick={handleLikeToggle}>
        {isLiked ? 'Unlike' : 'Like'} ({likeCount})
      </button>
    </div>
  );
}
```

### Virtual Tour Management

```jsx
import { useVirtualTour } from '@/firebase/hooks';

function TourViewer({ tourId }) {
  const {
    tour,
    currentRoom,
    nextRoom,
    previousRoom,
    hasNextRoom,
    hasPreviousRoom
  } = useVirtualTour(tourId);
  
  return (
    <div>
      <h1>{tour?.title}</h1>
      <div>{currentRoom?.name}</div>
      <button onClick={previousRoom} disabled={!hasPreviousRoom}>
        Previous
      </button>
      <button onClick={nextRoom} disabled={!hasNextRoom}>
        Next
      </button>
    </div>
  );
}
```

## Benefits

### Performance
- **Reduced Re-renders**: Contexts are optimized to minimize unnecessary re-renders
- **Optimistic Updates**: Like operations provide immediate feedback
- **Caching**: Data is cached in context state to reduce Firebase calls

### Developer Experience
- **Type Safety**: Clear interfaces and consistent patterns
- **Reusability**: Custom hooks eliminate code duplication
- **Error Handling**: Centralized error management
- **Loading States**: Consistent loading indicators

### Maintainability
- **Separation of Concerns**: Each context has a specific responsibility
- **Testability**: Contexts and hooks can be tested independently
- **Scalability**: Easy to add new features and contexts

## Migration Guide

### From Direct Firebase Calls

**Before:**
```jsx
const [artworks, setArtworks] = useState([]);
useEffect(() => {
  const fetchData = async () => {
    const data = await GetArtworks();
    setArtworks(data);
  };
  fetchData();
}, []);
```

**After:**
```jsx
const { artworksData, loading, error } = useArtwork();
```

### From Local State Management

**Before:**
```jsx
const [isLiked, setIsLiked] = useState(false);
const handleLike = async () => {
  await UpdateLike(creator, createdAt, !isLiked, userId);
  setIsLiked(!isLiked);
};
```

**After:**
```jsx
const { isLiked, handleLikeToggle } = useArtworkInteractions(artwork);
```

## Best Practices

1. **Use Custom Hooks**: Prefer custom hooks over direct context usage for complex operations
2. **Error Handling**: Always handle errors from context operations
3. **Loading States**: Use loading states for better UX
4. **Optimistic Updates**: Implemented for like operations, consider for other interactions
5. **Data Normalization**: Store data in normalized format when possible

## File Structure

```
firebase/
├── contexts/
│   ├── index.js              # Export all contexts
│   ├── AuthContext.js        # Authentication
│   ├── UserContext.js        # User management
│   ├── ArtworkContext.js     # Artwork management
│   ├── TourContext.js        # Virtual tours
│   ├── CommentContext.js     # Comments
│   └── LikeContext.js        # Likes
├── hooks/
│   ├── index.js              # Export all hooks
│   ├── useArtworkWithUser.js # Combined artwork/user data
│   ├── useArtworkInteractions.js # Artwork interactions
│   └── useVirtualTour.js     # Tour management
├── firestore.js              # Firebase operations
└── README.md                 # This file
```

## Testing

### Context Testing
```jsx
import { render } from '@testing-library/react';
import { UserProvider } from '@/firebase/contexts';

const TestComponent = () => {
  const { users } = useUser();
  return <div>{users.length}</div>;
};

test('UserProvider provides users', () => {
  render(
    <UserProvider>
      <TestComponent />
    </UserProvider>
  );
});
```

### Hook Testing
```jsx
import { renderHook } from '@testing-library/react';
import { useArtworkInteractions } from '@/firebase/hooks';

test('useArtworkInteractions handles like toggle', () => {
  const { result } = renderHook(() => 
    useArtworkInteractions(mockArtwork)
  );
  
  expect(result.current.isLiked).toBe(false);
});
```

## Future Enhancements

1. **TypeScript Migration**: Add type definitions for better type safety
2. **Real-time Updates**: Implement Firebase real-time listeners
3. **Offline Support**: Add offline data synchronization
4. **Performance Monitoring**: Add performance metrics
5. **Error Boundaries**: Implement error boundaries for better error handling
6. **Data Validation**: Add schema validation for data operations
