import express from "express";
import userSignupController from "../controllers/userSignupController";
import userSigninController from "../controllers/userSigninController";
import verifyEmailController from "../controllers/verifyEmailController";

const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);
router.post("/verifyEmail", verifyEmailController);

export { router as userRouter };
