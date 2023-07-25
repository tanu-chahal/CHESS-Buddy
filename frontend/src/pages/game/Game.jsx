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
            <div className="captured">{data.captured}</div>
          </div>
        </div>
        <div className="right">
          <ChessBoard id={id} boardState={data.boardState} whiteP={data.players[0]}  blackP={data.players[1]} turnP={data.turn} moves={data.moves}/>
        </div>
        <div className="me">
          <div className="captured">{data.captured}</div>
          <img src={currentUser?.img || "/img/profile.png"} alt="" />
          <span>{currentUser?.fullName || "Me"}</span>
        </div>
      </div>
    </div>
  );
};

export default Game;
