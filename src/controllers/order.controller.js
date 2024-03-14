import { Order } from "../models/order.model.js";

const createOrder = async (req, res) => {
  const order = await Order.create({
    whoCreate: req.user._id,
    inventory,
  });

  res.status(201).json({
    message: "Order created successfully",
    data: order,
  });
};

export { createOrder };
