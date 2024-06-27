import { Request, Response } from "express";
import { cognito, dynamodb } from "../db";

const clientId = process.env.COGNITO_CLIENT_ID || "my-app-client-id";
const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

const userSigninController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  let accessToken;

  try {
    const data = await cognito.initiateAuth(params).promise();
    if (data.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      const newPassword = `${password}`;
      const session = data?.Session;

      const respondParams = {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: clientId,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
        },
        Session: session,
      };
      const newData = await cognito
        .respondToAuthChallenge(respondParams)
        .promise();
      accessToken = newData?.AuthenticationResult?.AccessToken;
    } else {
      accessToken = data?.AuthenticationResult?.AccessToken;
    }

    const getUserParams = {
      AccessToken: accessToken || "",
    };

    const userData = await cognito.getUser(getUserParams).promise();

    const userId = userData?.UserAttributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;

    const fullName =
      userData.UserAttributes?.find((attr) => attr.Name === "name")?.Value ||
      "";

      const dynamoDBParams = {
        TableName: dynamoDBTable,
        Key: { userId },
      };

      const dbData = await dynamodb.get(dynamoDBParams).promise();
      if (!dbData.Item) {
        return res
          .status(404)
          .json({ error: "Data not found for this user" });
      }
      const { bloodGroup } = dbData.Item;

    return res.status(200).json({
      message: "Login successful",
      token: data.AuthenticationResult?.IdToken,
      fullName,
      userId,
      bloodGroup,
    });
  } catch (error: any) {
    console.error("Error logging in user:", error);
    if (error.code === "UserNotConfirmedException") {
      return res.status(401).json({
        error:
          "User is not confirmed. Please check your email for the confirmation code.",
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  }
};

export default userSigninController;
