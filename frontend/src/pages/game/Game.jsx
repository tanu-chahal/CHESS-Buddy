import React, {useState} from "react";
import "./Game.scss";
import ChessBoard from "../../components/chessBoard/ChessBoard.jsx";
import newRequest from "../../utils/newRequest.js";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Game = () => {
  const currentUser = getCurrentUser();
  const [online, setOnline] = useState(false)
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["match"],
    queryFn: () =>
      newRequest.get(`/match/${id}`).then((res) => {
        return res.data;
      }),
  });
  const [pTurn, setTurn] = useState(data?.turn)

  if (isLoading || error) {
    return (
      <div className="Game">
        <div className="processing">loading...</div>
      </div>
    );
  }

  return (
    <div className="Game">
     {isLoading ? (
        <span className="processing">loading...</span>
      ) : error ? (
        <span className="processing">Something went wrong :( Try Reloading.</span>
      ) :
      <div className="container">
        <div className="left">
          <div className="opponent">
            <div className="userInfo">
            <img src={data.opponentImg || "/img/profile.png"} alt="" />
            <span>{data.opponentName || "Opponent"}</span>
            </div>
           <div className="additionalInfo">
           <span className="online">{online ? "Online" : "Offline"}</span>
           {pTurn !== currentUser?._id && <button>Turn</button>}</div> 
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
            status = {data.status}
            online={setOnline}
            pTurn = {setTurn}
          />
        </div>
        <div className="me">
          <div className="userInfo">
          <img src={currentUser?.img || "/img/profile.png"} alt="" />
          <span>{currentUser?.fullName || "Me"}</span>
          </div>
          <div className="additionalInfo">
          <span className="player">{data.white === currentUser?._id ? "White" : "Black"}</span>
          {pTurn === currentUser?._id && <button>Turn</button>}
          </div>
        </div>
      </div>
      }
    </div>
  );

};

export default Game;
