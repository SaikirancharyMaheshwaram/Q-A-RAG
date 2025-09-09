import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { db, getVectorStore } from "../lib/db";

const router = Router();

router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.user;

    const allDocs = await db.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ allDocs });
  } catch (e) {
    console.log("[LIST_OF_DOCS_ROUTE]", e);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const removedoc = await db.document.deleteMany({
      where: {
        id,
        userId,
      },
    });
    const vectorStore = await getVectorStore();
    await vectorStore.delete({
      filter: {
        documentId: id,
      },
    });

    res.json({ message: "Success" });
  } catch (e) {
    console.log("[DOC_DELETE_ROUTE]", e);
    res.json({ message: "Something went wrong" }).status(500);
  }
});
export default router;
