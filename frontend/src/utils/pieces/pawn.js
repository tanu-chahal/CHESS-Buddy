import { isPieceWhite, isPieceBlack, isValidMove } from "../chessUtils.js";
let capture = false;

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
          capture = true
        }
        if (isPieceWhite(boardState[r + 1][c - 1])) {
          allowed.push({ row: r + 1, col: c - 1 });
          capture = true
        }
        if (!isPieceWhite(board[r + 1][c]) && !isPieceBlack(board[r + 1][c])) {
          allowed.push({ row: r + 1, col: c });
        }
        return {allowed, capture};
      }
    }
  };

  export default calculateAllowedSquaresForPawn