import { Router } from "express";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUser, getUserByEmail } from "../db";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nome, e-mail e senha são obrigatórios.",
    });
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Este e-mail já está cadastrado.",
    });
  }

  const passwordHash = await hash(password, 12);

  const user = await createUser({
    name,
    email,
    password: passwordHash,
  });

  return res.status(201).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "E-mail e senha são obrigatórios.",
    });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "E-mail ou senha inválidos.",
    });
  }

  const passwordMatches = await compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "E-mail ou senha inválidos.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

export default router;
