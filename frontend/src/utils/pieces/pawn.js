import {
  isPieceWhite,
  isPieceBlack,
  isValidMove,
  findKingPosition,
  dangerousPositions,
} from "../chessUtils.js";

const adjacentPawn = (board,r,c)=>{
  return board[r][c] === "♙" || board[r][c] === "♟︎";
}

const calculateAllowedSquaresForPawn = (
  r,
  c,
  piece,
  board,
  turn,
  whiteP,
  blackP, 
  lastMove, castling
) => {
  const color = isPieceWhite(piece) ? "white" : "black";
  const direction = color === "white" ? -1 : 1;

  let allowed = [];
  let capture = false;
  let enPassant = false;

  if (isValidMove(r + direction, c) && !board[r + direction][c]) {
    allowed.push({ row: r + direction, col: c });
  }

  if ((color === "white" && r === 6) || (color === "black" && r === 1)) {
    if (
      isValidMove(r + direction * 2, c) &&
      !board[r + direction * 2][c] &&
      !board[r + direction][c]
    ) {
      allowed.push({ row: r + direction * 2, col: c });
    }
  }

  if (
    isValidMove(r + direction, c - 1) &&
    isPieceOpponent(board[r + direction][c - 1], color)
  ) {
    allowed.push({ row: r + direction, col: c - 1 });
    capture = true;
  }
  if (
    isValidMove(r + direction, c + 1) &&
    isPieceOpponent(board[r + direction][c + 1], color)
  ) {
    allowed.push({ row: r + direction, col: c + 1 });
    capture = true;
  }

  if (
    (turn === whiteP && isPieceWhite(piece)) ||
    (turn === blackP && isPieceBlack(piece))
  ) {
    if((adjacentPawn(board, r, c+1) && isPieceOpponent(board[r][c + 1], color)) ||  (adjacentPawn(board,r,c-1) && isPieceOpponent(board[r][c-1], color))){
      if(lastMove[0] == r+2*direction && lastMove[1]===c+1 && !board[r + direction][c + 1]){
       allowed.push({row: r + direction, col: c + 1})
       capture = true;
       enPassant=true;
      }
      else if(lastMove[0] == r+2*direction && lastMove[1]===c-1 && !board[r + direction][c - 1]){
       allowed.push({row: r + direction, col: c - 1})
       capture = true;
       enPassant = true;
      }
   }
    const clr = turn === whiteP ? "white" : "black";

    const kingPosition = findKingPosition(board, clr);
    const king = board[kingPosition.row][kingPosition.col];

    for (let i = allowed.length - 1; i >= 0; i--) {
      let tempBoard = board.map((row) => [...row]);
      tempBoard[allowed[i].row][allowed[i].col] = piece;
      tempBoard[r][c] = "";
      const dangerousPositionsArr = dangerousPositions(
        tempBoard,
        king,
        kingPosition.row,
        kingPosition.col,
        turn,
        whiteP,
        blackP, castling
      );
      if (dangerousPositionsArr.length !== 0) allowed.splice(i, 1);
    }
  }

  return { allowed, capture, enPassant };
};

const isPieceOpponent = (piece, color) => {
  return (
    (color === "white" && isPieceBlack(piece)) ||
    (color === "black" && isPieceWhite(piece))
  );
};

export default calculateAllowedSquaresForPawn;
