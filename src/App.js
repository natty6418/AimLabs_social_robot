import React from 'react';
import {useState} from 'react'
import {useRef} from 'react'
import './App.css';
import Header from './Components/Header'
import Main from './Components/Main'
export default function App() {
  const [trial, setTrial] = React.useState(1)
  const [time, setTime] = useState(Date.now());
  const count = useRef(0);
  const [responseTime, setResponseTime] = useState({0:Date.now()});
  function ResponseTime(){
    const currentTime = Date.now();
    count.current +=1;
    setResponseTime(prevResponseTime => ({
      ...prevResponseTime, 
      [count.current]: Math.floor((currentTime - time))
    }));
    setTime(Date.now())
      }
  function incrementTrial() {
    setTrial(prev => prev+1)
  }
  function download() {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(responseTime)], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "sample.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return (
    <div className='app'>
      <Header trialNum={trial} />
      {trial < 50 ? <Main handleChange = {incrementTrial} responseTime = {responseTime} ResponseTime = {ResponseTime}/> : 
      (
        <div className='end-trail'>
          <h1>End of Trial.</h1>
          <button onClick={()=>download()}>Download</button>
        </div>
        )}
    </div>
  )
};