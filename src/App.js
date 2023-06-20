import React from 'react';
import {useState} from 'react'
import {useRef} from 'react'
import './App.css';
import Header from './Components/Header'
import Main from './Components/Main'
export default function App() {
  const [trial, setTrial] = React.useState(0)
  const [time, setTime] = useState(Date.now());
  const [wrong, setWrong] = useState(false)
  const [responseTime, setResponseTime] = useState({0: {'Time':Date.now(), 'Wrong': false}});
  const experiment_no = 0
  function ResponseTime(){
    // console.log("ddddd")
    const currentTime = Date.now();
    setTrial(prev => prev+1);
    setResponseTime(prevResponseTime => ({
      ...prevResponseTime, 
      [trial]: {
      'Time': Math.floor((currentTime - time)),
      'Wrong': wrong
      }
    }));
    setTime(Date.now());
      }
  // function incrementTrial() {
  //   setTrial(prev => prev+1)
  // }
  function download() {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(responseTime)], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `experiment ${experiment_no}`;
    link.click();
    URL.revokeObjectURL(link.href);
    
  }
  function handleWrong(w){
    setWrong(w)
  }

  return (
    <div className='app'>
      <Header trialNum={trial} />
      {trial < 50 ? <Main setTime={setTime} responseTime = {responseTime} ResponseTime = {ResponseTime} handleWrong = {handleWrong}/> : 
      (
        <div className='end-trail'>
          <h1>End of Trial.</h1>
          <button onClick={()=>download()}>Download</button>
        </div>
        )}
    </div>
  )
};