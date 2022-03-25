import "./PlayBar.css";
const PlayBar = ({ start, stop }) => {
  return (
    <div className="playbar">
      <button className="playbar__btn" onClick={start}>
        Start
      </button>
      <button className="playbar__btn" onClick={stop}>
        Stop
      </button>
    </div>
  );
};

export default PlayBar;
