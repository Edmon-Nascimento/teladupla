import { Router } from "express";
import {
  addFavorite,
  getMovieById,
  getMovieByTmdbId,
  getUserFavorites,
  isFavorited,
  removeFavorite,
} from "../db";
import { authMiddleware } from "../middleware/auth";
import type { AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Não autenticado.",
    });
  }

  const favorites = await getUserFavorites(req.userId);

  return res.status(200).json({
    success: true,
    data: favorites,
  });
});

router.post("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Não autenticado.",
    });
  }

  const { tmdbId } = req.body;

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    return res.status(400).json({
      success: false,
      message: "tmdbId é obrigatório.",
    });
  }

  const movie = await getMovieByTmdbId(tmdbId);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Filme não encontrado.",
    });
  }

  const alreadyFavorited = await isFavorited(req.userId, movie.id);

  if (alreadyFavorited) {
    return res.status(409).json({
      success: false,
      message: "Este filme já está nos favoritos.",
    });
  }

  const favorite = await addFavorite(req.userId, movie.id);

  return res.status(201).json({
    success: true,
    data: favorite,
  });
});

router.delete(
  "/:movieId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Não autenticado.",
      });
    }

    const tmdbId = Number(req.params.movieId);

    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({
        success: false,
        message: "tmdbId inválido.",
      });
    }

    const movie = await getMovieByTmdbId(tmdbId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Filme não encontrado.",
      });
    }

    const alreadyFavorited = await isFavorited(req.userId, movie.id);

    if (!alreadyFavorited) {
      return res.status(404).json({
        success: false,
        message: "Este filme não está nos favoritos.",
      });
    }

    await removeFavorite(req.userId, movie.id);

    return res.status(204).send();
  },
);
export default router;
