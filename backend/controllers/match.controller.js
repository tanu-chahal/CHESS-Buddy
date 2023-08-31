import Match from "../models/match.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import { handleCheckAndCheckmate } from "../utils/gameUtils.js";

export const getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return next(createError(404, "Match not found!"));
    const opponentId = req.userId === match.white ? match.black : match.white;
    let newData = null;

    if (match.status === "Active") {
      newData = JSON.parse(JSON.stringify(match));
      const isCheck = handleCheckAndCheckmate(
        match.turn,
        match.boardState,
        match.white,
        match.black,
        match.lastMove,
        match.castling
      );

      newData.checkedKing = isCheck.checkedKing;
      if (isCheck.checkMate) {
        newData.turn = null;
        const w = match.turn === match.black ? match.black : match.white;
        newData.winner = w;
        newData.status = "Finished";
      }

      if (isCheck.stale) {
        newData.turn = null;
        newData.winner = "Draw";
        newData.status = "Finished";
      }
    }

    const final = newData
      ? await Match.findByIdAndUpdate(
          req.params.id,
          { $set: { ...newData } },
          { new: true }
        )
      : match;

    const user = await User.findById(opponentId);
    if (!user)
      return next(createError(404, "Your buddy not found on ChessBuddy."));
    const matchData = {
      ...final._doc,
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
    if (!matches) return next(createError(404, "Match not found!"));
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

    const isCheck = handleCheckAndCheckmate(
      updatedData.turn,
      updatedData.boardState,
      updatedData.white,
      updatedData.black,
      updatedData.lastMove,
      updatedData.castling
    );
    let newData = JSON.parse(JSON.stringify(updatedData));

    newData.checkedKing = isCheck.checkedKing;
    if (isCheck.checkMate) {
      newData.turn = null;
      const w =
        updatedData.turn === updatedData.black
          ? updatedData.black
          : updatedData.white;
      newData.winner = w;
      newData.status = "Finished";
    }

    if (isCheck.stale) {
      newData.turn = null;
      newData.winner = "Draw";
      newData.status = "Finished";
    }

    const finalUpdate = await Match.findByIdAndUpdate(
      id,
      { $set: { ...newData } },
      { new: true }
    );
    return finalUpdate;
  } catch (err) {
    console.log("Error updating database:", err);
    throw err;
  }
};

export const abortMatch = async (req,res,next) => {
  try {
    const match = await Match.findById(req.body.id);
    if (!match) return next(createError(404, "Match not found!"));
    req.body.winner = req.userId=== match.white ? match.black : match.white;
    const updatedData = await Match.findByIdAndUpdate(
      req.body.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send(updatedData);
  } catch (err) {
    next(err)
  }
};

