import React, { useEffect, useState, useContext } from "react";
import NewGameOver from "../components/NewGameOver";
import socket from "../socket/socket";
import { DataContext } from "../DataContext";
import Loader from "../components/Loader";
import checkBingoWin from "../utils/bingoHandler";
import Chat from "../components/Chat";

const BingoGame = () => {
  const context = useContext(DataContext);
  const [player1Grid] = useState(generateRandomNumbers());
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [remainingTime, setRemainingTime] = useState(25);
  const [timer, setTimer] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (player1Grid.length > 0) {
      const chunkedArrays = [];
      for (let i = 0; i < player1Grid.length; i += 5) {
        chunkedArrays.push(player1Grid.slice(i, i + 5));
      }
      context.setMyBoard(chunkedArrays);
    }
  }, [player1Grid]);

  useEffect(() => {
    socket.connectToSocket((data) => {
      console.log("socket connected successfully ====>", data);
    });
    socket.listenRoomJoin((data) => {
      console.log("room join === >", data);
      context.setIsRoomJoin(data);
    });
    socket.listenReceiveNumber((data) => {
      context.setReceiverNumber(data);
      if (data) {
        context.setCheckedNumbers((prev) => [...prev, data]);
      }
    });
    socket.listenTurnChange((newTurn) => {
      context.setCurrentTurn(newTurn);
    });
    socket.listenGameStatus((onGameStatus) => {
      console.log("onGameStatus === >", onGameStatus);
      context.setGameStatusMessage(onGameStatus);
    });
    socket.listenDisconnection((onDisconnectPlayer) => {
      console.log("onDisconnectPlayer ==== >", onDisconnectPlayer);
      context.setIsRoomJoin(false);
      context.setCheckedNumbers([]);
      context.setMyBoard([]);
      context.setGameStatusMessage("");
      localStorage.removeItem("chatHistory");
      context.setIsOpponentDisconnected(true);
      
    });
  });
  console.log("setIsRoomJoin === >", context.isRoomJoin);
  console.log("currentTurn ==== >", context.currentTurn);

  useEffect(() => {
    if (context?.isRoomJoin?.message) {
      startTimer();
    }
  }, [context.isRoomJoin?.message, context.currentTurn]);

  const resetTimer = () => {
    clearInterval(timer);
    setTimer(false);
    setRemainingTime(25);
    setIsTimeOver(false);
  };

  const startTimer = () => {
    resetTimer();
    const newTimer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setIsTimeOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const handleTimeOver = () => {
    const findRemainingNum = Array.from({ length: 25 }, (_, i) => i + 1).filter(
      (num) => !context.checkedNumbers.includes(num)
    );

    if (socket.socket) {
      if (findRemainingNum.length > 0) {
        const randomIndex = Math.floor(Math.random() * findRemainingNum.length);
        const randomNumber = findRemainingNum[randomIndex];

        socket.inputNumberToSocket(randomNumber);
      }
    }

    const nextTurn =
      context.currentTurn === "first player" ? "second player" : "first player";

    context.setCurrentTurn(nextTurn);
    socket.emitTurnChange(nextTurn);

    startTimer(nextTurn);
  };

  useEffect(() => {
    if (isTimeOver) {
      handleTimeOver();
    }
  }, [isTimeOver]);

  const onClick = (number) => {
    console.log("socketid ===== >", socket.socket.id);
    if (context.isRoomJoin.player === context.currentTurn) {
      resetTimer();
      context.setCheckedNumbers((prev) => {
        const updatedNumbers = [...prev, number];
        console.log("Updated checked numbers:", updatedNumbers);

        if (context.myBoard) {
          console.log("Current Board:", context.myBoard);

          const hasWon = checkBingoWin(context.myBoard, updatedNumbers, timer);
          console.log(`${context.isRoomJoin.player} Bingo Status:`, hasWon);

          if (hasWon) {
            context.setWinPlayer(context.isRoomJoin.player);
            socket.emitGameStateus(socket.socket.id);
            console.log(`${context.isRoomJoin.player} has won!`);
          }
        }

        return updatedNumbers;
      });

      if (socket.socket) {
        socket.inputNumberToSocket(number);
      }

      const nextTurn =
        context.currentTurn === "first player"
          ? "second player"
          : "first player";

      context.setCurrentTurn(nextTurn);
      socket.emitTurnChange(nextTurn);

      startTimer(nextTurn);
    }
  };

  const chatButtonClick = (e) => {
    console.log("chatButton click === >", e.target);
    setIsChatOpen((prevState) => !prevState); 
  };

  const isDisabled = context.isRoomJoin.player !== context.currentTurn;
  return (
    <div className="bingo-game-container">
      {!context.isRoomJoin?.message && (
        <Loader title="Please wait while we connect you with an opponent..." />
      )}
      {context?.isOpponentDisconnected && (
        <Loader
          title="Your opponent has disconnected. Find a new opponent?"
          isDisconnected
        />
      )}
      {context.gameStatusMessage && (
        <NewGameOver message={context.gameStatusMessage} />
      )}
      <h1 className="title">Bingo Game</h1>
      <div className="game-info">
        <span>
          👤Current Turn :{isDisabled ? " your opponent turn" : " your turn"}
        </span>
        <span>
          Last Number :{" "}
          <span style={{ fontWeight: "bold", color: "#92ed8d" }}>
            {context.receiverNumber}
          </span>
        </span>
        {!isDisabled && <span>Your Remaining Time : {remainingTime}s</span>}
        {isDisabled && <span>Your Opponent's Time : {remainingTime}s</span>}
      </div>
      <div className="bingo-grid">
        {player1Grid.map((num, index) => {
          const isRedCell = context.checkedNumbers?.includes(num);
          // const isDisabled = context.isRoomJoin.player !== context.currentTurn;
          return (
            <div
              key={index}
              className={`grid-item ${isRedCell ? "red-cell" : ""} ${
                isDisabled ? "disabled-cell" : ""
              }`}
              onClick={() => !isRedCell && !isDisabled && onClick(num)}
            >
              {num}
            </div>
          );
        })}
        <div>
          <button className="chat-toggle" onClick={chatButtonClick}>
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
          {isChatOpen &&!context.isOpponentDisconnected && <Chat socket={socket}/>}
        </div>
      </div>
    </div>
  );
};

const generateRandomNumbers = () => {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
};

export default BingoGame;
// still not working timer funcation
