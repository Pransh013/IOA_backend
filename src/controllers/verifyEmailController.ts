import { Request, Response } from "express";
import { cognito, dynamodb } from "../db";

const clientId = process.env.COGNITO_CLIENT_ID || "my-app-client-id";
const userPoolId = process.env.COGNITO_USER_POOL_ID || "my-user-pool-id";
const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

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

    const adminGetUserParams = {
      UserPoolId: userPoolId,
      Username: email,
    };

    const userResult = await cognito.adminGetUser(adminGetUserParams).promise();
    const userId = userResult?.UserAttributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;
    const fullName = userResult.UserAttributes?.find(
      (attr) => attr.Name === "name"
    )?.Value;

    const params = {
      TableName: dynamoDBTable,
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
    return res
      .status(201)
      .json({ message: "Email verified and User signed up successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ error: "Failed to verify email" });
  }
};

export default verifyEmailController;
