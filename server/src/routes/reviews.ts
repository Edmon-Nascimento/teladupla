import { Prisma } from "@prisma/client";
import { Router, type Response } from "express";

import {
  createReview,
  deleteReview,
  getMovieById,
  getReviewsByMovieId,
  updateReview,
} from "../db";
import {
  authMiddleware,
  type AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

// Listar reviews de um filme/série
router.get("/movie/:movieId", async (req, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        success: false,
        error: "ID do filme inválido",
      });
    }

    const reviews = await getReviewsByMovieId(movieId);

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);

    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// Criar review
router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Não autenticado",
        });
      }

      const { movieId, content, rating } = req.body;

      if (
        !Number.isInteger(movieId) ||
        movieId <= 0 ||
        typeof content !== "string" ||
        !content.trim() ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,
          error: "Dados da review inválidos",
        });
      }

      const movie = await getMovieById(movieId);

      if (!movie) {
        return res.status(404).json({
          success: false,
          error: "Filme não encontrado",
        });
      }

      const review = await createReview(userId, {
        movieId,
        content: content.trim(),
        rating,
      });

      return res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          success: false,
          error: "Você já possui uma review para este filme",
        });
      }

      console.error("Erro ao criar review:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  },
);

// Atualizar review
router.put(
  "/:reviewId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Não autenticado",
        });
      }

      const reviewId = req.params.reviewId;

      if (typeof reviewId !== "string" || !reviewId) {
        return res.status(400).json({
          success: false,
          error: "ID da review inválido",
        });
      }

      const { content, rating } = req.body;

      if (
        typeof content !== "string" ||
        !content.trim() ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          success: false,
          error: "Dados da review inválidos",
        });
      }

      const review = await updateReview(userId, reviewId, {
        content: content.trim(),
        rating,
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          error: "Review não encontrada",
        });
      }

      return res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      console.error("Erro ao atualizar review:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  },
);

// Excluir review
router.delete(
  "/:reviewId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Não autenticado",
        });
      }

      const reviewId = req.params.reviewId;

      if (typeof reviewId !== "string" || !reviewId) {
        return res.status(400).json({
          success: false,
          error: "ID da review inválido",
        });
      }

      const review = await deleteReview(userId, reviewId);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: "Review não encontrada",
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir review:", error);

      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  },
);

export default router;