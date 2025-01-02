import React from "react";

const NewGameOver = ({message}) => {
  return (
    <div className="loader-box-container">
      <div className="loader-box">
        {message == "You are the winner!"&&<h1 className="loader-title">🎉Congratulations!🎉</h1>}
        {message !=="You are the winner!"&&<h1 className="loader-title">😌You lost!!😌</h1>}
        <p className="loader-subtext">{message}</p>
      </div>
    </div>
  );
};

export default NewGameOver;
