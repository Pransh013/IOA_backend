import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { dynamodb } from "../db";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "myjwtsecret";

const userSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(400)
      .json({ error: "Email, password, and full name are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    console.log(userId);
    
    const params = {
      TableName: "ioa_users",
      Item: {
        userId,
        email,
        password: hashedPassword,
        fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(email)",
    };

    await dynamodb.put(params).promise();

    const token = jwt.sign({ userId }, jwtSecretKey);

    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error: any) {
    console.error("Error signing up user:", error);
    if (error.code === "ConditionalCheckFailedException") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default userSignupController;
