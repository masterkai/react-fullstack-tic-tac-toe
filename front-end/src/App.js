import "./App.css";
import TicTacToeGame from "./components/TicTacToeGame";
import { useImmer } from "use-immer";
import { Box, Button, Paper, Stack, styled } from "@mui/material";

function App() {
  const [gameMode, setGameMode] = useImmer("")
  return (
    <div className="content-container">
        {gameMode? null : (
          <Box sx={{
            height: "100vh",
            width: "50%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Stack spacing={2}>
              <Item><Button fullWidth variant={"outlined"} onClick={() => setGameMode("auto")}>Automatic
                Match-Up</Button></Item>
              <Item><Button fullWidth variant={"outlined"} onClick={() => setGameMode("host")}>Host a
                Game</Button></Item>
              <Item><Button fullWidth variant={"outlined"} onClick={() => setGameMode("join ")}>Join a Game by
                ID</Button></Item>
            </Stack>
          </Box>
        )}
      {gameMode === "auto" && <TicTacToeGame />}
    </div>
  );
}

export default App;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
