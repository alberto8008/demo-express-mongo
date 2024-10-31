import express from "express";
import { productSelection } from "../controllers/productsController.js";

const router = express.Router();

router.route("/select").put(productSelection);

export default router;
