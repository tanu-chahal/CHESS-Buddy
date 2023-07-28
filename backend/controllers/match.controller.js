import Match from "../models/match.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return next(createError(404, "Match not found!"));
    const opponentId = req.userId === match.white ? match.black : match.white;
    const user = await User.findById(opponentId);
    if (!user)
      return next(createError(404, "Your buddy not found on ChessBuddy."));
    const matchData = {
      ...match._doc,
      opponentName: user._doc.fullName,
      opponentImg: user._doc.img,
    };
    res.status(200).send(matchData);
  } catch (err) {
    next(err);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({
      $or: [{ white: req.userId }, { black: req.userId }],
    });
    if (!matches) return next(createError(404, "Match nor found!"));
    res.status(200).send(matches);
  } catch (err) {
    next(err);
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        createError(404, "Your buddy isn't registered on ChessBuddy.")
      );

    if (req.userId == user._id)
      return next(createError(400, "You can't create match with yourself."));

    const match = new Match({
      code: req.body.code,
      white: req.userId,
      black: user._id,
      turn: req.userId,
    });

    await match.save();
    res.status(201).send("Room Created Successfully.");
  } catch (err) {
    next(err);
  }
};

export const updateMatch = async (data) => {
  const { id, ...body } = data;
  try {
    const updatedData = await Match.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );
    return updatedData;
  } catch (err) {
    console.log("Error updating database:", err);
    throw err;
  }
};
