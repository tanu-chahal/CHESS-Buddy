import React, { useState } from "react";
import "./NewGame.scss";
import generateRoomCode from "../../utils/generateRoomCode.js";
import newRequest from "../../utils/newRequest.js";

const NewGame = ({close, created}) => {
  const roomCode = generateRoomCode();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [btn, setBtn] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setBtn(false);
      const res = await newRequest.post("/match", { email, code: roomCode });
      setMsg(res.data +" Wait for a few seconds.");
      created(true)
      close(false)
    } catch (err) {
      setMsg(err.response.data);
    }
  };
  return (
    <div className="NewGame">
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Your Buddy's Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {btn && <button type="submit" className="btn">Create</button>}
        <button className="btn" onClick={()=>close(false)}>Close</button>
        <span>Room Code: {roomCode}</span>
        {msg && <span className="msg">{msg}</span>}
      </form>
    </div>
  );
};

export default NewGame;
