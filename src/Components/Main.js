import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import play from "../Images/play.png";
// import QTrobot from './js/qtrobot-1.0.min.js';

//randomize the distructions
export default function Main(props) {
  const [start, setStart] = useState(false);
  const [url, setUrl] = useState(null);
  const [qtrobot, setQtrobot] = useState({});
  const [timerWidth, setTimerWidth] = useState(400)
  const [randomShape, setRandomShape] = useState(
    <div className={"Circle"}></div>
  );
  const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"];
  const target = "Triangle";
  const distructions = ["yawn","sneeze","sing"]
  const randomElt = useRef("");
  function RandomSymbol() {
    var symbols = ["1", "2", "3", "4"];
    var rand_num = Math.floor(Math.random() * (symbols.length - 1 - 0 + 1)) + 0;
    return symbols[rand_num];
  }

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
  useEffect(() => {
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
  useEffect(() => {
    if (start) {
      qtrobot.set_volume(20);
      const interval = setInterval(() => {
        setRandomShape(() => RandomShape());
        props.ResponseTime();
        // props.handleChange();
        target === randomElt
          ? props.handleWrong(true)
          : props.handleWrong(false);
        setTimerWidth(400);
      }, 1000);
      const visual_interval = setInterval(() => {
        setTimerWidth((prev) => prev - 4);
      }, 10);
      return () => {
        clearInterval(interval);
        clearInterval(visual_interval);
      };
    }
  }, [props.responseTime]);
  useEffect(() => {
    if(start){
    const interval = setRandomInterval(randomDistruction, 30000, 45000);
    return () => {
      interval.clear();
    };
  }
  }, [start]);
  const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
    let timeout;
  
    const runInterval = () => {
      const timeoutFunction = () => {
        intervalFunction();
        runInterval();
      };
  
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  
      timeout = setTimeout(timeoutFunction, delay);
    };
  
    runInterval();
  
    return {
      clear() { clearTimeout(timeout) },
    };
  };
  function randomDistruction(){
    let distruction = distructions[Math.floor(Math.random() * (distructions.length - 1 - 0 + 1))];
    qtrobot.call_service('/qt_robot/audio/stop')
    switch (distruction) {
      case "yawn":
        qtrobot.show_emotion('QT/yawn');
        break;
      case "sneeze":
        qtrobot.show_emotion('QT/with_a_cold_sneezing',qtrobot.play_audio('sneeze'));
        break;
      case "sing":
        qtrobot.play_audio('QT/5LittleBunnies')
        break;
      default:
        qtrobot.show_emotion('yawn')
    }
  }
  function handleClick() {
    // qtrobot.play_audio('sneeze');
    //qtrobot.show_emotion('QT/with_a_cold_sneezing',qtrobot.play_audio('sneeze'));
    props.ResponseTime();
    target === randomElt.current
      ? props.handleWrong(false)
      : props.handleWrong(true);
    setRandomShape(() => RandomShape());
    setTimerWidth(400);
  }
  function RandomShape() {
    randomElt.current =
      shapes[Math.floor(Math.random() * (shapes.length - 1 - 0 + 1))];
    return <div className={randomElt.current}></div>;
  }
  function handleStart() {
    // console.log("dhdjkhd")
    setStart(true);
    props.setTime(Date.now());
    props.ResponseTime();
  }
  return !start ? (
    <img className="play-btn" onClick={() => handleStart()} src={play} />
  ) : (
    <div className="main">
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
  );
}