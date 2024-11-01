import {
  getProductSelectionByShopId,
  setProductSelectionByShopId,
} from "../services/products.js";

export const getProductSelection = async (req, res) => {
  const id = Number(req.query.id);
  if (!req.query.id || isNaN(id)) {
    return res.status(400).send({ message: "Invalid ID: ID must be a number" });
  }

  const result = await getProductSelectionByShopId(id);

  if (!result) {
    res.status(404).send({ message: "Not found" });
  } else {
    res.send(result);
  }
};

export const setProductSelection = async (req, res) => {
  const { id, selection } = req.body;
  if (!id || isNaN(id)) {
    return res.status(400).send({ message: "Invalid or missing ID" });
  }
  if (!Array.isArray(selection)) {
    return res
      .status(400)
      .send({ message: "Invalid or missing selections array" });
  }

  for (const select of selection) {
    if (!select.productId || isNaN(select.productId)) {
      return res
        .status(400)
        .send({ message: "Invalid or missing productId in selection" });
    }
    if (!select.variantId || isNaN(select.variantId)) {
      return res
        .status(400)
        .send({ message: "Invalid or missing variantId in selection" });
    }
    if (typeof select.autoClassify !== "boolean") {
      return res
        .status(400)
        .send({ message: "Invalid or missing autoClassify in selection" });
    }
  }

  try {
    const result = await setProductSelectionByShopId(id, selection);

    if (!result) {
      res.status(404).send({ message: "Selection not found" });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.error("Error setting selection:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
