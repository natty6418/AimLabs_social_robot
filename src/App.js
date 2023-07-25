import React from "react";
import { Route, Routes, Link } from "react-router-dom"
import Calibration from "./Calibration";
import Experiment from "./Experiment";
export default function App() {
  return(
    <>
      <Routes>
        <Route path="/calibration" element={<Calibration />} />
        <Route path="/experiment/*" element={<Experiment />} />
    </Routes>
    </> 
  )
}
