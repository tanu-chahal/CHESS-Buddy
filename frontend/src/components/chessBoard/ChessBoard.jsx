import React from "react"
import "./ChessBoard.scss"

const ChessBoard =() =>{
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
    const initialBoardState = [
      ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
      ['♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
      ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
    ];
  
    return (
      <div className="ChessBoard">
        {rows.map((row, rowIndex) => (
          <div key={row} className="row">
            {columns.map((column, columnIndex) => (
              <div key={`${column}${row}`} className="square">
                {initialBoardState[rowIndex][columnIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  export default ChessBoard;