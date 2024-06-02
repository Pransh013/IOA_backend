import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { cognito, dynamodb } from "../db";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "my-jwt-secret";
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

    const data = await cognito.signUp(signUpParams).promise();
    await cognito
      .resendConfirmationCode({
        ClientId: clientId,
        Username: email,
      })
      .promise();

    console.log("Confirmation code resent successfully");
    const userId = data.UserSub;

    const params = {
      TableName: "ioa_users",
      Item: {
        userId,
        email,
        fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(email)",
    };

    await dynamodb.put(params).promise();
    res.status(201).json({ message: "User signed up successfully"});

  } catch (error: any) {
    console.error("Error signing up user: ", error);
    if (error.code === "UsernameExistsException") {
      res.status(400).json({ error: "Email already exists in Cognito" });
    } else if (error.code === "ConditionalCheckFailedException") {
      res.status(400).json({ error: "Email already exists in DynamoDB" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default userSignupController;
