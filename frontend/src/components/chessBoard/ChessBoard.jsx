import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { isPieceWhite, isPieceBlack } from "../../utils/chessUtils.js";
import { calculateAllowedSquares } from "../../utils/allowedSquares.js";
import { availablePromotion } from "../../utils/availablePromotion.js";
import { useNavigate } from "react-router-dom";

const ChessBoard = ({
  id,
  code,
  boardState,
  whiteP,
  blackP,
  turnP,
  moves,
  cK,
  w,
  lM,
  cS,
  status,
  online,
  pTurn
}) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(boardState);
  const [toMove, setToMove] = useState({});
  const [isCapture, setCapture] = useState(false);
  const [checkedKing, setCheckedKing] = useState(cK);
  const [winner, setWinner] = useState(w);
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const [lastMove, setLastMove] = useState(lM);
  const [enPassant, setEnPassant] = useState(false);
  const [promoteAt, setPromoteAt] = useState(null);
  const [toPromote, setToPromote] = useState(null);
  const [castle, setCastle] = useState(null);
  const [castling, setCastling] = useState(cS);
  const [available, setAvailable] = useState(null);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const socket = io(import.meta.env.VITE_CHESSBUDDY_API); 

  useEffect(() => {
    const handleUpdated = (updatedData) => {
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
      setCheckedKing(updatedData.checkedKing);
      setWinner(updatedData.winner);
      setLastMove(updatedData.lastMove);
      setCastling(updatedData.castling);
      pTurn(updatedData.turn);
    };

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server!");
    });
     socket.emit("joinMatch", code);

     socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
      online(false); 
    });
    
    socket.on("OpponentStatus", (isOnline) => {
      online(isOnline); 
    });

    socket.on("updated", handleUpdated);


    return () => {
      socket.off("updated", handleUpdated);
    };
  }, []);

  useEffect(() => {
    const data = {
      id: id,
      boardState: board,
      moves: moveN,
      turn: turn,
      lastMove: lastMove,
      castling: castling,
    };
    if (moveN !== moves) {
      socket.emit("move", data);
    }
  }, [moveN]);

  useEffect(() => {
    if (promoteAt !== null && toPromote !== null) {
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[promoteAt.row][promoteAt.col] = toPromote;
      newBoard[toMove.r][toMove.c] = "";
      setBoard(newBoard);
      let newMove = [];
      newMove[0] = toMove.r;
      newMove[1] = toMove.c;
      newMove[2] = promoteAt.row;
      newMove[3] = promoteAt.col;
      setLastMove(newMove);
      setToMove({});
      setHighlighted([]);
      setCapture(false);
      setToPromote(null);
      setPromoteAt(null);
      setMoveN(moveN + 1);
    }
  }, [toPromote]);

  const handleNavigate = () => {
    window.location.href = `/games?reload=true`;
  };

  const handleMove = (row, col) => {
    if (!toMove || !toMove.hasOwnProperty("r") || !toMove.hasOwnProperty("c")) {
      return false;
    }
    const piece = board[toMove.r][toMove.c];
    if ((piece == "♙" && row == 0) || (piece == "♟︎" && row == 7)) {
      let tempBoard = JSON.parse(JSON.stringify(board));
      tempBoard[toMove.r][toMove.c] = "";
      setAvailable(availablePromotion(tempBoard, piece, row, col, blackP, whiteP, lastMove, castling) )
      if(available.length!=0){
        setPromoteAt({ row, col });
      }
      else handleMovement(row, col);
    } else {
      handleMovement(row, col);
    }
  };

  const handleHighlight = (r, c) => {
    const piece = board[r][c];
    setCapture(false);
    if (
      turn === currentUser?._id &&
      ((isPieceWhite(piece) && currentUser?._id === whiteP) ||
        (isPieceBlack(piece) && currentUser?._id === blackP))
    ) {
      const { allowed, capture, enPassant, castle } = calculateAllowedSquares(
        piece,
        r,
        c,
        board,
        turn,
        whiteP,
        blackP,
        lastMove,
        castling
      );
      setHighlighted(allowed);
      setCapture(capture);
      setEnPassant(enPassant);
      setCastle(castle);
      setToMove({ r: r, c: c });
    } else {
      setHighlighted([]);
      setCapture(false);
    }
  };

  const handleMovement = (row, col) => {
    if (!isSquareHighlighted(row, col)) {
      return;
    }
    let tempBoard = JSON.parse(JSON.stringify(board));
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = "";

    if (board[toMove.r][toMove.c] === "♖" && toMove.c === 7) {
      const temp = [...castling];
      temp[2] = true;
      setCastling(temp);
    } else if (board[toMove.r][toMove.c] === "♖" && toMove.c === 0) {
      const temp = [...castling];
      temp[1] = true;
      setCastling(temp);
    } else if (board[toMove.r][toMove.c] === "♜" && toMove.c === 0) {
      const temp = [...castling];
      temp[4] = true;
      setCastling(temp);
    } else if (board[toMove.r][toMove.c] === "♜" && toMove.c === 7) {
      const temp = [...castling];
      temp[5] = true;
      setCastling(temp);
    } else if (board[toMove.r][toMove.c] === "♔" && col === 4) {
      const temp = [...castling];
      temp[0] = true;
      setCastling(temp);
    } else if (board[toMove.r][toMove.c] === "♚" && col === 4) {
      const temp = [...castling];
      temp[3] = true;
      setCastling(temp);
    }

    if (castle === "king-side" && col === toMove.c + 2) {
      tempBoard[row][col - 1] = board[row][7];
      tempBoard[row][7] = "";
      if (isPieceWhite(board[toMove.r][toMove.c])) {
        const temp = [...castling];
        temp[0] = true;
        temp[2] = true;
        setCastling(temp);
      } else if (isPieceBlack(board[toMove.r][toMove.c])) {
        const temp = [...castling];
        temp[3] = true;
        temp[5] = true;
        setCastling(temp);
      }
    } else if (castle === "queen-side" && col === toMove.c - 2) {
      tempBoard[row][col + 1] = board[row][0];
      tempBoard[row][0] = "";
      if (isPieceWhite(board[toMove.r][toMove.c])) {
        const temp = [...castling];
        temp[0] = true;
        temp[1] = true;
        setCastling(temp);
      } else if (isPieceBlack(board[toMove.r][toMove.c])) {
        const temp = [...castling];
        temp[3] = true;
        temp[4] = true;
        setCastling(temp);
      }
    } else {
      enPassant ? (tempBoard[lastMove[2]][lastMove[3]] = "") : {};
    }
    setBoard(tempBoard);
    let newMove = [];
    newMove[0] = toMove.r;
    newMove[1] = toMove.c;
    newMove[2] = row;
    newMove[3] = col;
    setLastMove(newMove);
    setToMove({});
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP);
    setMoveN(moveN + 1);
    setHighlighted([]);
    setCapture(false);
  };

  const isSquareHighlighted = (r, c) => {
    return highlighted.some((sq) => sq.row === r && sq.col === c);
  };

  return (
    <div className="ChessBoard">
      {rows.map((row, rowIndex) => (
        <div key={row} className="row">
          {columns.map((column, columnIndex) => (
            <div
              key={`${column}${row}`}
              className="square"
              style={
                isSquareHighlighted(rowIndex, columnIndex)
                  ? {
                      boxSizing: "border-box",
                      border: isCapture ? "2px solid red" : "2px solid green",
                      backgroundColor: isCapture ? "#FF4500" : "#82ae61",
                    }
                  : {}
              }
              onClick={() => handleMove(rowIndex, columnIndex)}
            >
              <span
                onClick={() => handleHighlight(rowIndex, columnIndex)}
                style={
                  checkedKing !== null &&
                  board[rowIndex][columnIndex] === checkedKing
                    ? { color: "yellow" }
                    : {}
                }
              >
                {board[rowIndex][columnIndex]}
              </span>
            </div>
          ))}
        </div>
      ))}

      {winner && (
        <div className="end">
          <span className="checkMate">
            {winner === "Draw" ? "StaleMate!" : status=== "Aborted" ? "Aborted" : "CheckMate!"}
          </span>
          <span>
            {winner === whiteP
              ? "Winner White "
              : winner === blackP
              ? "Winner Black"
              : "Draw Match"}
          </span>
          <button onClick={handleNavigate}>Game Over</button>
        </div>
      )}

      {promoteAt && (
        <div className="end promote">
          <span>Available Promotions for {board[toMove.r][toMove.c]} :</span>
          <div>
            {available.map((p) => (
                  <button key={p} onClick={() => setToPromote(p)}>
                    {p}
                  </button>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
