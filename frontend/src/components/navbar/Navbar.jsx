import React, { useState } from "react";
import "./Navbar.scss";
import getCurrentUser from "../../utils/getCurrentUser.js";
import newRequest from "../../utils/newRequest.js";
import upload from "../../utils/upload.js";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(undefined);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [wait, setWait] = useState(false);


  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
      console.log("Logged Out Successfully!")
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if(!file){ 
      setError("Please upload an image.")
      return;
    }
    try {
      setOpen(!open);
      setWait(true)
      setError("")
      const url = await upload(file);
      setEdit(!edit);
      const res = await newRequest.patch(`/user`, { img: url });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
      setWait(false);
    } catch (err) {
      setError(err.response.data);
      setWait(false);
    }
  };

  const handleNavigate = () => {
    window.location.href = `/games?reload=true`;
  };

  return (
    <div className="Navbar">
      <div className="container">
        <Link to="/" className="link">
          <div className="logo">
            <span className="chess">Chess</span>
            <span className="buddy">BUDDY</span>
          </div>
        </Link>

        <div className={sidebar ?"other":"other sidebarGo"}>
          {currentUser ? (
            <span className="playBtn" onClick={handleNavigate}>Play</span>
          ) : (
            <Link to="/login" className="link">
              <span className="playBtn">Play</span>
            </Link>
          )}
          {currentUser && (
            <div className="profile">
              <img
                src={currentUser?.img || "/img/profile.png"}
                alt=""
                onClick={() => setOpen(!open)}
              />
              <span onClick={() => setOpen(!open)}>{currentUser.fullName}</span>
              {open && (
                <div className="options">
                  <span onClick={() => setEdit(!edit)}>
                    <img src="/img/edit.png" alt="" />
                    Edit
                  </span>
                  <span onClick={handleLogout}>
                    <img src="/img/logout.png" alt="" />
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}

          {edit && (
            <div className="edit">
              <form onSubmit={handleEdit}>
                <label htmlFor="">Profile Photo</label>
                <input
                  name="userImg"
                  type="file"
                  placeholder="Choose Picture"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" disabled={wait}>{wait ? "Uploading..." : "Upload"}</button>
                <button onClick={() => setEdit(!edit)}>Close</button>
                {error && <span className="error">{error}</span>}
              </form>
            </div>
          )}
        </div>

          <div className="menuContainer">
          <img
            src="/img/menu.svg"
            alt="menu"
            className="menu"
            onClick={() => setSidebar(!sidebar)}
          />
          </div>
       
      </div>

      <hr />
    </div>
  );
};

export default Navbar;
