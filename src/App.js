import React from 'react';
import './App.css';
import Header from './Components/Header'
import Main from './Components/Main'
export default function App() {
  const [trial, setTrial] = React.useState(1)
  function incrementTrial() {
    setTrial(prev => prev+1)
  }
  return (
    <div>
      <Header trialNum={trial} />
      <Main handleChange = {incrementTrial}/>
    </div>
    
  )
};