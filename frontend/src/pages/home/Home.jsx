import React from "react";
import "./Home.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import { Link } from "react-router-dom";

const Home = () => {
  const currentUser = getCurrentUser();
  return (
    <div className="Home">
      <div className="container">
        <img src="./img/chess-game.jpg" alt="CHESS-Buddy" />
        {currentUser && (
          <div className="copy">
            <h1>
              Play chess with your best buddies on{" "}
              <span className="logo">
                <span className="chess">Chess</span>
                <span className="buddy">BUDDY</span>
              </span>
            </h1>
          </div>
        )}
        {!currentUser && (
          <div className="intro">
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

        <div className="howToPlay">
          <div className="left">
            <img src="/img/illustration-2.png" />
          </div>
          <div className="right">
            <h1>How To Play?</h1>
            <ol>
              <li>First sign up or log in to play.</li>
              <li>Create a new game or join an old Game.</li>
              <li>Share the room code with your buddy.</li>
              <li>Both of you can play together by entering the room code.</li>
              <li>Enjoy the game!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
