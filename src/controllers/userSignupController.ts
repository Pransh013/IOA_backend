import { Request, Response } from "express";
import { cognito } from "../db";

const clientId = process.env.COGNITO_CLIENT_ID || "my-app-client-id";

const userSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(400)
      .json({ error: "Email, password, and full name are required" });
  }

  try {
    const signUpParams = {
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: fullName },
      ],
    };

    await cognito.signUp(signUpParams).promise();
    return res.status(201).json({ message: "User signed up successfully" });
  } catch (error: any) {
    console.error("Error signing up user: ", error);
    if (error.code === "UsernameExistsException") {
      return res.status(400).json({ error: "Email already exists in Cognito" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default userSignupController;
