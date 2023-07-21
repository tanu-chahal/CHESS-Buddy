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

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try{
      setOpen(!open)
      const url = await upload(file)
      setEdit(!edit)
      const res = await newRequest.patch(`/user`,{img: url})
      localStorage.setItem("currentUser",JSON.stringify(res.data))
      navigate("/")
    }catch(err){
      setError(err.response.data)
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

        <div className="other">
          {currentUser ? (
              <button onClick = {handleNavigate}>Play</button>
          ) : (
            <Link to="/login" className="link">
              <button>Play</button>
            </Link>
          )}
          {currentUser && (
            <div className="profile">
              <img
                src={currentUser?.img || "./img/profile.png"}
                alt=""
                onClick={() => setOpen(!open)}
              />
              <span onClick={() => setOpen(!open)}>{currentUser.fullName}</span>
              {open && (
                <div className="options">
                  <span onClick={() => setEdit(!edit)}>
                    <img src="/img/edit.png" alt=""/>
                    Edit
                  </span>
                  <span onClick={handleLogout}>
                    <img src="/img/logout.png" alt=""/>
                    Logout
                  </span>
                </div>
              )}
            </div>
          )}

{edit && <div className="edit">
          <form onSubmit={handleEdit}>
            <label htmlFor="">Profile Photo</label>
            <input
              name="userImg"
              type="file"
              placeholder="Choose Picture"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit">Upload</button>
            <button onClick={() => setEdit(!edit)}>Close</button>
            {error && <span>{error}</span>}
          </form>
        </div>}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
