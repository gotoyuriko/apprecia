import type { User, UserCredential } from 'firebase/auth';
import type { Dispatch, SetStateAction } from 'react';

// ---- Shared select option (used by react-select, skills, tags) ----
export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

// ---- Comment ----
export interface Comment {
  comment_text: string;
  comment_creator: string; // user email
  comment_createdAt: string; // ISO string
}

// ---- Artwork / Art Project ----
export interface ArtProject {
  id?: string; // Firestore doc ID
  project_title: string;
  project_description: string;
  project_creator: string; // user email
  project_createdAt: string; // ISO string
  project_imageUrls: string[];
  project_tags: SelectOption[];
  project_skills: SelectOption[];
  project_link?: string;
  project_category?: string;
  project_likesCount: number;
  project_likedBy: string[]; // array of user UIDs
  project_viewsCount: number;
  project_viewedBy: string[]; // array of user UIDs
  project_comments?: Comment[];
}

// ---- User / Profile ----
export interface AppUser {
  user_email: string;
  user_name: string;
  user_bio?: string;
  user_photoURL?: string;
}

// ---- Virtual Tour / Gallery ----
export interface RoomArtwork {
  artworkId: number;
  rotation: string; // A-Frame rotation string e.g. "0 135 0"
  position: string; // A-Frame position string e.g. "-1.35 1.8 1.35"
  src: string;
}

export interface TourRoom {
  room_id: string | number;
  room_background: string;
  room_artwork: RoomArtwork[];
  room_title?: string;
  room_audio?: string;
}

export interface ArtGallery {
  id?: string;
  tour_name: string;
  tour_user: string; // creator email
  tour_createdAt: string; // ISO string
  tour_room: TourRoom[];
  tour_audio?: string;
}

// ---- Auth Context ----
export interface AuthResult {
  result: User | UserCredential | null;
  error: string | null;
}

export interface AuthContextValue {
  currentUser: User | null;
  signin: (email: string, password: string) => Promise<AuthResult>;
  signup: (fullname: string, email: string, password: string) => Promise<AuthResult>;
  signout: () => Promise<void>;
  googleAuthentication: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<{ error: unknown | null }>;
}

// ---- Artwork Context ----
export interface ArtworkContextValue {
  artworksData: ArtProject[];
  usersData: AppUser[];
  filteredData: ArtProject[];
  loading: boolean;
  error: string | null;
  searchArtworks: (keyword: string) => void;
  filterByCategory: (category: string) => void;
  filterByCreator: (creatorEmail: string) => void;
  getArtworkById: (id: string) => ArtProject | undefined;
  getUserByEmail: (email: string) => AppUser | undefined;
  refreshData: () => Promise<void>;
  clearFilters: () => void;
  getStats: () => {
    totalArtworks: number;
    totalUsers: number;
    totalCategories: number;
    totalSkills: number;
  };
  setFilteredData: Dispatch<SetStateAction<ArtProject[]>>;
}

// ---- Like Context ----
export interface LikeContextValue {
  likes: Record<string, number>;
  userLikes: Record<string, Record<string, boolean>>;
  loading: Record<string, boolean>;
  handleLike: (artworkId: string, userId: string) => Promise<void>;
  initializeLikes: (artworkId: string) => Promise<void>;
}

// ---- Comment Context ----
export interface CommentContextValue {
  comments: Record<string, Comment[]>;
  loading: Record<string, boolean>;
  addComment: (artworkId: string, commentData: Comment) => Promise<void>;
  deleteComment: (artworkId: string, commentIndex: number) => Promise<void>;
  updateComment: (artworkId: string, commentIndex: number, newText: string) => Promise<void>;
  initializeComments: (artworkId: string) => Promise<void>;
}

// ---- Tour Context ----
export interface TourContextValue {
  toursData: ArtGallery[];
  loading: boolean;
  error: string | null;
  refreshTours: () => Promise<void>;
}

// ---- User Context ----
export interface UserContextValue {
  userData: AppUser | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

// ---- useFetchData hook ----
export interface FetchDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// ---- Data file types ----
export interface MenuItem {
  name: string;
  link: string;
}

export interface RoomImage {
  src: string;
  alt: string;
  id: number;
}

export interface AudioItem {
  src: string;
  id: number;
  title: string;
  alt?: string;
}

export interface PanoramaArtwork extends RoomArtwork {}
