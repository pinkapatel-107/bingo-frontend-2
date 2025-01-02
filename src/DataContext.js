import { createContext, useState } from "react";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [isRoomJoin, setIsRoomJoin] = useState({});
  const [receiverNumber,setReceiverNumber] = useState([]);
  const [checkedNumbers, setCheckedNumbers] = useState([]);
  const [currentTurn,setCurrentTurn] = useState("first player");
  const [myBoard, setMyBoard] = useState([]);
  const [gameStatusMessage, setGameStatusMessage] = useState("");
  const [winPlayer, setWinPlayer] = useState("");
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);

  const value = {
    isRoomJoin,
    setIsRoomJoin,
    receiverNumber,
    setReceiverNumber,
    checkedNumbers,
    setCheckedNumbers,
    currentTurn,
    setCurrentTurn,
    myBoard,
    setMyBoard,
    gameStatusMessage,
    setGameStatusMessage,
    winPlayer,
    setWinPlayer,
    isOpponentDisconnected,
    setIsOpponentDisconnected
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export { DataContext, DataProvider };
