import { GraphQLClient, gql } from "graphql-request";
import {
  ryeFetchAmazonProductsQuery,
  ryeFetchShopifyProductsQuery,
} from "./query.js";
import { config } from "dotenv";
import { createCartMutation, submitCartMutation } from "./mutation.js";
import axios from "axios";
import Product from "../models/productModel.js";

config();

const paymentMethod = {
  payment_method: {
    credit_card: {
      first_name: "John",
      last_name: "Doe",
      number: "4242424242424242",
      verification_value: "553",
      month: "12",
      year: "2024",
    },
  },
};

const RYEClient = new GraphQLClient(process.env.RYE_GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: process.env.RYE_AUTHORIZATION,
    "Rye-Shopper-IP": process.env.RYE_SHOPPER_IP,
  },
});

export const fetchShopifyProductsFromRYE = async (productUrls) => {
  console.log("rye url counts:", productUrls.length);
  let ryeProductIds = [],
    productUrlErrors = [];
  await Promise.all(
    productUrls.map(async (url) => {
      const ryeFetchShopifyProductIdMutation = gql`
                      mutation RequestShopifyProductByURL {
                          requestShopifyProductByURL(
                          input: {
                              url: "${url}"
                          }
                          ) {
                          canonicalDomain
                          productId
                          }
                      }
                  `;

      try {
        const ryeFetchShopifyProductIdMutationResponse =
          await RYEClient.request(ryeFetchShopifyProductIdMutation, {});
        ryeProductIds.push(
          ryeFetchShopifyProductIdMutationResponse.requestShopifyProductByURL
            .productId
        );
      } catch (error) {
        productUrlErrors.push({
          url: url,
          error: error.response.errors[0].message,
        });
      }
      return true;
    })
  );

  const ryeProducts = await Promise.all(
    ryeProductIds.map(async (productId) => {
      const ryeFetchProductsQueryVariable = {
        input: {
          id: productId,
          marketplace: "SHOPIFY",
        },
      };

      return await RYEClient.request(
        ryeFetchShopifyProductsQuery,
        ryeFetchProductsQueryVariable
      );
    })
  );
  return { ryeProducts: ryeProducts, fetchFailedUrls: productUrlErrors };
};

export const fetchAmazonProductsFromRYE = async (productUrls) => {
  console.log("rye url counts:", productUrls.length);
  const ryeProductIds = await Promise.all(
    productUrls.map(async (url) => {
      const ryeFetchAmazonProductIdMutation = gql`
                      mutation RequestAmazonProductByURL {
                        requestAmazonProductByURL(
                          input: {
                              url: "${url}"
                          }
                          ) {
                          productId
                          }
                      }
                  `;
      return await RYEClient.request(ryeFetchAmazonProductIdMutation, {});
    })
  );

  const ryeProducts = await Promise.all(
    ryeProductIds.map(async (product) => {
      const ryeFetchProductsQueryVariable = {
        input: {
          id: product.requestAmazonProductByURL.productId,
          marketplace: "AMAZON",
        },
      };

      return await RYEClient.request(
        ryeFetchAmazonProductsQuery,
        ryeFetchProductsQueryVariable
      );
    })
  );

  return ryeProducts;
};

export const makeOrder = async (orderInfo) => {};

const getRyeVariantsFromVgcVariants = async (vgcVariants) => {
  const cartItems = [];

  await Promise.all(
    vgcVariants.map(async (variant) => {
      const item = await Product.findOne({
        vgcVariantId: variant.variant_id.toString(),
      });
      if (item)
        cartItems.push({
          quantity: variant.quantity,
          variantId: item.ryeVariantId,
        });
      return true;
    })
  );

  return cartItems;
};

const createRyeCart = async (shippingInfo, cartItems) => {
  const createCartVariables = {
    input: {
      items: {
        shopifyCartItemsInput: cartItems.filter(
          (item) => parseInt(item.variantId) !== NaN
        ),
        amazonCartItemsInput: cartItems.filter(
          (item) => parseInt(item.variantId) === NaN
        ),
      },
      buyerIdentity: shippingInfo,
    },
  };

  const createCartMutationResponse = await RYEClient.request(
    createCartMutation,
    createCartVariables
  );

  if (createCartMutationResponse.createCart.errors.length === 0)
    return createCartMutationResponse;
  return null;
};

export const calculateShipping = async (shippingInfo, lineItems) => {
  const cartItems = await getRyeVariantsFromVgcVariants(lineItems);

  const createCartMutationResponse = await createRyeCart(
    shippingInfo,
    cartItems
  );

  let shippingCost = 0;
  if (createCartMutationResponse.createCart.errors.length === 0)
    createCartMutationResponse.createCart.cart.stores.forEach(
      (store) => (shippingCost += store.offer.shippingMethods[0].price.value)
    );

  return shippingCost;
};

export const submitRyeCart = async (shippingInfo, lineItems) => {
  const cartItems = await getRyeVariantsFromVgcVariants(lineItems);
  const createCartMutationResponse = await createRyeCart(
    shippingInfo,
    cartItems
  );
  const cartId = createCartMutationResponse.createCart.cart.id;
  const shippingOptions = createCartMutationResponse.createCart.cart.stores.map(
    (store) => ({
      store: store.store,
      shippingId: store.offer.shippingMethods[0].id,
    })
  );

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.SPREEDLY_URL,
    headers: {
      Authorization: process.env.PAYMENT_GATEWAY_AUTH,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(paymentMethod),
  };

  const spreedlyResponse = await axios.request(config);
  const paymentToken = spreedlyResponse.data.transaction.payment_method.token;

  const submitCartMutationVariables = {
    input: {
      id: cartId,
      token: paymentToken,
      selectedShippingOptions: shippingOptions,
    },
  };

  const submitCartMutationResponse = await RYEClient.request(
    submitCartMutation,
    submitCartMutationVariables
  );
  return null;
};
