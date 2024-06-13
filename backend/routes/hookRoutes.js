import express from "express";
import {
  handleCalculateShipping,
  handleOrderPaid,
  handleRyeHooks,
} from "../controllers/hookController.js";

const router = express.Router();

router.route("/rye").post(handleRyeHooks);
router.route("/calculate-shipping").post(handleCalculateShipping);
router.route("/vgc-order-paid").post(handleOrderPaid);

export default router;
