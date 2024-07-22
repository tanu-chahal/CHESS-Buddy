// import {
//   isPieceWhite,
//   isPieceBlack,
//   findKingPosition,
//   isValidMove,
//   dangerousPositions,
// } from "../../frontend/src/utils/chessUtils.js";
// import { calculateAllowedSquares } from "../../frontend/src/utils/allowedSquares.js";
import {
  isPieceWhite,
  isPieceBlack,
  findKingPosition,
  isValidMove,
  dangerousPositions,
} from "./chessUtils.js";
import { calculateAllowedSquares } from "./allowedSquares.js";

export const handleCheckAndCheckmate = (
  turnClr,
  board,
  whiteP,
  blackP,
  lastMove,
  castling
) => {
  let checkMate = false;
  let stale = false;
  const checkedKingColor = turnClr === whiteP ? "white" : "black";
  const kingPosition = findKingPosition(board, checkedKingColor);
  if (!kingPosition || !board[kingPosition.row][kingPosition.col]) return;

  const king = board[kingPosition.row][kingPosition.col];
  let checkedKing = null;

  if (king !== "♔" && king !== "♚") return { checkedKing, checkMate };

  const check = isKingInCheck(
    board,
    kingPosition,
    turnClr,
    whiteP,
    blackP,
    lastMove,
    castling
  );

  if (check) {
    checkedKing = king;
    if (
      isCheckmate(
        board,
        kingPosition,
        turnClr,
        whiteP,
        blackP,
        lastMove,
        castling
      )
    ) {
      checkMate = true;
      return { checkedKing, checkMate, stale };
    }
  }
  if (!check) {
    stale = isStalemate(board, turnClr, whiteP, blackP, lastMove, castling);
  }
  return { checkedKing, checkMate, stale };
};

export const isKingInCheck = (
  board,
  kingPosition,
  turn,
  whiteP,
  blackP,
  lastMove,
  castling
) => {
  const king = board[kingPosition.row][kingPosition.col];
  if (king !== "♔" && king !== "♚") return;
  const dangerous = dangerousPositions(
    board,
    king,
    kingPosition.row,
    kingPosition.col,
    turn,
    whiteP,
    blackP,
    lastMove,
    castling
  );
  if (dangerous.length == 0) {
    return false;
  } else {
    return true;
  }
};

const isCheckmate = (
  board,
  kingPosition,
  turn,
  whiteP,
  blackP,
  lastMove,
  castling
) => {
  if (!kingPosition) {
    return false;
  }

  const { row, col } = kingPosition;
  const king = board[row][col];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      const newRow = row + dx;
      const newCol = col + dy;

      if (isValidMove(newRow, newCol)) {
        const kingPosition = { row: newRow, col: newCol };
        let tempBoard = board.map((r) => [...r]);
        tempBoard[newRow][newCol] = king;
        tempBoard[row][col] = "";
        if (
          !isKingInCheck(
            tempBoard,
            kingPosition,
            turn,
            whiteP,
            blackP,
            lastMove,
            castling
          )
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

const isStalemate = (board, turn, white, black, lastMove, castling) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        (turn === white && isPieceWhite(piece)) ||
        (isPieceBlack(piece) && turn === black)
      ) {
        let { allowed } = calculateAllowedSquares(
          piece,
          row,
          col,
          board,
          turn,
          white,
          black,
          lastMove,
          castling
        );
        if (allowed.length > 0) return false;
      }
    }
  }
  return true;
};
