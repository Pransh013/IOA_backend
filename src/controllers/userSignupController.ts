import { Request, Response } from "express";
import { cognito, dynamodb } from "../db";

const userPoolId = process.env.COGNITO_USER_POOL_ID || "my-user-pool-id";
const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

const userSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(400)
      .json({ error: "Email, password, and full name are required" });
  }

  try {
    const adminCreateUserParams = {
      UserPoolId: userPoolId,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: fullName },
        { Name: "email_verified", Value: "true" },
      ],
      MessageAction: "SUPPRESS",
    };

    const userResult = await cognito
      .adminCreateUser(adminCreateUserParams)
      .promise();

    const userId = userResult.User?.Attributes?.find(
      (attr) => attr.Name === "sub"
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
      .json({ message: "User signed up successfully." });
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
