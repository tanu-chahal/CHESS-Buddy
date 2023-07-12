import React from "react"
import "./Game.scss"
import ChessBoard from "../../components/chessBoard/ChessBoard.jsx"

const Game = () =>{
    return (
        <div className="Game">
            <div className="container">
                <div className="left">
                    <div className="opponent">
                        <img src="/img/profile.png" alt=""/>
                        <span>Tanish Chahal</span>
                    </div>
                </div>
                <div className="right">
                 <ChessBoard/>
                </div>
            </div>
        </div>
    )
}

export default Game