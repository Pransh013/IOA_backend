import express from "express";
import userSignupController from "../controllers/userSignupController";
import userSigninController from "../controllers/userSigninController";
import verifyEmailController from "../controllers/verifyEmailController";
import { confirmForgotPasswordController, forgotPasswordController } from "../controllers/forgotPasswordController";

const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);
router.post("/verifyEmail", verifyEmailController);
router.post("/forgotPassword", forgotPasswordController);
router.post("/confirmForgotPassword", confirmForgotPasswordController);

export { router as userRouter };
