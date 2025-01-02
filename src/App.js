import { BrowserRouter, Routes, Route } from "react-router-dom"; // Add `Route` to the import
import BingoGame from "./page/bingoGame";
// import "./style/App.css"
// import NewGameOver from "./components/NewGameOver";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<BingoGame />} />
      {/* <Route path="/game-over" element={<NewGameOver/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
