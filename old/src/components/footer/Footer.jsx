import React from "react"
import "./Footer.scss"
import {Link} from "react-router-dom"

const Footer  = () =>{
    return (
        <div className="Footer">
          <hr/>
        <div className="container">
        <div className="logo">
          <span className="chess">Chess</span>
          <span className="buddy">BUDDY</span>
        </div>
        <div className="section">
        <Link to="https://github.com/tanu-chahal/CHESS-Buddy" className="link" target="_blank">{"Code </>"}</Link>
        <span>Made with 🧡</span></div>
        </div>
        </div>
    )
}

export default Footer