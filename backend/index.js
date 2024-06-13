import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import importRoutes from "./routes/importRoutes.js";
import hookRoutes from "./routes/hookRoutes.js";

config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/import", importRoutes);
app.use("/hook", hookRoutes);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
