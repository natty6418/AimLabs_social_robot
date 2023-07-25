import React from 'react';
export default function Header(props) {
    // console.log("here")
    return (
        <div className = "navBar">
          <h3>Aim Labs</h3>
          <h3>CPT Experiment</h3>
          <h3>Trial {props.trialNum}</h3>
      </div>
    )
  }