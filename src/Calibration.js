import React, { useEffect, useRef, useState, useCallback  } from 'react';
import "bootstrap/dist/js/bootstrap.min.js";
import "sweetalert/dist/sweetalert.min.js"
import { startWebgazer, setupCanvas } from './utils/webgazerUtils';
import { handleCalibrationPointClick, handleRestart } from './utils/calibrationUtils';
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import calibration_instruction from './Images/calibration.png'
import { useNavigate } from 'react-router-dom';
function Calibration() {
  const webcamRef = useRef()
  const canvasRef = useRef(null)
  const webgazer = window.webgazer;
  const bootstrap = window.bootstrap;
  const navigate = useNavigate();
  // let canvas = null;
  window.saveDataAcrossSessions = true;
  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [pointCalibrate, setPointCalibrate] = useState(0);
  // const [helpModal, setHelpModal] = useState();
  const helpModal = useRef(null)
  // const [canvas, setCanvas] = useState(null)
  // useEffect(()=>{
  //   webgazer.setGazeListener(function(data, elapsedTime) {
  //   if (data == null) {
  //     return;
  //   }
  //   var xprediction = data.x; //these x coordinates are relative to the viewport
  //   var yprediction = data.y; //these y coordinates are relative to the viewport
  //   console.log(elapsedTime); //elapsed time is based on time since begin was called
  // }).begin();
  // }, [])
  useEffect(()=> {
    const canvas = canvasRef.current;
    helpModalShow();
    startWebgazer();
    setupCanvas(canvas);
    window.addEventListener('resize', resize, false);
    return () => {
      if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
      webgazer.end();
    }
  }, []);
  useEffect(()=>{
    console.log("pointCalibrate useEffect: ",pointCalibrate)
  }, [pointCalibrate])
  function handleCalibrationPoints(updatedPoints) { 
      
      setCalibrationPoints((prev)=> ({
        ...prev,
        ...updatedPoints
      }))
    }
  function handlePointCaliberate(value) {
      console.log("value: ", value)
      console.log("pointCaliberate: ", pointCalibrate)
      setPointCalibrate(value)
    }
  const handleButtonClick = ((event) => {
    const buttonId = event.target.id;
    console.log("pointCaliberate1: ", pointCalibrate);
    handleCalibrationPointClick(buttonId, calibrationPoints, handleCalibrationPoints, pointCalibrate, handlePointCaliberate, canvasRef.current, navigate);
  });
  // const handleButtonClick = (event) => {
    
  // };
  function helpModalShow() {
    if(!helpModal.current) {
        helpModal.current = (new bootstrap.Modal(document.getElementById('helpModal')))
    }
    helpModal.current.show();
}
  function resize() {
    // let canvas = canvasRef.current
    const canvas = canvasRef.current
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  return (
    // <div style={{"display":"flex", "flexDirection": "column"}}>
    //   <h1>Calibration Component</h1>
    //   <video ref={webcamRef} style={{ display: 'none' }} />
    //   <button onClick={() => webgazer.showVideoPreview(true)}>Show Webcam Preview</button>
    //   <button onClick={() => webgazer.showPredictionPoints(true)}>Show Gaze Prediction Points</button>
    // </div>
    <>
    <canvas ref={canvasRef} id='plotting_canvas' width={500} height={500} style={{ cursor: "crosshair" }}></canvas>
    <div className="calibrationDiv">
    {console.log("re-rendered")}
      <input type="button" className="Calibration" id="Pt1" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt2" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt3" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt4" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt5" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt6" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt7" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt8" onClick={handleButtonClick}/>
      <input type="button" className="Calibration" id="Pt9" onClick={handleButtonClick}/>
    </div>
  
    <div id="helpModal" className="modal fade" role="dialog">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <img src={calibration_instruction} width="100%" height="100%" alt="webgazer demo instructions" />
        </div>
        <div className="modal-footer">
          <button id="closeBtn" type="button" className="btn btn-default" data-bs-dismiss="modal">Close & load saved model</button>
          <button type="button" id="start_calibration" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=> handleRestart(setCalibrationPoints, handlePointCaliberate, canvasRef.current)}>Calibrate</button>
        </div>
        </div>
      </div>
    </div>
  
    </>
  );
}

export default Calibration;
