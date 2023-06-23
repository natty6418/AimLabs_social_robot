import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import play from "../Images/play.png";
// import QTrobot from './js/qtrobot-1.0.min.js';

//randomize the distructions
//make 20% of the shapes target per minute
export default function Main(props) {
  const [start, setStart] = useState(false);
  const [url, setUrl] = useState(null);
  const [qtrobot, setQtrobot] = useState({});
  const [timerWidth, setTimerWidth] = useState(400)
  const [randomShape, setRandomShape] = useState("");
  const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"];
  const colors = ["#C2DEDC", "#ECE5C7", "#B3C890", "#116A7B"]
  //const colors = ["green", "yellow", "red", "blue"]

  const distructions = useRef(["yawn", "sneeze", "sing"])
  const randomElt = useRef({"shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor":""});
  const count = useRef(0);
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
      //checket function
      const interval = setInterval(() => {
        if (randomElt.current.shape === randomElt.current.prevShape || randomElt.current.color === randomElt.current.prevColor){
          props.handleWrong("Incorrect Pass")
          } else {
          props.handleWrong("Correct Pass");
          setTimerWidth(400);
          }
        setRandomShape(() => RandomShape());
        props.ResponseTime();        
      }, 1500);
      const visual_interval = setInterval(() => {
        setTimerWidth((prev) => prev - 4);
      }, 10);
      return () => {
        clearInterval(interval);
        clearInterval(visual_interval);
        setTimerWidth(400);
      };
    } else {
      setRandomShape(() => RandomShape())
    }
  }, [props.trial]);
  useEffect(() => {
    //One minute interval
    if(start) {
      const oneMinInterval = setInterval(() => {
      const randomInterval = setRandomInterval(randomDistruction, 3000, 8000);
      return () => {
        randomInterval.clear();
      };
    }, 10000);
    return () => {
      clearInterval(oneMinInterval)
    }}
  },[start, distructions])
  useEffect(() => {
    //Random interval
    if (start) {
      const startingRandomInterval = setRandomInterval(randomDistruction, 3000, 8000);
      return () => {
        startingRandomInterval.clear();
      }; 
    }
  }, [start]);
  //handle key down
  useEffect (() => {
    document.addEventListener('keydown', handleKeyDown, true);

    return () => document.removeEventListener('keydown', handleKeyDown,true)
  }, [start, props.trial]); 
  //random interval function
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
    distructions.current = distructions.current.splice(distructions.current.indexOf(distruction),1)
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
  function logDistruction(type){
    props.handleDistructionData((prev) => ({
      ...prev,
      [type] : Date.now() - prev.startTime
    }))
  }
  function handleClick() {
    // console.log(randomElt)
    // qtrobot.play_audio('sneeze');
    //qtrobot.show_emotion('QT/with_a_cold_sneezing',qtrobot.play_audio('sneeze'));
    props.ResponseTime();
    (randomElt.current.shape === randomElt.current.prevShape || randomElt.current.color === randomElt.current.prevColor
    ) ? props.handleWrong("Correct Click")
      : props.handleWrong("Incorrect Click");
    setRandomShape(() => RandomShape());
    setTimerWidth(400);
  }
  function handleKeyDown(e) {
    console.log(e.key)
    console.log(start)
    if (start){
    e.preventDefault();
    console.log(e);
    if (e.key === "Enter" || e.key === " "){
      
      handleClick();
      setTimerWidth(400);
    }}
    else {
      e.preventDefault();
      handleStart();
      setTimerWidth(400);
    }
  }
  function RandomShape() {
    let pTarget = 0.2
    let rand = Math.random()
    let sVc = Math.random()
    if (!start) {
    randomElt.current = ({
      "shape": shapes[Math.floor(Math.random() * (shapes.length))],
      "color": colors[Math.floor(Math.random() * (colors.length))],
      "prevShape": randomElt.current.shape,
      "prevColor": randomElt.current.color
    })
    if (rand <= pTarget){
      count.current = count.current+1
      console.log(count.current)
      randomElt.current = ({
        ...randomElt.current,
        "nextShape" : sVc < 0.5 ? randomElt.current.shape : shapes[Math.floor(Math.random() * (shapes.length))],
        "nextColor" : sVc >= 0.5 ? randomElt.current.color : colors[Math.floor(Math.random() * (colors.length))]
      })
    } else{
      let newShape = shapes[Math.floor(Math.random()*(shapes.length))]
      let newColor = colors[Math.floor(Math.random() * (colors.length))]
      while (newShape === randomElt.current.shape || newColor === randomElt.current.color){
        newShape = shapes[Math.floor(Math.random()*(shapes.length))]
        newColor = colors[Math.floor(Math.random() * (colors.length))]
      }
      randomElt.current = ({
        ...randomElt.current,
        "nextShape" : newShape,
        "nextColor" : newColor
      })
    }
  } else {
      randomElt.current = ({
        "shape": randomElt.current.nextShape,
        "color": randomElt.current.nextColor,
        "prevShape": randomElt.current.shape,
        "prevColor": randomElt.current.color
      })
      if (rand <= pTarget){
        count.current = count.current+1
        console.log(count.current)
        randomElt.current = ({
          ...randomElt.current,
          "nextShape" : sVc < 0.5 ? randomElt.current.shape : shapes[Math.floor(Math.random() * (shapes.length))],
          "nextColor" : sVc >= 0.5 ? randomElt.current.color : colors[Math.floor(Math.random() * (colors.length))]
        })
      } else{
        let newShape = shapes[Math.floor(Math.random()*(shapes.length))]
        let newColor = colors[Math.floor(Math.random() * (colors.length))]
        while (newShape === randomElt.current.shape || newColor === randomElt.current.color){
          newShape = shapes[Math.floor(Math.random()*(shapes.length))]
          newColor = colors[Math.floor(Math.random() * (colors.length))]
        }
        randomElt.current = ({
          ...randomElt.current,
          "nextShape" : newShape,
          "nextColor" : newColor
        })
      }
    }
    return <div className={randomElt.current.shape} style={(randomElt.current.shape === "Triangle") ?
      { "border-bottom": `150px solid ${randomElt.current.color}` }
      : { "background-color": randomElt.current.color }}>
    </div>;
  }
  
  function handleStart() {
    setStart(true);
    props.handleDistructionData((prev) => ({
      ...prev,
      "startTime": Date.now()
    }));
    props.setTime(Date.now());
    props.ResponseTime();
  }
  return (!start ? (
    <div className="main">
      <img className="play-btn" onClick={() => handleStart()} src={play} alt="play"/>
    </div>
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
  ))
}