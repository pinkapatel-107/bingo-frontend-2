import { io, Socket } from "socket.io-client";

class MySocket {
  static instance = new MySocket();
  // http://localhost:3000
  // https://bingo-backend-p5sn.onrender.com
  constructor() {
    this.socket = io("https://bingo-backend-p5sn.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
    });
  }
  connectToSocket(callback) {
    this.socket.on("connect", () => {
      if (this.socket.connected) {
        // console.log(`Connected with ID === >: ${this.socket.id}`);
        callback(this?.socket?.id);
      }
    });
  }
  listenRoomJoin(onRoomJoined) {
    this.socket.on("roomJointed", onRoomJoined);
  }
  inputNumberToSocket(number) {
    this.socket.emit("sendNumber", number);
    console.log("emit number: ", number)
  }
  listenReceiveNumber(onReceiveNumber) {
    this.socket.on("receiveNumber", onReceiveNumber);
  }
  listenRoomLeft(onRoomLeft){
    this.socket.on('userLeavedRoom',onRoomLeft);
  }
  listenTurnChange(onTurnChanges){
    this.socket.on('playerTurnChange',onTurnChanges)
  }
  emitTurnChange(newTurn){
    this.socket.emit('onTurnChanges',newTurn);
  }
  listenDisconnection(onDisconnectPlayer){
    this.socket.on('opponentDisconnected',onDisconnectPlayer)
  }
  emitGameStateus(playerGameStatus){
    this.socket.emit("playerGameStatus",playerGameStatus)
  }
  listenGameStatus(onGameStatus){
    this.socket.on("onGameStatus",onGameStatus)
  }
  emitChatMessage(socketId){
    this.socket.emit("sendMessage1",socketId)
  }
  listenChatMessage(message){
    this.socket.on("receiveMessage",message)
  }


}

export default MySocket.instance;
