import React, { useEffect, useState } from "react";

const Reactio = () => {
  const [stat, setStat] = useState(false);
  const [string, setString] = useState(true);
  useEffect(() => {
    console.log("effect");
    setStat(true);
    setString("hi");
  }, []);
  const clickToTender = () => {
    // setStat(!stat);
    // setString(!string);
  };
  console.log("render");

  return (
    <div>
      React
      <button onClick={clickToTender}>click to render</button>
    </div>
  );
};

export default Reactio;
