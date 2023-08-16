import React from "react";
import "./Game.scss";
import ChessBoard from "../../components/chessBoard/ChessBoard.jsx";
import newRequest from "../../utils/newRequest.js";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Game = () => {
  const currentUser = getCurrentUser();
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["match"],
    queryFn: () =>
      newRequest.get(`/match/${id}`).then((res) => {
        return res.data;
      }),
  });

  if (isLoading || error) {
    return (
      <div className="Game">
        <div className="container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="Game">
      <div className="container">
        <div className="left">
          <div className="opponent">
            <img src={data.opponentImg || "/img/profile.png"} alt="" />
            <span>{data.opponentName || "Opponent"}</span>
            
          </div>
        </div>
        <div className="right">
          <ChessBoard
            id={data._id}
            code={data.code}
            boardState={data.boardState}
            whiteP={data.white}
            blackP={data.black}
            turnP={data.turn}
            moves={data.moves}
            cKing={data.checkedKing}
            w = {data.winner}
            lM = {data.lastMove}
            cS = {data.castling}
          />
        </div>
        <div className="me">
          <img src={currentUser?.img || "/img/profile.png"} alt="" />
          <span>{currentUser?.fullName || "Me"}</span>
          <button>{data.white === currentUser?._id ? "White" : "Black"}</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
