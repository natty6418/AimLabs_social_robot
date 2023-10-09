import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import play from "../Images/play.png";

//randomize the distructions
//make 20% of the shapes target per minute
// Define the Main component
export default function Main(props) {
  const [start, setStart] = useState(false);
  const [url, setUrl] = useState(null);
  const [qtrobot, setQtrobot] = useState({});
  const [timerWidth, setTimerWidth] = useState(400);
  const [randomShape, setRandomShape] = useState("");
  const distructions = useRef(["yawn", "sneeze", "sing"])
  const [randomElt, setRandomElt] = useState("");
  
  // Function to connect to QTrobot using the provided URL
  useEffect(() => {
    var _url = prompt(
      "Please enter QTrobot rosbridge url:",
      "ws://192.168.100.2:9091"
    );
    _url = _url == null ? "ws://127.0.0.1:9091" : _url;
    if (url !== _url) {
      setUrl(_url);
    }
    console.log("connecting to QTrobot (please wait...)");
  }, []);
    // Function to create the QTrobot instance
  useEffect(() => {
    //DO NOT Remove Or Move the following comment
    // eslint-disable-next-line no-undef
    setQtrobot(() => new QTrobot({
      url: url,
      connection: function () {
        console.log("connected to " + url);
      },
      error: function (error) {
        console.log(error);
      },
      close: function () {
        console.log("disconnected.");
      },
    })
    );
  }, [url]);
  // Function to update the random element state when the trials data changes
  useEffect(() => {
    if (props.trials) {
    setRandomElt(props.trials)
    if(props.trials !== "")  setRandomShape( <div className={props.trials[props.trial].shape} style={(props.trials[props.trial].shape === "Triangle") ?
    { "border-bottom": `150px solid ${props.trials[props.trial].color}` }
    : { "background-color": props.trials[props.trial].color }}>
  </div>)}
  },[props.trials])
  useEffect(() => {
  
    if (start) {
      window.webgazer.removeMouseEventListeners();
      qtrobot.set_volume(20); //change to the desired volume
      //checker function
      const interval = setInterval(() => {
        //checks if the users "response" is correct or incorrect
        if (randomElt[props.trial-1].shape === randomElt[props.trial-1].prevShape || randomElt[props.trial-1].color === randomElt[props.trial-1].prevColor){
          props.handleWrong("Incorrect Pass")
          } else {
          props.handleWrong("Correct Pass");
          setTimerWidth(400);
          }
        setRandomShape(() => RandomShape());
        props.ResponseTime();        
      }, 1000);
      const visual_interval = setInterval(() => {
        setTimerWidth((prev) => prev - 4);
      }, 10); //creates a visual timer....might not be working correctly if webgazer is running
      return () => {
        clearInterval(interval);
        clearInterval(visual_interval);
        setTimerWidth(400);
      };
    }
  }, [props.trial]);
  useEffect(() => {
    if (start) {
      const oneMinInterval = setInterval(() => {
        //Sends a random distruction between 30 - 45 seconds after the start of the experiment or 
        //the last distruction.
        const randomInterval = setRandomInterval(randomDistruction, 30000, 45000);
        return () => {
          randomInterval.clear();
        };
      }, 60000); //one distruction per minute

      return () => {
        clearInterval(oneMinInterval)
      }
    }
  }, [start, distructions]);
  useEffect(() => {
    //Random interval
    if (start) {
      const startingRandomInterval = setRandomInterval(randomDistruction, 30000, 45000);
      return () => {
        startingRandomInterval.clear();
      }; 
    }
  }, [start]);
  //handle key down event
  useEffect (() => {
    document.addEventListener('keydown', handleKeyDown, true);

    return () => document.removeEventListener('keydown', handleKeyDown,true)
  }, [start, props.trial]); 
  //random interval function. Takes minimum and maximum delay parameters 
  //to create a random interval in the specified range.
  const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
    let timeout;
    const timeoutFunction = () => {
      intervalFunction();
    };
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    timeout = setTimeout(timeoutFunction, delay);
    return {
      clear() { clearTimeout(timeout) },
    };
  };
  //Random distruction function 

  function randomDistruction() {
    let distruction = distructions.current[Math.floor(Math.random() * (distructions.current.length - 1 - 0 + 1))];
    distructions.current.splice(distructions.current.indexOf(distruction),1)
    switch (distruction) {
      case "yawn":
        qtrobot.show_emotion('QT/yawn', qtrobot.play_gesture('QT/yawn'));
        logDistruction("yawn")
        break;
      case "sneeze":
        qtrobot.show_emotion('QT/with_a_cold_sneezing', qtrobot.play_audio('sneeze'));
        logDistruction("sneeze")
        break;
      case "sing":
        qtrobot.talk_audio('QT/5LittleBunnies');
        logDistruction("sing")
        break;
      default:
        qtrobot.show_emotion('yawn')
    }
  }

  //logs the time and the trial at which a distruction occured
  function logDistruction(type){
    props.handleDistructionData((prev) => ({
      ...prev,
      [type] : `${Date.now()} (trial: ${props.trial})`
    }))
  }

  //checks if the user's click response is correct or not.
  function handleClick() {
    props.ResponseTime();
    (randomElt[props.trial-1].shape === randomElt[props.trial-1].prevShape || randomElt[props.trial-1].color === randomElt[props.trial-1].prevColor
    ) ? props.handleWrong("Correct Click")
      : props.handleWrong("Incorrect Click");
    setRandomShape(() => RandomShape());
    setTimerWidth(400);
  }

  // handles enter and space key down events
  function handleKeyDown(e) {
    
    if (start){
    e.preventDefault();
    if (e.key === "Enter" || e.key === " "){
      
      handleClick();
      setTimerWidth(400);
    }}
    else {
      e.preventDefault();
      if (e.key === "Enter" || e.key === " ") handleStart();
      setTimerWidth(400);
    }
  }

  //returns a random shape JSX element
  function RandomShape() {
    return <div className={randomElt[props.trial].shape} style={(randomElt[props.trial].shape === "Triangle") ?
      { "border-bottom": `150px solid ${randomElt[props.trial].color}` }
      : { "background-color": randomElt[props.trial].color }}>
    </div>;
  }
  
  //handles the start of the experiment
  function handleStart() {
    setStart(true);
    props.handleDistructionData((prev) => ({
      ...prev,
      "startTime": Date.now()
    }));
    props.setTime(Date.now());
    props.ResponseTime();
  }
  return (props.webgazerIsSet && randomElt !== "" ? (
    !start ? (
    <div id="main" className="main">
      <img className="play-btn" onClick={() => handleStart()} src={play} alt="play"/>
    </div>
  ) : (
    <div id="main" className="main">
      <div className="prompt">
        {randomShape}
        {/* {props.numbers && <p>{RandomSymbol()}</p>}
          {props.shapes && RandomShape()} */}
      </div>
      <div className="visual-time" style={{ width: `${timerWidth}px` }}></div>
      <div className="response" onClick={() => handleClick()}>
        <span className="checkmark">
          {/* <div className="checkmark_circle"></div> */}
          <div className="checkmark_stem"></div>
          <div className="checkmark_kick"></div>
        </span>
      </div>
    </div>
  )):<div className="main"><div className="loader"></div></div>)
}