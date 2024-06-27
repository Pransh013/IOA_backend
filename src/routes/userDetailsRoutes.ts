import { Router } from "express";
import getChecklistController from "../controllers/getChecklistController";
import updateChecklistController from "../controllers/updateChecklistController";

const router = Router();

router.get("/:userId/checklist", getChecklistController);
router.post("/:userId/checklist", updateChecklistController);

export { router as userDetailsRouter };
