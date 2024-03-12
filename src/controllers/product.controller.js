import { Category } from "../models/category.model.js";
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
  const { path } = req.files;
  const exitingProduct = await Category.findOne({ productName });
  if (exitingProduct) {
    error.message = "Product name is must be required";
    res.status(400).send(error);
  }

  const { path: productFeaturedImage } = req.files.productFeaturedImage[0];
  console.log("This is product featured image", productFeaturedImage);

  // const { url } = await cloudinaryServer(path);
  //   console.log(url);
  //   if (!slug) {
  //     slug: name;
  //   }
  //   const category = await Category.create({
  //     name,
  //     details,
  //     categoryImage: url,
  //     slug,
  //     whoCreated: req.user?._id,
  //   });
  //   res.status(201).json({
  //     message: "category created successfully",
  //     data: category,
  //   });
};

export { createProduct };
