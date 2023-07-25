import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));
    const { password, ...info } = user._doc;
    res.status(200).send(info);
  } catch (err) {
    next(err);
  }
};

export const Update = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          img: req.body.img,
        },
      }, { new: true },
    );
    if (!user) return next(createError(404, "User not found!"));
    const { password, ...info } = user._doc;
    res.status(200).send(info);
  } catch (err) {
    next(err);
  }
};
