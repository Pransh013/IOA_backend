import express from "express";
import { userRouter } from "./userRoutes";
import { userDetailsRouter } from "./userDetailsRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", userDetailsRouter);

export default router;

// app.get("/api/data", (req: Request, res: Response) => {
//   const params: AWS.DynamoDB.DocumentClient.ScanInput = {
//     TableName: "IOA_table",
//   };
//   console.log("params: ", params);

//   dynamodb.scan(params, (err, data) => {
//     if (err) {
//       console.error("Error fetching data from DynamoDB", err);
//       res.status(500).json({ error: "Error fetching data" });
//     } else {
//       res.json(data.Items);
//     }
//   });
// });

// async function putItem(data: any, tableName: string) {
//   const params = {
//     TableName: tableName,
//     Item: data,
//   };

//   try {
//     await dynamodb.put(params).promise();
//     console.log(`Successfully added item to table: ${tableName}`);
//   } catch (error) {
//     console.error("Error putting item in DynamoDB:", error);
//     throw error;
//   }
// }
// app.post("/api/data", async (req, res) => {
//   const data: any = req.body;
//   console.log("body", req.body);

//   const tableName = "IOA_table";

//   try {
//     await putItem(data, tableName);
//     res.status(201).send("Data added successfully");
//   } catch (error) {
//     res.status(500).send("Error adding data to DynamoDB");
//   }
// });