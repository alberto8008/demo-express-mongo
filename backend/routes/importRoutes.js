import express from "express";
import {
  importAmazonProducts,
  importShopifyProducts,
} from "../controllers/importController.js";

const router = express.Router();

router.route("/shopify").post(importShopifyProducts);
router.route("/amazon").post(importAmazonProducts);

export default router;
