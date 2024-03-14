import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import cloudinaryServer from "../utils/cloudinary.js";

const createProduct = async (req, res) => {
  let error = {};
  const { productName, productDetails, productCategory, slug } = req.body;
  if (
    [productName, productDetails, productCategory, slug].some(
      (field) => field === ""
    )
  ) {
    error.message = "all field are required";
    res.status(400).send(error);
  }

  if (!req.files.productFeaturedImage) {
    error.message = "Product Featured Image field is required";
    res.status(400).send(error);
  }
  if (!req.files.productDetailedImages) {
    error.message = "Product Detailed Images field are required";
    res.status(400).send(error);
  }
  // const { path } = req.files;
  const exitingProduct = await Product.findOne({ productName });
  if (exitingProduct) {
    error.message = "Product name is must be required";
    res.status(400).send(error);
  }

  const { path: productFeaturedImagePath } = req.files.productFeaturedImage[0];
  const { url } = await cloudinaryServer(productFeaturedImagePath);

  let urls = await Promise.all(
    req.files.productDetailedImages?.map((img) => {
      try {
        return cloudinaryServer(img.path);
      } catch (error) {
        console.log("Error Uploading Image to Cloudinary", error);
      }
    })
  );

  let urlLink = [];

  urls.map(({ url }) => {
    urlLink.push(url);
  });

  if (!slug) {
    let newSlug = productName.replaceAll("", "-");
    slug: newSlug;
  }
  const product = await Product.create({
    productName,
    productDetails,
    productCategory,
    productFeaturedImage: url,
    productDetailedImages: urlLink,
    slug,
    whoCreated: req.user?._id,
  });
  res.status(201).json({
    message: "product created successfully",
    data: product,
  });
};

export { createProduct };
