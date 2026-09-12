import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Não autenticado.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET não configurado.",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload !== "object" || !payload.userId) {
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
    }

    req.userId = String(payload.userId);
    req.userEmail = payload.email ? String(payload.email) : undefined;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado.",
    });
  }
}