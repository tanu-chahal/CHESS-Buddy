import React, { useState, useEffect } from "react";
import "./Games.scss";
import { useQuery } from "@tanstack/react-query";
import NewGame from "../../components/newGame/NewGame.jsx";
import newRequest from "../../utils/newRequest.js";
import getCurrentUser from "../../utils/getCurrentUser.js";

const fetchUserData = async (opponentId) => {
  try {
    const response = await newRequest.get(`/user/${opponentId}`);
    return response.data.fullName;
  } catch (error) {
    return "errored";
  }
};

const Games = () => {
  const [create, setCreate] = useState(false);
  const currentUser = getCurrentUser();
  const [fullName, setFullName] = useState({});

  const { isLoading, error, data } = useQuery({
    queryKey: ["match"],
    queryFn: () =>
      newRequest.get(`/match`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (data) {
      const fetchUserNames = async () => {
        const promises = data.map((m) => {
          const opponentId =
            currentUser?._id === m?.white ? m?.black : m?.white;
          return fetchUserData(opponentId);
        });
        const names = await Promise.all(promises);
        const namesMap = data.reduce((acc, match, index) => {
          acc[match._id] = names[index];
          return acc;
        }, {});
        setFullName(namesMap);
      };

      fetchUserNames();
    }
  }, [data]);

  const handleNavigate = (match) => {
    window.location.href = `/game/${match._id}?reload=true`;
  };

  return (
    <div className="Games">
      <div className="container">
        <div className="title">
          <h1>My Games</h1>
          <button onClick={() => setCreate(!create)}>New Game</button>
          {create && <NewGame />}
        </div>
        {isLoading ? (
          "loading..."
        ) : error ? (
          "Something went wrong"
        ) : (
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Sr.No</th>
                <th>Opponent</th>
                <th>Status</th>
                <th>Action</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((match,index) => {
                return (
                  <tr key={match._id}>
                    <td>
                      <img src="./img/chess-board.png" />
                    </td>
                    <td>{data.length - 1 - index +1}</td>
                    <td className= "names">{fullName[match._id]}</td>
                    <td className={match.status}>{match.status}</td>
                    <td>
                      <button onClick={() => handleNavigate(match)}>
                        {match.winner ? "Check Out" : "Continue"}
                      </button>
                    </td>
                    <td>
                      {match.winner ? match.winner===currentUser?._id ? "YOU" : "OPPONENT": <button>
                        Abort
                      </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Games;
