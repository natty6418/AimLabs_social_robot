import React from "react";
import { useState } from "react";
import { useRef } from "react";
import "./App.css";
import Header from "./Components/Header";
import Main from "./Components/Main";
export default function App() {
  let numOfTrials = 18;
  const [trial, setTrial] = React.useState(0);
  const [time, setTime] = useState(Date.now());
  const [wrong, setWrong] = useState("");
  const [responseTime, setResponseTime] = useState({
    0: { Time: Date.now(), Wrong: false },
  });
  const [distructionData, setDistructionData] = useState({"startTime": 0, "endTime": 0, "yawn": 0, "sneeze": 0, "sing": 0})
  const experiment_no = 0;
  function ResponseTime() {
    // console.log("here")
    const currentTime = Date.now();
    // console.log(`Trial: ${trial}`)
    setTrial((prev) => prev + 1);
    // console.log(`Trial: ${trial}`)
    setResponseTime((prevResponseTime) => ({
      ...prevResponseTime,
      [trial]: {
        Time: Math.floor(currentTime - time),
        Wrong: wrong,
      },
    }));
    // console.log(responseTime)
    setTime(Date.now());
    trial === numOfTrials && setDistructionData(prev => ({
      ...prev,
      "endTime": Date.now()
    }))
  }
  // function incrementTrial() {
  //   setTrial((prev) => prev + 1);
  // }
  function download() {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(responseTime)+JSON.stringify(distructionData)], {
      type: "text/plain",
    });
    link.href = URL.createObjectURL(file);
    link.download = `experiment ${experiment_no}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function handleWrong(w) {
    setWrong(w);
  }
  // Greetings and introduction
  return (
    <div className="app">
      <Header trialNum={trial}/>
      {trial < numOfTrials +1 ? (
        <Main
          setTime={setTime}
          responseTime={responseTime}
          ResponseTime={ResponseTime}
          handleWrong={handleWrong}
          trial = {trial}
          handleDistructionData = {setDistructionData}
        />
      ) : (
        <div className="end-trail">
          <h1>End of Trial.</h1>
          <button className="download-btn" onClick={() => download()}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
