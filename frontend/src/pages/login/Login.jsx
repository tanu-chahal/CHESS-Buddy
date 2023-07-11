import React from "react"
import "./Login.scss"
import {Link} from "react-router-dom"

const Login = () =>{
    return (
        <div className="Login">
            <div className="container">
                <div className="left">
                    <img src="./img/illustration-1.png"/>
                </div>
                <form>
                    <h1>Log In</h1>
                    <label htmlFor="">Email</label>
                    <input name="email" type="email" placeholder="Email"/>
                    <label htmlFor="">Password</label>
                    <input name="password" type="password" placeholder="Password"/>
                    <button type="submit">Log In</button>
                </form>
            </div>
            <span><Link to="/register" className="link">Not Registered? Join First.</Link></span>
        </div>
    )
}

export default Login