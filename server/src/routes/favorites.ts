import { Router } from "express";
import {
  addFavorite,
  getMovieById,
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

  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({
      success: false,
      message: "movieId é obrigatório.",
    });
  }

  const movie = await getMovieById(Number(movieId));

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Filme não encontrado.",
    });
  }

  const alreadyFavorited = await isFavorited(req.userId, Number(movieId));

  if (alreadyFavorited) {
    return res.status(409).json({
      success: false,
      message: "Este filme já está nos favoritos.",
    });
  }

  const favorite = await addFavorite(req.userId, Number(movieId));

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

    const movieId = Number(req.params.movieId);

    if (Number.isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: "movieId inválido.",
      });
    }

    const movie = await getMovieById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Filme não encontrado.",
      });
    }

    const alreadyFavorited = await isFavorited(req.userId, movieId);

    if (!alreadyFavorited) {
      return res.status(404).json({
        success: false,
        message: "Este filme não está nos favoritos.",
      });
    }

    await removeFavorite(req.userId, movieId);

    return res.status(204).send();
  },
);
export default router;
