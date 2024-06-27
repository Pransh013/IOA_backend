import { Request, Response, Router } from "express";
import { dynamodb } from "../db";

const dynamoDBTable = process.env.DYNAMODB_TABLE_NAME || "my-db-table";

const updateChecklistController = async (req: Request, res: Response) => {
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
    };

    await dynamodb.update(params).promise();

    return res.status(200).json({ message: "Checklist updated successfully." });
  } catch (error: any) {
    console.error("Error updating checklist: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default updateChecklistController;
