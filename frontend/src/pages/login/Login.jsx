import React, {useState} from "react"
import "./Login.scss"
import {Link, useNavigate} from "react-router-dom"
import newRequest from "../../utils/newRequest.js";

const Login = () =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [wait, setWait] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          setWait(true)
          setError("")
          const res = await newRequest.post("/auth/login",{ email, password })
          localStorage.setItem("currentUser",JSON.stringify(res.data.user))
          localStorage.setItem("accessToken",res.data.accessToken)
          navigate("/");
          console.log("Logged In Successfully.")
          setWait(false);
        } catch (err) {
          setError(err.response.data)
          setWait(false)
        }
      }

    return (
        <div className="Login">
            <div className="container">
                <div className="left">
                    <img src="./img/illustration-1.png" alt=""/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Log In</h1>
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" id="email" placeholder="Email" autoComplete="email" onChange={(e)=>setEmail(e.target.value)}/>
                    <label htmlFor="password">Password</label>
                    <input name="password" id="password" type="password" placeholder="Password" autoComplete="password" onChange={(e)=>setPassword(e.target.value)}/>
                    <button type="submit" disabled={wait}>{wait ? "Logging In..." : "Log In"}</button>
                    {error && <span>{error}</span>}
                </form>
            </div>
            <span><Link to="/register" className="link">Not Registered? Join First.</Link></span>
        </div>
    )
}

export default Login