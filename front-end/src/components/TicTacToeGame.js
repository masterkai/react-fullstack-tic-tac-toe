import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import TicTacToeBoard from "./TicTacToeBoard";
import { CircleIcon, XIcon } from "../Icons";
import { Box, Paper, Stack, styled } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import socketIoClient from "socket.io-client";

const TicTacToeGame = () => {
  const getStartingMatrix = () => [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  // const [currentPlayer, setCurrentPlayer] = useState("X");
  const [socket, setSocket] = useState(null);
  const [playerIsWaiting, setPlayerIsWaiting] = useState(true);
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  const [playerXMoves, setPlayerXMoves] = useImmer(() => getStartingMatrix());
  const [playerOMoves, setPlayerOMoves] = useImmer(() => getStartingMatrix());
  // const [currentGameState, setCurrentGameState] = useImmer(() => RUNNING);
  const [playerIsWinner, setPlayerIsWinner] = useState(false);
  const [playerIsLoser, setPlayerIsLoser] = useState(false);
  const [gameIsTie, setGameIsTie] = useState(false);
  // const togglePlayer = () => {
  //   setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  // };
  const handleReset = () => socket.emit("reset game");
  const handleTurn = (row, column) => {
    socket.emit("new move", row, column);
    // if (currentPlayer === "X") {
    //   setPlayerXMoves((draft) => {
    //     draft[row][column] = 1;
    //   });
    // } else {
    //   setPlayerOMoves((draft) => {
    //     draft[row][column] = 1;
    //   });
    // }
    // togglePlayer();
  };

  useEffect(() => {
    const serverUrl = process.env.NODE_ENV === "development" ?"http://127.0.0.1:8080":"https://tic-tac-toe-maxliu-01427471ad34.herokuapp.com/"
    let newSocket = socketIoClient(serverUrl);
    setSocket(newSocket);
    newSocket.on("info", (data) => {
      console.log(data);
    });
    newSocket.on("start", () => {
      setPlayerIsWaiting(false);
    });
    newSocket.on("other player turn", () => {
      setIsPlayersTurn(false);
    });
    newSocket.on("your turn", () => {
      setIsPlayersTurn(true);
    });
    newSocket.on("updated moves", (newPlayerXMoves, newPlayerOMoves) => {
      setPlayerXMoves(newPlayerXMoves);
      setPlayerOMoves(newPlayerOMoves);
    });
    newSocket.on("win", () => {
      setPlayerIsWinner(true);
    });
    newSocket.on("lose", () => {
      setPlayerIsLoser(true);
    });
    newSocket.on("tie", () => {
      setGameIsTie(true);
    });
    newSocket.on("game restarted", () => {
      setPlayerIsWinner(false);
      setPlayerIsLoser(false);
      setGameIsTie(false);
    });
    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  if (playerIsWaiting) return <h1>waiting for another player to join...</h1>;
  // if (currentGameState === PLAYER_X_WINS) return <h1>PLAYER X WINS</h1>;
  // if (currentGameState === PLAYER_O_WINS) return <h1>PLAYER O WINS</h1>;
  // if (currentGameState === CATS_GAME) return <h1>Cats' game!! Nobody wins!</h1>;
  const gameIsOver = playerIsWinner || playerIsLoser || gameIsTie;
  return (
    <>
      <TicTacToeBoard
        playerXMoves={playerXMoves}
        playerOMoves={playerOMoves}
        onClickCell={handleTurn}
      />
      {playerIsWinner && <h3>You are the winner!!</h3>}
      {playerIsLoser && <h3>You are not the winner!!</h3>}
      {gameIsTie && <h3>Cats' GAME!! Neither Player Wins!!</h3>}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Box>
          <XIcon sx={{ fontSize: 14, color: "#35C2BF" }} />
          <CircleIcon sx={{ fontSize: 14, color: "#F2B235" }} />
        </Box>
        {gameIsOver ||
          (isPlayersTurn ? (
            <h3>It's Your Turn</h3>
          ) : (
            <h3>waiting for other player's input</h3>
          ))}
        <Item>
          <IconButton onClick={handleReset}>
            <RefreshIcon />
          </IconButton>
        </Item>
      </Stack>
    </>
  );
};
export default TicTacToeGame;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
