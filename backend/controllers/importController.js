import {
  createAmazonProductsOnStore,
  createShopifyProductsOnStore,
} from "../services/vgc.js";

export const importShopifyProducts = async (req, res) => {
  if (req.body.product_urls.length > 0) {
    const { importedProductCounts, fetchFailedUrls } =
      await createShopifyProductsOnStore(req.body.product_urls);
    return res.status(200).json({
      requested_counts: req.body.product_urls.length,
      imported_counts: importedProductCounts,
      fetch_failed_urls: fetchFailedUrls,
    });
  }
  return res.status(422).json({ error: "No urls provided" });
};

export const importAmazonProducts = async (req, res) => {
  if (req.body.product_urls.length > 0) {
    const importedProductCounts = await createAmazonProductsOnStore(
      req.body.product_urls
    );
    return res.status(200).json({
      requested_counts: req.body.product_urls.length,
      imported_counts: importedProductCounts,
    });
  }
  return res.status(422).json({ error: "No urls provided" });
};
