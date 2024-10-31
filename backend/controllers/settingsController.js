import { getSettingsById, setSettingsById } from "../services/settings.js";

export const getSettings = async (req, res) => {
  const id = Number(req.query.id);
  if (!req.query.id || isNaN(id)) {
    return res.status(400).send({ message: "Invalid ID: ID must be a number" });
  }

  const result = await getSettingsById(id);
  console.log("33333333", result);

  if (!result) {
    res.status(404).send({ message: "Not found" });
  } else {
    res.send(result);
  }
};

export const setSettings = async (req, res) => {
  const { id, settings } = req.body;
  if (!id || typeof id !== "string") {
    return res.status(400).send({ message: "Invalid or missing ID" });
  }
  if (!settings || typeof settings !== "object") {
    return res
      .status(400)
      .send({ message: "Invalid or missing settings data" });
  }

  try {
    const result = await setSettingsById(id, settings);

    if (!result) {
      res.status(404).send({ message: "Settings not found" });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.error("Error setting settings:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
