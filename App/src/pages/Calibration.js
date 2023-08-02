// Import necessary modules and styles
import React, { useEffect, useRef, useState } from 'react';
import "bootstrap/dist/js/bootstrap.min.js";
import "sweetalert/dist/sweetalert.min.js";
import { startWebgazer, setupCanvas } from '../utils/webgazerUtils';
import { handleCalibrationPointClick, handleRestart } from '../utils/calibrationUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import calibration_instruction from './Images/calibration.png';
import { useNavigate } from 'react-router-dom';

// Define the Calibration component
function Calibration() {
  const canvasRef = useRef(null);
  const webgazer = window.webgazer;
  const bootstrap = window.bootstrap;
  const navigate = useNavigate();
  window.saveDataAcrossSessions = true;

  // State variables to manage calibration points and currently calibrating point
  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [pointCalibrate, setPointCalibrate] = useState(0);

  // Ref for the help modal
  const helpModal = useRef(null);

  // useEffect hook is used to run some code when the component is mounted (first rendered)
  useEffect(() => {
    const canvas = canvasRef.current;
    helpModalShow();
    startWebgazer();
    webgazer.showPredictionPoints(true);
    setupCanvas(canvas);
    window.addEventListener('resize', resize, false);
    return () => {
      if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
      webgazer.end();
    };
  }, []);

  // Function to handle updating the calibration points state
  function handleCalibrationPoints(updatedPoints) {
    setCalibrationPoints((prev) => ({
      ...prev,
      ...updatedPoints,
    }));
  }

  // Function to handle updating the currently calibrating point
  function handlePointCaliberate(value) {
    setPointCalibrate(value);
  }

  // Function to handle button click (calibration point selection)
  const handleButtonClick = (event) => {
    const buttonId = event.target.id;
    handleCalibrationPointClick(
      buttonId,
      calibrationPoints,
      handleCalibrationPoints,
      pointCalibrate,
      handlePointCaliberate,
      canvasRef.current,
      navigate
    );
  };

  // Function to show the help modal
  function helpModalShow() {
    if (!helpModal.current) {
      helpModal.current = new bootstrap.Modal(document.getElementById('helpModal'));
    }
    helpModal.current.show();
  }

  // Function to handle canvas resize
  function resize() {
    const canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Render the JSX representing the Calibration component
  return (
    <>
    <canvas ref={canvasRef} id='plotting_canvas' width={500} height={500} style={{ cursor: "crosshair" }}></canvas>
    <div className="calibrationDiv">
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
