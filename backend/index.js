import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/products", productRoutes);
app.use("/settings", settingsRoutes);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
