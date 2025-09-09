import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: "id_token missing" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.json({ error: "Invalid Id Token or payload" });
    }

    const { email, name, sub, picture } = payload;
    const user = {
      id: sub,
      name,
      email,
      picture,
    };
    if (!email) {
      return res.json({ error: "Something went wrong" });
    }

    const newUser = await db.user.upsert({
      where: {
        email,
      },
      update: { name, picture },
      create: { email, name, picture },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or 'strict'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ success: true, token });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid Google token" });
  }
});
router.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user, message: "success" });
});
export default router;
