import React from "react"
import "./Games.scss"
import {useNavigate} from "react-router-dom"

const Games = () =>{
    const navigate = useNavigate();
    return (
        <div className="Games">
            <div className="container">
                <div className="title">
                <h1>My Games</h1>
                <button>New Game</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Opponent</th>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button onClick={()=>navigate("/game/123")}>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        <tr>
                            <td><img src="./img/chess-board.png"/></td>
                            <td>Tanish Chahal</td>
                            <td>rftkgjlmnop</td>
                            <td>Pending</td>
                            <td><button>Continue</button></td>
                            <td><img src="./img/delete.png"/></td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Games