import { Router } from "express";
import { hash } from "bcryptjs";

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

export default router;