import { Router } from "express";
import { getCalenderEventsController, getChecklistController } from "../controllers/getUserDetailsController";
import { updateCalendarEventsController, updateChecklistController } from "../controllers/updateUserDetailsController";

const router = Router();

router.get("/:userId/checklist", getChecklistController);
router.get("/:userId/events", getCalenderEventsController);
router.post("/:userId/checklist", updateChecklistController);
router.post("/:userId/events", updateCalendarEventsController);

export { router as userDetailsRouter };
