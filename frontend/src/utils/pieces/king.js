import {
    isPieceWhite,
    isPieceBlack,
    isValidMove,
    dangerousPositions,
  } from "../chessUtils.js";

const calculateAllowedSquaresForKing = (r, c, piece, board, turn, whiteP, blackP, lastMove, castling) => {
    let allowed = [];
    const dangerous = [];
    let capture = false;
    let castle = null;
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

    //for king side castle
   if(castling) { if(!board[r][c+1] && !board[r][c+2] && ((isPieceWhite(piece)&&!castling[0] &&!castling[2]) || (isPieceBlack(piece)&&!castling[3] &&!castling[5]))){
      allowed.push({row: r, col: c+2});
    }
    //for queen side castle
    if(!board[r][c-1] && !board[r][c-2] && !board[r][c-3] && ((isPieceWhite(piece)&& !castling[0] && !castling[1] ) || (isPieceBlack(piece)&& !castling[3] && !castling[4]))){
      allowed.push({row: r, col: c-2});
    }
  }
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
          turn, whiteP, blackP, lastMove, castling
        );
        dangerous.push(...dangerousPositionsArr);
      }
      allowed = allowed.filter(
        (pos) => !dangerous.some((d) => d.row === pos.row && d.col === pos.col)
      );
      if(allowed.some((square) => square.row === r && square.col === c + 2) &&
      allowed.some((square) => square.row === r && square.col === c + 1)){
        castle="king-side";
      }
      if(allowed.some((square) => square.row === r && square.col === c - 2) &&
      allowed.some((square) => square.row === r && square.col === c - 1)){
        castle="queen-side"
      }
    }
    return { allowed, capture, castle };
  };

  export default calculateAllowedSquaresForKing 