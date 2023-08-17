import {
    isPieceWhite,
    findKingPosition,
  } from "./chessUtils.js";
  import { isKingInCheck } from "../../../backend/utils/gameUtils.js";

  export const availablePromotion = (board, piece, r,c, blackP, whiteP, lastMove, castling) =>{
    const clr = isPieceWhite(piece) ? "white": "black";
    const available = clr === "white" ? ["♖", "♘", "♗", "♕"] :  ["♛", "♝", "♞", "♜"];
    let final = [];

    const kingPosition = findKingPosition(board, clr === "white" ? "black" : "white");

    for(let i=0; i<available.length; i++){
        const tempBoard =  JSON.parse(JSON.stringify(board));
        tempBoard[r][c] = available[i];
        const check = isKingInCheck(
        tempBoard,
        kingPosition,
        clr==="white"? blackP : whiteP,
        whiteP,
        blackP,
        lastMove,
        castling
      );
      if(check){
        final.push(available[i]);
       }
    }
    return  available.filter(p=> !final.includes(p));
  }