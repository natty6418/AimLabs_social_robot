import React from 'react';
import {useState} from 'react';
import { useEffect } from 'react';
import {useRef} from 'react'
// import QTrobot from './js/qtrobot-1.0.min.js';


export default function Main(props){
  const [time, setTime] = useState(Date.now());
  const [responseTime, setResponseTime] = useState({0:Date.now()});
  const [url, setUrl] = useState(null)
  const[qtrobot, setQtrobot] = useState({})
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
  useEffect(
    () => {
      var _url = prompt("Please enter QTrobot rosbridge url:", "ws://192.168.100.2:9091");
      _url = (_url == null) ? 'ws://127.0.0.1:9091' : _url;
      if (url !== _url){
        setUrl(_url)
      }
      console.log("connecting to QTrobot (please wait...)");
      
    }, []
  )
  useEffect(()=>{
    // eslint-disable-next-line no-undef
    setQtrobot(()=> new QTrobot({
      url : url,
      connection: function(){            
          console.log("connected to " + url);        
      },
      error: function(error){
          console.log(error);
      },
      close: function(){
          console.log("disconnected.");
      }
    }))
  }, [url])
  useEffect(() => {
      const interval = setInterval(() => {
      ResponseTime();
      props.handleChange();
    }, 1000);
    return () => clearInterval(interval);
  },[responseTime])
  function handleClick() {
    qtrobot.show_emotion('QT/happy');
    ResponseTime();
    props.handleChange();
  }
  return (
    // 
    <div className="main">
      {/* <h1>hello!!!</h1> */}
      {/* {console.log("RENDERED")} */}
      {/* {console.log(responseTime)} */}
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