import express, { Request, Response } from "express";
import AWS from "aws-sdk";
import "dotenv/config"

const app = express();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const PORT = process.env.PORT || 8001;
const dynamodb = new AWS.DynamoDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.get("/api/data", (req: Request, res: Response) => {
  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: "IOA_table",
  };
  console.log("params: ", params);
  
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error("Error fetching data from DynamoDB", err);
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(data.Items);
    }
  });
});

app.post("/api/data", (req: Request, res: Response) => {
  // Implement your post route logic here
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
