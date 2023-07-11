import React from "react"
import "./Register.scss"
import {Link} from "react-router-dom"

const Register = () =>{
    return (
        <div className="Register">
            <div className="container">
            <div className="left">
                    <img src="./img/illustration-1.png"/>
                </div>
                <form>
                    <h1>Log In</h1>
                    <label htmlFor="">Name</label>
                    <input name="name" type="text" placeholder="Full Name"/>
                    <label htmlFor="">Email</label>
                    <input name="email" type="email" placeholder="Email"/>
                    <label htmlFor="">Password</label>
                    <input name="password" type="password" placeholder="Password"/>
                    <button type="submit">Join</button>
                </form>
            </div>
            <span><Link to="/login" className="link">Already Registered? Log In.</Link></span>
        </div>
    )
}

export default Register