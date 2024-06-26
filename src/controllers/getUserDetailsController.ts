import { Request, Response } from "express";
import { dynamodb } from "../db";

const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

export const getChecklistController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const params = {
      TableName: dynamoDBTable,
      Key: { userId },
    };

    const data = await dynamodb.get(params).promise();
    if (!data.Item) {
      return res
        .status(404)
        .json({ error: "Checklist not found for this user" });
    }
    const { checklist } = data.Item;
    return res.status(200).json({ checklist });
  } catch (error: any) {
    console.error("Error fetching checklist: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCalenderEventsController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const params = {
      TableName: dynamoDBTable,
      Key: { userId },
    };

    const data = await dynamodb.get(params).promise();
    if (!data.Item) {
      return res
        .status(404)
        .json({ error: "Events not found for this user" });
    }
    const { calenderEvents } = data.Item;
    return res.status(200).json({ calenderEvents });
  } catch (error: any) {
    console.error("Error fetching events: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
