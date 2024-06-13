import { calculateShipping, submitRyeCart } from "../services/rye.js";
import { updateProductOnStore } from "../services/vgc.js";

export const handleRyeHooks = async (req, res) => {
  console.log("rye webhook received");

  switch (req.body.type) {
    case "PRODUCT_UPDATED":
      const result = await updateProductOnStore(req.body.data.product);
      if (result) return res.status(200).send("Product updated");
      break;
    default:
      break;
  }
};

export const handleCalculateShipping = async (req, res) => {
  const shippingInfo = {
    firstName: req.body.rate.destination.name.split(" ")[0],
    lastName: req.body.rate.destination.name.split(" ")[1],
    email: req.body.rate.destination.email,
    phone: req.body.rate.destination.phone,
    address1: req.body.rate.destination.address1,
    city: req.body.rate.destination.city,
    provinceCode: req.body.rate.destination.province,
    countryCode: req.body.rate.destination.country,
    postalCode: req.body.rate.destination.postal_code,
  };
  const shippingCost = await calculateShipping(
    shippingInfo,
    req.body.rate.items
  );

  const response = {
    rates: [
      {
        service_name: "Rye Standard Shipping",
        service_code: "standard",
        description: "Standard Shipping",
        total_price: shippingCost,
        currency: req.body.rate.currency,
      },
    ],
  };

  res.send(response);
};

export const handleOrderPaid = async (req, res) => {
  const shippingInfo = {
    firstName: req.body["shipping_address"]["first_name"],
    lastName: req.body["shipping_address"]["last_name"],
    email: req.body.email,
    phone: req.body["shipping_address"]["phone"],
    address1: req.body["shipping_address"]["address1"],
    city: req.body["shipping_address"]["city"],
    provinceCode: req.body["shipping_address"]["province_code"],
    countryCode: req.body["shipping_address"]["country_code"],
    postalCode: req.body["shipping_address"]["zip"],
  };

  const response = await submitRyeCart(shippingInfo, req.body.line_items);
  return res.send(200);
};
