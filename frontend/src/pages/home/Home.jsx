import React from "react";
import "./Home.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { Link } from "react-router-dom";

const Home = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="Home">
      <div className="container">
        <div className="hero">
        <img className="heroImg" src="./img/chess-game.jpg" alt="CHESS-Buddy" />
        {currentUser ? (
          <div className="copy">
            <h1>
              Play chess with your best buddies on{" "}
              <span className="logo">
                <span className="chess">Chess</span>
                <span className="buddy">BUDDY</span>
              </span>
            </h1>
          </div>)
       :
          (<div className="intro">
            <div className="msg">
              <p>Welcome to</p>
            </div>
            <div className="logo">
              <span className="chess">Chess</span>
              <span className="buddy">BUDDY</span>
            </div>
            <div className="btn">
              <Link to="/login" className="link">
                <button>Log In</button>
              </Link>
              <span>or</span>
              <Link to="/register" className="link">
                <button>Sign Up</button>
              </Link>
            </div>
            <div className="msg">
              <p>Play chess with your best buddies on CHESSBuddy.</p>
            </div>
          </div>
        )}
        </div>
        <div className="howToPlay">
          <div className="left">
            <img src="/img/illustration-2.png" alt=""/>
          </div>
          <div className="right">
            <h1>How To Play?</h1>
            <ol>
              <li>First sign up or log in to play.</li>
              <li>Create a new game.</li>
              <li>New game can be created by clicking on New Game button and entering your buddy's email (should be registered on CHESSBuddy).</li>
              <li>Join any game by clicking on Continue Button.</li>
              <li>You can see if your buddy is online, if Yes then</li>
              <li>Enjoy the game!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
