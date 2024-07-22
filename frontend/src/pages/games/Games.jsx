import React, { useState, useEffect } from "react";
import "./Games.scss";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
  const [abort, setAbort] = useState(false);
  const [toAbort, setToAbort] = useState(null);
  const currentUser = getCurrentUser();
  const [fullName, setFullName] = useState({});
  const [created, setCreated] = useState(false);
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: (match) => {
      return newRequest.patch("/match", match);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["match"]);
    },
  });

  const mutationGet = useMutation({
    mutationFn: (match) => {
      return newRequest.get("/match");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["match"]);
    },
  });

  if (created) {
    mutationGet.mutate();
    setCreated(false);
  }

  const readyAbort = (id) => {
    setAbort(!abort);
    const match = { id: id, status: "Aborted", turn: null };
    setToAbort(match);
  };

  const handleAbort = () => {
    mutation.mutate(toAbort);
    setAbort(!abort);
    setToAbort(null);
  };

  const handleNavigate = (match) => {
    window.location.href = `/game/${match._id}?reload=true`;
  };

  return (
    <div className="Games">
      {isLoading ? (
        <span className="processing">loading...</span>
      ) : error ? (
        <span className="processing">Something went wrong :( Try Reloading.</span>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Games</h1>
            <button className="btn" onClick={() => setCreate(!create)}>
              New Game
            </button>
            {create && <NewGame close={setCreate} created={setCreated} />}
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
                {Array.isArray(data)
                  ? data
                      .slice()
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((match, index) => {
                        return (
                          <tr key={match._id}>
                            <td>
                              <img src="./img/chess-board.png" />
                            </td>
                            <td>{data.length - 1 - index + 1}</td>
                            <td className="names">{fullName[match._id]}</td>
                            <td className={match.status}>{match.status}</td>
                            <td>
                              <button
                                onClick={() => handleNavigate(match)}
                                className="btn"
                              >
                                {match.winner ? "Check Out" : "Continue"}
                              </button>
                            </td>
                            <td>
                              {match.winner ? (
                                match.winner === currentUser?._id ? (
                                  "YOU"
                                ) : match.winner === "Draw" ? (
                                  "DRAW"
                                ) : (
                                  "OPPONENT"
                                )
                              ) : (
                                <button
                                  className="btn"
                                  onClick={() => readyAbort(match._id)}
                                >
                                  Abort
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  : {}}
              </tbody>
            </table>
          )}
          {abort && (
            <div className="abort">
              <span>
                If you abort, you will be considered as the loser. Are you sure
                to abort?
              </span>
              <div>
                {" "}
                <button className="btn" onClick={() => setAbort(!abort)}>
                  Close
                </button>{" "}
                <button className="btn" onClick={handleAbort}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Games;
