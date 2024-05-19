import express from "express";
import userSignupController from "../controllers/userSignupController";

const router = express.Router();

router.post("/signup", userSignupController);

export { router as userRouter };