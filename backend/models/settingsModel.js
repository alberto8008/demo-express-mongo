import mongoose from "mongoose";

const settingsSchema = mongoose.Schema(
  {
    shopId: { type: Number, required: true },
    autoClassifyAll: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
