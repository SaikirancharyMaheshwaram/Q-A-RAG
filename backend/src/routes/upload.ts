import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const p = process.env.JWT_SECRET!;

  res.json({ msg: "hello from upload chat route", p });
});

export default router;
