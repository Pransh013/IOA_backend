import { Request, Response } from "express";
import { dynamodb } from "../db";

const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

export const updateChecklistController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { checklist } = req.body;

  if (!Array.isArray(checklist) || checklist.length !== 9) {
    return res
      .status(400)
      .json({ error: "Checklist must be an array of 9 items" });
  }

  try {
    const params = {
      TableName: dynamoDBTable,
      Key: { userId },
      UpdateExpression: "set checklist = :checklist, updated_at = :updated_at",
      ExpressionAttributeValues: {
        ":checklist": checklist,
        ":updated_at": new Date().toISOString(),
      },
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "UPDATED_NEW",
    };
    const result = await dynamodb.update(params).promise();
    return res
      .status(200)
      .json({
        message: "Checklist updated successfully.",
        updatedAttributes: result.Attributes,
      });
  } catch (error: any) {
    console.error("Error updating checklist: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCalendarEventsController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { calenderEvents } = req.body;

  if (!calenderEvents || !Array.isArray(calenderEvents)) {
    return res.status(400).json({ error: "calendarEvents must be an array" });
  }

  try {
    const params = {
      TableName: dynamoDBTable,
      Key: { userId },
      UpdateExpression:
        "set calenderEvents = :calendarEvents, updated_at = :updatedAt",
      ExpressionAttributeValues: {
        ":calendarEvents": calenderEvents,
        ":updatedAt": new Date().toISOString(),
      },
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamodb.update(params).promise();

    return res
      .status(200)
      .json({
        message: "Events updated successfully",
        updatedAttributes: result.Attributes,
      });
  } catch (error: any) {
    console.error("Error updating calendar:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};