import React from "react";

const GameClearModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1 className="clear-title">GAME CLEAR!</h1>
        <p className="clear-message">
          エリクサーの調合に成功しました！
        </p>
        <p className="clear-sub">
          全ての薬草を集め、伝説の霊薬を完成させた
          あなたは真の錬金術師です。
        </p>
        <button className="btn btn-primary" onClick={onClose}>
          続けてプレイする
        </button>
      </div>
    </div>
  );
};

export default GameClearModal;
