import express from "express";
import { getSettings, setSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.route("/").post(setSettings);
router.route("/").get(getSettings);

export default router;