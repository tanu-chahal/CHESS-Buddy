import React, {useState} from "react"
import "./Register.scss"
import {Link, useNavigate} from "react-router-dom"
import newRequest from "../../utils/newRequest.js";

const Register = () =>{
    const navigate = useNavigate();
    const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    img: ""
    })
    const [error, setError] = useState(null);

    const handleChange = (e) =>{
        setUser((prev) =>{
            return {...prev, [e.target.name]: e.target.value}
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            await newRequest.post("/auth/register",{...user})
            const res = await newRequest.post("/auth/login",{email: user.email,password: user.password})
            localStorage.setItem("currentUser",JSON.stringify(res.data))
            navigate("/")
        }catch(err){
            setError(err.response.data)
        }
    }
    return (
        <div className="Register">
            <div className="container">
            <div className="left">
                    <img src="./img/illustration-1.png"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Join / Sign Up</h1>
                    <label htmlFor="">Name</label>
                    <input name="fullName" type="text" placeholder="Full Name" onChange={handleChange}/>
                    <label htmlFor="">Email</label>
                    <input name="email" type="email" placeholder="Email" onChange={handleChange}/>
                    <label htmlFor="">Password</label>
                    <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
                    <button type="submit">Join</button>
                    {error && <span>{error}</span>}
                </form>
            </div>
            <span><Link to="/login" className="link">Already Registered? Log In.</Link></span>
        </div>
    )
}

export default Register