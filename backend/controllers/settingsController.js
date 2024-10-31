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
  const result = setSettingsById(req.body["id"], req.body["settings"]);
  console.log("444444444444", await result);
  res.send(result);
};
