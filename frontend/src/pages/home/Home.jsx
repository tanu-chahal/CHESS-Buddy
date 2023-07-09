import React from "react"
import "./Home.scss"

const Home = () =>{
    return (
        <div className="Home">
        <div className="container">
            <img src="./img/chess-game.jpg" alt="CHESS-Buddy"/>
            <div className="intro">
                <div className="logo">
                <span className="chess">Chess</span>
                <span className="buddy">BUDDY</span>
                </div>
                <div className="btn">
                    <button>Log In</button>
                    <span>or</span>
                    <button>Join</button>
                </div>
                <div className="about">
                    <p>Play chess with your best buddies on CHESSBuddy.</p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Home