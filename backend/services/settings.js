import Settings from "../models/settingsModel.js";

export const getSettingsById = async (id) => {
  const setting = await Settings.findOne({ shopId: id });
  return setting;
};

export const setSettingsById = async (id, settings) => {
  try {
    const setting = new Settings({
      shopId: id,
      autoClassifyAll: settings.autoClassifyAll,
    });
    return await setting.save();
  } catch (e) {
    console.log(e);
  }
};
