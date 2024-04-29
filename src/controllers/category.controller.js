import { Category } from "../models/category.model.js";
import cloudinaryServer from "../utils/cloudinary.js";

const createCategory = async (req, res) => {
  let error = {};
  const { name, details, slug } = req.body;
  if ([name, details].some((field) => field === "")) {
    error.message = "name and details field are required";
    res.status(400).send(error);
  }
  if (!req.file) {
    error.message = "Image field is required";
    res.status(400).send(error);
  }
  const { path } = req.file;
  const exitingCategory = await Category.findOne({ name });
  if (exitingCategory) {
    error.message = "category name is must be required";
    res.status(400).send(error);
  }
  const { url } = await cloudinaryServer(path);

  if (!slug) {
    slug: name;
  }
  const category = await Category.create({
    name,
    details,
    categoryImage: url,
    slug,
    whoCreated: req.user?._id,
  });
  res.status(201).json({
    message: "category created successfully",
    data: category,
  });
};

const categoryLists = async (req, res) => {
  const categoryList = await Category.find();
  res.send(categoryList);
};

export { createCategory, categoryLists };
