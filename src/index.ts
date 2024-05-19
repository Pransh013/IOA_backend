import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { dynamodb } from "./db";
import router from "./routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

const PORT = process.env.PORT || 8001;

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello world!" });
});

interface MyDataItem {
  id: string;
  name: string;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
