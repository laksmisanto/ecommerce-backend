import { Variation } from "../models/variation.model.js";
const createVariation = async (req, res) => {
  let error = {};

  const { name } = req.body;
  console.log("variation body req : ", req.body);

  console.log("create variation name : ", name);

  if (!name) {
    error.message = "name fields are required";
    res.status(400).send(error);
    return;
  }

  const exitingVariation = Variation.findOne({ name });

  if (exitingVariation) {
    error.massage = "variation name must be unique.";
    res.status(400).send(error);
    return;
  }

  const variation = await Variation.create({
    name,
    whoCreated: req.user?._id,
  });

  res.status(201).json({
    message: "Variation created successfully",
    data: variation,
  });
};
export { createVariation };
