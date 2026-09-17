import { Router } from "express";
import {
  addFavorite,
  getMovieById,
  isFavorited,
} from "../db";
import { authMiddleware } from "../middleware/auth";
import type { AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
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

    const alreadyFavorited = await isFavorited(
      req.userId,
      Number(movieId),
    );

    if (alreadyFavorited) {
      return res.status(409).json({
        success: false,
        message: "Este filme já está nos favoritos.",
      });
    }

    const favorite = await addFavorite(
      req.userId,
      Number(movieId),
    );

    return res.status(201).json({
      success: true,
      data: favorite,
    });
  },
);

export default router;