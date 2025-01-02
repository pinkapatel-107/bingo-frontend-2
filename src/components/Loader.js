import React from "react";

const Loader = ({title,isDisconnected}) => {

  const onClickBtn = () => {
    window.location.reload();
   };
  return (
    <div className="loader-box-container">
      <div className="loader-box">
        <div className="loader-circle"></div>
        <h1 className="loader-title">Finding a Match</h1>
        <p className="loader-subtext">
          {title}
        </p>
        {isDisconnected && (
          <button
            className="find-button"
            onClick={onClickBtn} >Find new opponent</button>)}
      </div>
    </div>
  );
};

export default Loader;
