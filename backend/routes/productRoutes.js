import express from "express";
import {
  getProductSelection,
  setProductSelection,
} from "../controllers/productsController.js";

const router = express.Router();

router.route("/").put(setProductSelection);
router.route("/").get(getProductSelection);

export default router;
