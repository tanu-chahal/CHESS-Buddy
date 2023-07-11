import React from "react";
import "./Navbar.scss";
import getCurrentUser from "../../utils/getCurrentUser.js"
import {Link} from "react-router-dom"

const Navbar = () => {
  const currentUser = getCurrentUser();
  return (
    <div className="Navbar">
      <div className="container">
        <Link to="/" className="link"><div className="logo">
          <span className="chess">Chess</span>
          <span className="buddy">BUDDY</span>
        </div></Link>
        
          <div className="other">
             {currentUser ? <Link to="/games" className="link"><button>Play</button></Link> :<Link to="/login" className="link"><button>Play</button></Link> }
            {currentUser && <div className="profile">
            <img src="./img/profile.png" alt="" />
            <span>Tanu Chahal</span>
            </div>}
          </div>
       
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
