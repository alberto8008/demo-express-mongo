import Selection from "../models/productModel.js";

export const getProductSelectionByShopId = async (id) => {
  const selection = await Selection.findOne({ shopId: id });
  return selection;
};

export const setProductSelectionByShopId = async (id, selection) => {
  try {
    const updatedSelection = await Selection.findOneAndUpdate(
      { shopId: id },
      {
        selection: selection,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return updatedSelection;
  } catch (e) {
    console.error(e);
    throw new Error("Error updating or creating selection");
  }
};
