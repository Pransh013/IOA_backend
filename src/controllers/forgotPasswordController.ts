import { Request, Response } from "express";
import { cognito } from "../db";

const clientId = process.env.COGNITO_CLIENT_ID || "my-app-client-id";

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const forgotPasswordParams = {
      ClientId: clientId,
      Username: email,
    };

    await cognito.forgotPassword(forgotPasswordParams).promise();

    return res.status(200).json({ message: "Password reset code sent to email" });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    return res.status(500).json({ error: "Failed to initiate password reset" });
  }
};

export const confirmForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  const { email, confirmationCode, newPassword } = req.body;

  if (!email || !confirmationCode || !newPassword) {
    return res.status(400).json({
      error: "Email, confirmation code, and new password are required",
    });
  }

  try {
    const confirmForgotPasswordParams = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    };

    await cognito.confirmForgotPassword(confirmForgotPasswordParams).promise();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};
