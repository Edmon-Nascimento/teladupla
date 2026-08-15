// Tipos do usuário
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreateInput = {
  email: string;
  password: string;
  name: string;
};

export type UserSession = {
  id: string;
  email: string;
  name: string;
};

// Tipos de filme
export type Movie = {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  rating?: number;
  genres: string[];
};

export type MovieCreateInput = Omit<Movie, "id">;

// Tipos de review
export type Review = {
  id: string;
  content: string;
  rating: number; // 1-10
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  movieId: number;
  user?: User;
  movie?: Movie;
};

export type ReviewCreateInput = {
  content: string;
  rating: number;
  movieId: number;
};

export type ReviewUpdateInput = Partial<ReviewCreateInput>;

// Tipos de favorito
export type Favorite = {
  id: string;
  userId: string;
  movieId: number;
  createdAt: Date;
  user?: User;
  movie?: Movie;
};

// Tipos de histórico de visualização
export type WatchHistory = {
  id: string;
  userId: string;
  movieId: number;
  viewedAt: Date;
  user?: User;
  movie?: Movie;
};

// Tipos de resposta de API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;
