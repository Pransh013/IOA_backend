import express from "express";
import userSignupController from "../controllers/userSignupController";
import userSigninController from "../controllers/userSigninController";

const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);

export { router as userRouter };