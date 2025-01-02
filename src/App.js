import { BrowserRouter, Routes, Route } from "react-router-dom"; // Add `Route` to the import
import BingoGame from "./page/bingoGame";
import Chat from "./components/Chat"
// import "./style/App.css"
// import NewGameOver from "./components/NewGameOver";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<BingoGame />} />
      <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
