import { Request, Response } from "express";
import { cognito } from "../db";

const clientId = process.env.COGNITO_CLIENT_ID || "my-app-client-id";

const verifyEmailController = async (req: Request, res: Response) => {
  const { email, confirmationCode } = req.body;

  if (!email || !confirmationCode) {
    return res
      .status(400)
      .json({ error: "Email and confirmation code are required" });
  }

  try {
    const confirmSignUpParams = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
    };
    await cognito.confirmSignUp(confirmSignUpParams).promise();

    return res.status(201).json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Error verifying email:", error);
    if (error.code === "UserNotFoundException") {
      return res.status(404).json({ error: "User not found in Cognito" });
    } else if (error.code === "NotAuthorizedException") {
      return res.status(400).json({ error: "Invalid confirmation code" });
    } else {
      return res.status(500).json({ error: "Failed to verify email" });
    }
  }
};

export default verifyEmailController;
