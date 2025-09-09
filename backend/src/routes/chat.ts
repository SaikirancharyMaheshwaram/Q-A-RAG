import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";

const router = Router();

router.get("/", authenticate, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user, msg: "hello from protected route" });
});

export default router;
