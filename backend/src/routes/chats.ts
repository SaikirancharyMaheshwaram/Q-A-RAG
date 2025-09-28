import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { db  } from "../lib/db";

const router = Router();

router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const userId = req.user.userId;

  try {
    const allChats = await db.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ allChats });
  } catch (e) {
    console.log("[ALLCHAT_ROUTE]", e);
    res.json({ error: "Something went wrong" });
  }
});
router.get("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const allChats = await db.chat.findMany({
      where: {
        userId,
        docId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(allChats);
  } catch (e) {
    console.log("[ALLCHAT_ROUTE]", e);
    res.json({ error: "Something went wrong" });
  }
});
export default router;
