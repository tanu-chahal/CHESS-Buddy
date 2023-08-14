import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { isPieceWhite, isPieceBlack } from "../../utils/chessUtils.js";
import { calculateAllowedSquares } from "../../utils/allowedSquares.js";

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
}) => {
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
  const white = ["♖", "♘", "♗", "♕"];
  const black = ["♛", "♝", "♞", "♜"];
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const socket = io("http://localhost:4000");

  useEffect(() => {
    const handleUpdated = (updatedData) => {
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
      setCheckedKing(updatedData.checkedKing);
      setWinner(updatedData.winner);
    };

    socket.on("connect", () => {
      // console.log(socket.id)
      // console.log("Connected to Socket.IO server!");
    });
    socket.emit("joinMatch", code);

    socket.on("message", (message) => {
      console.log(message);
    });

    socket.on("updated", handleUpdated);

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server!");
    });

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

  const isPromotion = (row, col) => {
    if (!toMove || !toMove.hasOwnProperty("r") || !toMove.hasOwnProperty("c")) {
      return false;
    }
    const piece = board[toMove.r][toMove.c];
    if ((piece == "♙" && row == 0) || (piece == "♟︎" && row == 7)) {
      setPromoteAt({ row, col });
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
      console.log(lastMove);
      const { allowed, capture, enPassant } = calculateAllowedSquares(
        piece,
        r,
        c,
        board,
        turn,
        whiteP,
        blackP,
        lastMove
      );
      setHighlighted(allowed);
      setCapture(capture);
      setEnPassant(enPassant);
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
    enPassant ? (tempBoard[lastMove[2]][lastMove[3]] = "") : {};
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
              // onClick={() => handleMovement(rowIndex, columnIndex)}
              onClick={() => isPromotion(rowIndex, columnIndex)}
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
            {winner === "Draw" ? "StaleMate!" : "CheckMate!"}
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
          <span>Promote {board[toMove.r][toMove.c]} to :</span>
          <div>
            {isPieceWhite(board[toMove.r][toMove.c])
              ? white.map((p) => (
                  <button key={p} onClick={() => setToPromote(p)}>
                    {p}
                  </button>
                ))
              : black.map((p) => (
                  <button key={p} onClick={() => setToPromote(p)}>
                    {p}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
