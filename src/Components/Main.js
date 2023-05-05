import React from 'react';
import {useState} from 'react';
import { useEffect } from 'react';
import {useRef} from 'react'

export default function Main(){
  const [time, setTime] = useState(Date.now());
  const [responseTime, setResponseTime] = useState({0:Date.now()});
  const count = useRef(0);
  function RandomSymbol(){
    var symbols = ["X", "0","+","-"];
    var rand_num = Math.floor(Math.random() * ((symbols.length-1) - 0 + 1)) + 0;
    return symbols[rand_num];
  }
  function ResponseTime(){
    const currentTime = Date.now();
    count.current +=1;
    setResponseTime(prevResponseTime => ({
      ...prevResponseTime, 
      [count.current]: Math.floor((currentTime - time))
    }));
    setTime(Date.now())
      }
  useEffect(() => {
      const interval = setInterval(() => {
      ResponseTime();
    }, 1000);
    return () => clearInterval(interval);
  },[responseTime])
  function handleClick() {
    ResponseTime();
  }

  return (
    // 
    <div className="main">
      {/* <h1>hello!!!</h1> */}
      {console.log("RENDERED")}
      <div className="prompt">
          <p>{RandomSymbol()}</p>
      </div>
      <div className="response" onClick={()=>handleClick()}>
          <span className="checkmark">
            {/* <div className="checkmark_circle"></div> */}
            <div className="checkmark_stem"></div>
            <div className="checkmark_kick"></div>
          </span>
      </div>
    </div>
  )
}