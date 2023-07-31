import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChessBoard.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";

const ChessBoard = ({ id, code, boardState, whiteP, blackP, turnP, moves, cK }) => {
  const currentUser = getCurrentUser();
  const [highlighted, setHighlighted] = useState([]);
  const [board, setBoard] = useState(boardState);
  const [toMove, setToMove] = useState({});
  const [isCapture, setCapture] = useState(false);
  const [danger, setDanger] = useState(null);
  const [checkedKing, setCheckedKing] = useState(cK);
  const [checkMate, setCheckMate] = useState(false);
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState(turnP);
  const [moveN, setMoveN] = useState(moves);
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const white = ["♙", "♖", "♘", "♗", "♕", "♔"];
  const black = ["♛", "♚", "♝", "♞", "♜", "♟︎"];
  const socket = io("http://localhost:4000");

  const isPieceWhite = (piece) => {
    return white.some((e) => e === piece);
  };
  const isPieceBlack = (piece) => {
    return black.some((e) => e === piece);
  };

  const findKingPosition = (board, kingColor) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (kingColor === "white" && piece === "♔") {
          return { row, col };
        } else if (kingColor === "black" && piece === "♚") {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isValidMove = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const handleGameWin = (winningPlayer) => {
    setTimeout(() => {
      setWinner(winningPlayer);
    }, 4000);
  };

  const handleOver = async () => {
    const data = {
      id: id,
      boardState: board,
      turn: "",
      winner: winner,
      status: "Finished",
    };
    socket.emit("move", data);
    handleNavigate();
  };

  useEffect(() => {
    const handleUpdated = (updatedData) => {
      console.log("Received updated match data:", updatedData);
      setBoard(updatedData.boardState);
      setTurn(updatedData.turn);
      setMoveN(updatedData.moves);
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
      checkedKing: checkedKing
    };
    console.log("Data: ", data);
    if (moveN !== moves && !checkMate) {
      socket.emit("move", data);
    }
    handleCheckAndCheckmate(board, turn, whiteP, blackP);
  }, [moveN]);

  const handleNavigate = () => {
    window.location.href = `/games?reload=true`;
  };

  const handleCheckAndCheckmate = () => {
    const checkedKingColor = turn === whiteP ? "white" : "black";
    const kingPosition = findKingPosition(board, checkedKingColor);
    if (isKingInCheck(board, kingPosition.row, kingPosition.col)) {
      // setCheck(true);
      if (isCheckmate(board, kingPosition)) {
        setCheckMate(true);
        const w = isPieceWhite(checkedKing) ? blackP : whiteP;
        setTurn(null);
        handleGameWin(w);
      }
    }
    console.log("Checked: ", checkedKing);
    console.log("CheckMate: ", checkMate);
    console.log("Winner: ", winner);
  };

  const handleHighlight = (r, c) => {
    const piece = board[r][c];
    setCapture(false);
    if (
      turn === currentUser?._id &&
      ((isPieceWhite(piece) && currentUser?._id === whiteP) ||
        (isPieceBlack(piece) && currentUser?._id === blackP))
    ) {
      const allowedSquares = calculateAllowedSquares(piece, r, c, board);
      setHighlighted(allowedSquares);
      setToMove({ r: r, c: c });
    } else {
      setHighlighted([]);
      setCapture(false);
    }
  };

  const calculateAllowedSquares = (piece, r, c, board) => {
    const pieceMap = {
      "♙": calculateAllowedSquaresForPawn,
      "♖": calculateAllowedSquaresForRook,
      "♘": calculateAllowedSquaresForKnight,
      "♗": calculateAllowedSquaresForBishop,
      "♕": calculateAllowedSquaresForQueen,
      "♔": calculateAllowedSquaresForKing,
      "♟︎": calculateAllowedSquaresForPawn,
      "♜": calculateAllowedSquaresForRook,
      "♞": calculateAllowedSquaresForKnight,
      "♝": calculateAllowedSquaresForBishop,
      "♛": calculateAllowedSquaresForQueen,
      "♚": calculateAllowedSquaresForKing,
    };

    const allowedSquaresFn = pieceMap[piece];
    if (allowedSquaresFn) {
      return allowedSquaresFn(r, c, piece, board);
    } else {
      return [];
    }
  };

  const calculateAllowedSquaresForPawn = (r, c, piece, board) => {
    if (isPieceWhite(piece)) {
      if (moveN === 0) {
        const allowed = [
          { row: r - 1, col: c },
          { row: r - 2, col: c },
        ];
        return allowed;
      } else {
        let allowed = [];
        if (isPieceBlack(board[r - 1][c + 1])) {
          allowed.push({ row: r - 1, col: c + 1 });
          setCapture(true);
        }
        if (isPieceBlack(board[r - 1][c - 1])) {
          allowed.push({ row: r - 1, col: c - 1 });
          setCapture(true);
        }
        if (!isPieceWhite(board[r - 1][c]) && !isPieceBlack(board[r - 1][c])) {
          allowed.push({ row: r - 1, col: c });
        }
        return allowed;
      }
    } else {
      if (moveN === 1) {
        const allowed = [
          { row: r + 1, col: c },
          { row: r + 2, col: c },
        ];
        return allowed;
      } else {
        let allowed = [];
        if (isPieceWhite(boardState[r + 1][c + 1])) {
          allowed.push({ row: r + 1, col: c + 1 });
          setCapture(true);
        }
        if (isPieceWhite(boardState[r + 1][c - 1])) {
          allowed.push({ row: r + 1, col: c - 1 });
          setCapture(true);
        }
        if (!isPieceWhite(board[r + 1][c]) && !isPieceBlack(board[r + 1][c])) {
          allowed.push({ row: r + 1, col: c });
        }
        return allowed;
      }
    }
  };

  const calculateAllowedSquaresForRook = (r, c, piece, board) => {
    const allowed = [];

    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return true;
      }

      const targetPiece = board[row][col];

      if (isPieceWhite(piece) && isPieceWhite(targetPiece)) {
        return true;
      }

      if (isPieceBlack(piece) && isPieceBlack(targetPiece)) {
        return true;
      }

      allowed.push({ row, col });

      if (isPieceWhite(piece) && isPieceBlack(targetPiece)) {
        setCapture(true);
        return true;
      }

      if (isPieceBlack(piece) && isPieceWhite(targetPiece)) {
        setCapture(true);
        return true;
      }

      return false;
    };

    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c)) break;
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c)) break;
    }
    for (let j = 1; j < 8; j++) {
      if (checkSquare(r, c + j)) break;
    }
    for (let j = 1; j < 8; j++) {
      if (checkSquare(r, c - j)) break;
    }

    return allowed;
  };

  const calculateAllowedSquaresForKnight = (r, c, piece, board) => {
    let allowed = [];

    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return;
      }
      allowed.push({ row, col });
      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        setCapture(true);
      }
    };

    checkSquare(r + 2, c - 1);
    checkSquare(r + 2, c + 1);
    checkSquare(r - 2, c - 1);
    checkSquare(r - 2, c + 1);
    checkSquare(r - 1, c + 2);
    checkSquare(r + 1, c + 2);
    checkSquare(r - 1, c - 2);
    checkSquare(r + 1, c - 2);
    return allowed;
  };

  const calculateAllowedSquaresForBishop = (r, c, piece, board) => {
    let allowed = [];
    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return true;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return true;
      }

      allowed.push({ row, col });

      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        setCapture(true);
        return true;
      }
      return false;
    };
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c + i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c + i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c - i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c - i)) {
        break;
      }
    }
    return allowed;
  };

  const calculateAllowedSquaresForQueen = (r, c, piece, board) => {
    const bishop = calculateAllowedSquaresForBishop(r, c, piece, board);
    const rook = calculateAllowedSquaresForRook(r, c, piece, board);
    const allowed = [...new Set([...bishop, ...rook])];
    return allowed;
  };

  const calculateAllowedSquaresForKing = (r, c, piece, board) => {
    let allowed = [];
    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return;
      }
      allowed.push({ row, col });
      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        setCapture(true);
      }
    };
    checkSquare(r - 1, c);
    checkSquare(r - 1, c - 1);
    checkSquare(r - 1, c + 1);
    checkSquare(r + 1, c);
    checkSquare(r + 1, c - 1);
    checkSquare(r + 1, c + 1);
    checkSquare(r, c - 1);
    checkSquare(r, c + 1);

    return allowed;
  };

  const isKingInCheck = (board, kingRow, kingCol) => {
    const king = board[kingRow][kingCol];
    console.log("KingToTest: ", king);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (
          (isPieceWhite(king) && isPieceBlack(piece)) ||
          (isPieceBlack(king) && isPieceWhite(piece))
        ) {
          const allowedSquares = calculateAllowedSquares(
            piece,
            row,
            col,
            board
          );
          for (let i = 0; i < allowedSquares.length; i++) {
            if (
              allowedSquares[i].row === kingRow &&
              allowedSquares[i].col === kingCol
            ) {
              setCheckedKing(king);
              setDanger(piece);
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (board, kingPosition) => {
    if (!kingPosition) {
      return false;
    }

    const { row, col } = kingPosition;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) {
          continue;
        }

        const newRow = row + dx;
        const newCol = col + dy;

        if (
          isValidMove(newRow, newCol) &&
          !isKingInCheck(board, newRow, newCol)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleMovement = (row, col) => {
    if (!isSquareHighlighted(row, col)) {
      return;
    }
    if((board[toMove.r][toMove.c] === checkedKing) || (board[toMove.r][toMove.c] === danger))  {setCheckedKing(null); setDanger(null);}
    let tempBoard = board;
    tempBoard[row][col] = board[toMove.r][toMove.c];
    tempBoard[toMove.r][toMove.c] = "";
    setBoard(tempBoard);
    setToMove({});

    setMoveN(moveN + 1);
    turn === whiteP ? setTurn(blackP) : setTurn(whiteP);

    handleCheckAndCheckmate(tempBoard, turn, whiteP, blackP);

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
              onClick={() => handleMovement(rowIndex, columnIndex)}
            >
              <span
                onClick={() => handleHighlight(rowIndex, columnIndex)}
                style={(checkedKing&&(board[rowIndex][columnIndex]===checkedKing)) ? { color: "yellow" } : {}}
              >
                {board[rowIndex][columnIndex]}
              </span>
            </div>
          ))}
        </div>
      ))}

      {winner && (
        <div className="end">
          <span className="checkMate">CheckMate!</span>
          <span>Winner {winner === whiteP ? "White " : "Black"}</span>
          <button onClick={handleOver}>Game Over</button>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
