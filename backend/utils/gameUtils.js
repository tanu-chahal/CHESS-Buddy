import {
  findKingPosition,
  isValidMove,
  dangerousPositions,
} from "../../frontend/src/utils/chessUtils.js";

export const handleCheckAndCheckmate = (turnClr, board, whiteP, blackP) => {
  let checkMate = false;
  const checkedKingColor = turnClr === whiteP ? "white" : "black";
  const kingPosition = findKingPosition(board, checkedKingColor);
  if (!kingPosition || !board[kingPosition.row][kingPosition.col]) return;

  const king = board[kingPosition.row][kingPosition.col];
  if (king !== "♔" && king !== "♚") return;

  let checkedKing = null;
  const check = isKingInCheck(board, kingPosition, turnClr, whiteP, blackP);

  if (check) {
    checkedKing = king;
    if (isCheckmate(board, kingPosition, turnClr, whiteP, blackP)) {
      checkMate = true;
      console.log("CheckMate: ", checkMate);
    }
  }
  console.log("Checked: ", checkedKing);
  return {checkedKing, checkMate };
};

const isKingInCheck = (board, kingPosition, turn, whiteP, blackP) => {
  const king = board[kingPosition.row][kingPosition.col];
  if (king !== "♔" && king !== "♚") return;
  console.log("KingToTest: ", king);
  const dangerous = dangerousPositions(
    board,
    king,
    kingPosition.row,
    kingPosition.col,
    turn, whiteP, blackP
  );
  if (dangerous.length == 0) {
    return false;
  } else {
    console.log("Dangerous", dangerous);
    return true;
  }
};

const isCheckmate = (board, kingPosition, turn, whiteP, blackP) => {
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
      const kingPosition = { row: newRow, col: newCol };

      if (isValidMove(newRow, newCol) && !isKingInCheck(board, kingPosition, turn, whiteP, blackP)) {
        return false;
      }
    }
  }

  return true;
};
