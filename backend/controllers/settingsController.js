import { getSettingsById, setSettingsById } from "../services/settings.js";

export const getSettings = async (req, res) => {
  const result = await getSettingsById(req.query.id);
  console.log("33333333", result);
  if (!result) res.status(404).send({ message: "Not found" });
  res.send(result);
};

export const setSettings = async (req, res) => {
  const result = setSettingsById(req.body["id"], req.body["settings"]);
  console.log("444444444444", await result);
  res.send(result);
};
