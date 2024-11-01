import Settings from "../models/settingsModel.js";

export const getSettingsById = async (id) => {
  const setting = await Settings.findOne({ shopId: id });
  return setting;
};

export const setSettingsById = async (id, settings) => {
  try {
    const updatedSetting = await Settings.findOneAndUpdate(
      { shopId: id },
      {
        autoClassifyAll: settings.autoClassifyAll,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return updatedSetting;
  } catch (e) {
    console.error(e);
    throw new Error("Error updating or creating settings");
  }
};
