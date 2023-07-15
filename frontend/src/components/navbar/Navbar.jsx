import React,{useState} from "react";
import "./Navbar.scss";
import getCurrentUser from "../../utils/getCurrentUser.js"
import newRequest from "../../utils/newRequest.js"
import {Link, useNavigate} from "react-router-dom"

const Navbar = () => {
  const currentUser = getCurrentUser()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleLogout = async()=>{
    try {
      await newRequest.post("/auth/logout")
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (error) {
      console.log(error.message)
    }
  }

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
            <img src="./img/profile.png" alt="" onClick={()=>setOpen(!open)}/>
            <span onClick={()=>setOpen(!open)}>Tanu Chahal</span>
            {open && <div className="options">
            <span><img src="/img/edit.png"/>Edit</span>
            <span onClick={handleLogout}><img src="/img/logout.png"/>Logout</span>
          </div>}
            </div>
            }
          </div>
       
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
