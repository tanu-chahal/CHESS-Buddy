import {
    isPieceWhite,
    isPieceBlack,
    isValidMove,
    dangerousPositions,
  } from "../chessUtils.js";

const calculateAllowedSquaresForKing = (r, c, piece, board, turn, whiteP, blackP) => {
    let allowed = [];
    const dangerous = [];
    let capture = false;
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
        capture = true;
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
  
    const king = board[r][c];
    if (
      ((turn === whiteP && isPieceWhite(king)) ||
        (turn === blackP && isPieceBlack(king))) &&
      allowed.length > 0
    ) {
      for (let i = 0; i < allowed.length; i++) {
        let tempBoard = board.map((row) => [...row]);
        tempBoard[allowed[i].row][allowed[i].col] = king;
        tempBoard[r][c] = "";
        const dangerousPositionsArr = dangerousPositions(
          tempBoard,
          king,
          allowed[i].row,
          allowed[i].col,
          turn, whiteP, blackP
        );
        dangerous.push(...dangerousPositionsArr);
      }
      allowed = allowed.filter(
        (pos) => !dangerous.some((d) => d.row === pos.row && d.col === pos.col)
      );
    }
    return { allowed, capture };
  };

  export default calculateAllowedSquaresForKing 