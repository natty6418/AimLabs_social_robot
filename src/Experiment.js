import React from "react";
import { useState } from "react";
import { useRef, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import Main from "./Components/Main";
import h337 from 'heatmap.js';
import { startWebgazer } from "./utils/webgazerUtils";
export default function Experiment() {  
  let numOfTrials = 20;
  const [trial, setTrial] = React.useState(0);
  const [time, setTime] = useState(Date.now());
  const [wrong, setWrong] = useState("");
  const [responseTime, setResponseTime] = useState({
    0: { Time: Date.now(), Wrong: false },
  });
  const [distructionData, setDistructionData] = useState({"startTime": 0, "endTime": 0, "yawn": 0, "sneeze": 0, "sing": 0})
  const [apiResponse, setApiResponse] = useState({response: ""})
  const randomEltArr = useRef([]);
  const heatmapData = useRef([]);
  const experiment_no = 0;
  const config = useRef({
    radius: 25,
    maxOpacity: .5,
    minOpacity: 0,
    blur: .75
  });
  const lastTimeRef = useRef("");
  const lastGazeRef = useRef("")
  const webgazer = window.webgazer;
  window.saveDataAcrossSessions = true;
  useEffect(()=>{
    const fetchData = async () => {
      const response = await fetch("http://localhost:9000/api/trials");
      const trials = await response.json()
      setApiResponse({
        ...apiResponse,
        response: trials
      })
    }
    fetchData()
      .catch(console.error("Error",Error))
  },[])
  useEffect(()=>{
    startWebgazer();
    const interval = setInterval(() => {
      webgazer.showVideoPreview(false) /* shows all video previews */
    .showPredictionPoints(false) /* shows a square every 100 milliseconds where current prediction is */
    .applyKalmanFilter(true);
    }, 1000);
    setupHeatmap();
    webgazer.setGazeListener( eyeListener );
  return () => {
    clearInterval(interval)
    webgazer.end();
  }
  }, [])
  function generateAndDisplayHeatmap(data) {
    // Convert the heatmapData array to an object format expected by heatmap.js
    webgazer.end()
    let heatmapDataObject = {
      max: 100, // Specify the maximum value for color intensity (adjust as needed)
      data: data.map(point => ({
        x: point.x,
        y: point.y,
        value: point.value
      }))
    };
  
    // Create a heatmap instance
    const heatmapInstance = h337.create({
      container: document.getElementById('app'), // Change 'document.body' to the desired container for your heatmap
      radius: config.radius,
      maxOpacity: config.maxOpacity,
      minOpacity: config.minOpacity,
      blur: config.blur
    });
  
    // Add the data to the heatmap instance
    heatmapInstance.setData(heatmapDataObject);
  }
  function setupHeatmap() {
    // Don't use mousemove listener
    webgazer.removeMouseEventListeners();
    document.addEventListener('click', async (event)=>{
      webgazer.recordScreenPosition(event.clientX, event.clientY, 'click');
    });
    let height = window.innerHeight;
    let width = window.innerWidth;
    let container = document.getElementById('app');
    container.style.height = `${height}px`;
    container.style.width = `${width}px`;
    config.current.container = container;
    // create heatmap
    // heatmapInstance = h337.create(config);
  }
  async function eyeListener(data, clock) {
    if (lastTimeRef.current === "") {
      lastTimeRef.current = clock;
    }
  
    if (!!lastGazeRef.current) {
      if (!!lastGazeRef.current.x && !!lastGazeRef.current.y) {
        let duration = clock - lastTimeRef.current;
        let point = {
          x: Math.floor(lastGazeRef.current.x),
          y: Math.floor(lastGazeRef.current.y),
          value: duration
        };
  
        heatmapData.current.push(point); // Store the gaze data point in the heatmapData array
      }
    }
  
    lastGazeRef.current = data;
    lastTimeRef.current = clock;
  }
  function ResponseTime() {
    const currentTime = Date.now();
    setTrial((prev) => prev + 1);
    setResponseTime((prevResponseTime) => ({
      ...prevResponseTime,
      [trial]: {
        Time: Math.floor(currentTime - time),
        Wrong: wrong,
      },
    }));
    setTime(Date.now());
    trial === numOfTrials && setDistructionData(prev => ({
      ...prev,
      "endTime": Date.now()
    }))
  }
  function download() {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(responseTime)+JSON.stringify(distructionData)+'\n\n'+JSON.stringify(randomEltArr)], {
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
  return(
    <div id="app" className="app">
      <Header trialNum={trial}/>
      {trial < numOfTrials +1 ? (
        <Main
          setTime={setTime}
          responseTime={responseTime}
          ResponseTime={ResponseTime}
          handleWrong={handleWrong}
          trial = {trial}
          handleDistructionData = {setDistructionData}
          randomEltArr={randomEltArr}
          trials = {apiResponse.response}
        />
      ) : (
        <div className="end-trail">
          <h1>End of Trial.</h1>
          <button className="download-btn" onClick={() => download()}>
            Download
          </button>
          <button className="heatmap-btn" onClick={()=> generateAndDisplayHeatmap(heatmapData.current)}>
          Generate Heatmap
          </button>
        </div>
      )}
    </div> 
  )
}

