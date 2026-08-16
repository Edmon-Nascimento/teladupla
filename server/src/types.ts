
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Movie = {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  rating?: number;
  genres: string[];
};

export type Review = {
  id: string;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movieId: number;
  user?: User;
  movie?: Movie;
};

export type Favorite = {
  id: string;
  userId: string;
  movieId: number;
  createdAt: Date;
  user?: User;
  movie?: Movie;
};

export type WatchHistory = {
  id: string;
  userId: string;
  movieId: number;
  viewedAt: Date;
  user?: User;
  movie?: Movie;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
