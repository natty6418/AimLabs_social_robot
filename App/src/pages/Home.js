import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Define the Home component
export default function Home(props) {
    // State variable to store the experiment details
    const [experimentDetails, setExperimentDetails] = useState(null);

    // React Router's navigate function for navigation
    const navigate = useNavigate();

    // useEffect hook is used to run some code when the component is mounted (first rendered)
    useEffect(() => {
        // When the component is mounted, call the start_page function
        start_page();
    }, []);

    // Function to show the initial part of the Home page with the experiment number input
    function start_page(event = null) {
        if (event)
            event.preventDefault();

        // Update the experimentDetails state with JSX representing the experiment number input form
        setExperimentDetails(
            <div className="experimentInfo">
                <form className="experimentNum-label" onSubmit={handleExperimentNumSubmit}>
                    <label><p>Experiment Number</p></label>
                    <input
                        placeholder="#"
                        className="input-field"
                        type="text"
                        onChange={(e) => props.setExperimentNumber(e.target.value)}
                    />
                    <button
                        className="next-btn"
                        type="submit"
                    >
                        Next
                    </button>
                </form>
            </div>
        );
    }

    // Function to handle the submission of the session number input form
    function handleSessionNumSubmit(event) {
        if (event) event.preventDefault();

        // Update the experimentDetails state with JSX representing the target type selection buttons
        setExperimentDetails(
            <div className="experimentInfo">
                <button className="shapes-btn" onClick={() => {
                    props.setTargetType("shapes");
                    handleTargetSelection();
                }}>
                    Shapes
                </button>
                <button className="colors-btn" onClick={() => {
                    props.setTargetType("colors");
                    handleTargetSelection();
                }}>
                    Colors
                </button>
                <button
                    className="back-btn"
                    onClick={handleExperimentNumSubmit}
                >
                    Back
                </button>
            </div>
        );
    }

    // Function to handle the selection of target type (Shapes or Colors)
    function handleTargetSelection() {
        // Update the experimentDetails state with JSX representing the next page buttons
        setExperimentDetails(
            <div className="experimentInfo">
                <button className="shapes-btn" onClick={() => {
                    navigate('/calibration');
                }}>
                    Calibration
                </button>
                <button className="colors-btn" onClick={() => {
                    navigate('/experiment');
                }}>
                    Experiment
                </button>
                <button
                    className="back-btn"
                    onClick={handleSessionNumSubmit}
                >
                    Back
                </button>
            </div>
        );
    }

    // Function to handle the submission of the experiment number input form
    function handleExperimentNumSubmit(event) {
        event.preventDefault();

        // Update the experimentDetails state with JSX representing the session number input form
        setExperimentDetails(
            <div className="experimentInfo">
                <form onSubmit={handleSessionNumSubmit}>
                    <label className="experimentNum-label"><p>Session</p></label>
                    <input
                        placeholder="#"
                        className="input-field"
                        type="text"
                        onChange={(e) => props.setSessionNumber(e.target.value)}
                    />
                    <button
                        className="next-btn"
                        type="submit"
                    >
                        Next
                    </button>
                    <button
                        className="back-btn"
                        onClick={(event) => start_page(event)}
                    >
                        Back
                    </button>
                </form>
            </div>
        );
    }

    // Render the JSX representing the Home component
    return (
        <div>
            {/* Navbar */}
            {<div className="navBar">
                <h3>Aim Labs</h3>
                <h3>CPT Experiment</h3>
            </div>}

            {/* Render the experimentDetails state */}
            {experimentDetails}
        </div>
    );
}
