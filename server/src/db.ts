import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Movie } from "./types";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// User functions
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  return prisma.user.create({ data });
}

// Movie functions
export async function createOrUpdateMovie(data: Movie) {
  return prisma.movie.upsert({
    where: { id: data.id },
    update: data,
    create: data,
  });
}

export async function getMovieById(id: number) {
  return prisma.movie.findUnique({ where: { id } });
}

// Review functions
export async function createReview(userId: string, data: {
  content: string;
  rating: number;
  movieId: number;
}) {
  return prisma.review.create({
    data: { ...data, userId },
    include: { user: true, movie: true },
  });
}

export async function getReviewsByMovieId(movieId: number) {
  return prisma.review.findMany({
    where: { movieId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

// Favorite functions
export async function addFavorite(userId: string, movieId: number) {
  return prisma.favorite.create({
    data: { userId, movieId },
    include: { movie: true },
  });
}

export async function removeFavorite(userId: string, movieId: number) {
  return prisma.favorite.delete({
    where: {
      userId_movieId: { userId, movieId },
    },
  });
}

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function isFavorited(userId: string, movieId: number) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });
  return !!fav;
}

// Watch History functions
export async function addToWatchHistory(userId: string, movieId: number) {
  return prisma.watchHistory.create({
    data: { userId, movieId },
    include: { movie: true },
  });
}

export async function getUserWatchHistory(userId: string) {
  return prisma.watchHistory.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { viewedAt: "desc" },
  });
}