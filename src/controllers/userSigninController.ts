import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { dynamodb } from "../db";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "myjwtsecret";

const userSigninController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const params = {
      TableName: "ioa_users",
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const result = await dynamodb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ userId: user.userId }, jwtSecretKey);

      return res
        .status(200)
        .json({ message: "Login successful", token, fullName: user.fullName });
    } else {
      return res.status(401).json({ error: "Invalid email" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default userSigninController;
