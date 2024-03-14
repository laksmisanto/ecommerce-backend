import { Inventory } from "../models/inventory.model.js";

const createInventory = async (req, res) => {
  let error = {};

  const { quantity, inStock, buyPrice, sellPrice, discountPrice } = req.body;

  if (
    [quantity, inStock, buyPrice, sellPrice, discountPrice].some(
      (field) => field === ""
    )
  ) {
    error.message = "all fields are required";
    res.status(400).send(error);
  }

  const inventory = await Inventory.create({
    quantity,
    inStock,
    buyPrice,
    sellPrice,
    discountPrice,
    whoCreated: req.user?._id,
  });

  res.status(201).json({
    message: "inventory created successfully",
    data: inventory,
  });
};

export { createInventory };
