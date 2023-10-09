
## Overview

This repository contains a React-based CPT experiment application that collects data on users' gaze and response time during a series of trials. The experiment involves identifying specific shapes and colors displayed on the screen. The application utilizes the webgazer.js library for eye tracking and provides a visual representation of gaze data through a heatmap.js component. It also interacts with QTrobot via QTrobot's ROS API to introduce random distructions during the trials.

## Prerequisites

- Node.js (version 12 or later) and npm (Node Package Manager) must be installed on your system.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository to your local machine using the following command:

   ```
   git clone https://github.com/natty6418/AimLabs_social_robot.git
   ```

2. Start the API server:

   Before running the experiment, make sure to start the API server. The API provides randomized visual elements for the experiment. To start the API, navigate to the `api` directory and run:

   ```
   cd api
   npm install
   npm start
   ```

   The API will be accessible at `http://localhost:9000`.

3. Change into the App directory:

```
cd ..
cd App
```

4. Install the required dependencies:

```
npm install
```

5. Start the development server:

```
npm start
```

6. The application will be running on `http://localhost:3000`. Open this URL in your web browser.

7. Open a terminal on QTPC and Launch the `rosbridge_websocket_qtpc.launch`:
```
roslaunch ~/rosbridge_websocket_qtpc.launch
```

## Components

### 1. `App.js`

The `App` component serves as the main entry point of the application. It defines the overall layout of the experiment, including the header and main content area.

      ## 1. `Experiment.js`

      The `Experiment` component is responsible for managing the experiment trials, recording user responses, and displaying the heatmap of gaze data. It uses several state variables to keep track of the trial number, response time, random elements, distruction data, and webgazer setup.

      Functionalities:
      1. check if the experiment trials are completed
      2. fetch data from the API on component mount
      3. Initialize and remove webgazer after calibration, and set up the heatmap
      4. fetch data from the API
      5. generate and display the heatmap
      6. record the response time of each trial
      7. download experimental data
      8. Handles incorrect responses from the experimentee

      Subcomponents:
         ## 1. `Header.js`

         The `Header` component represents the header section of the application, displaying experiment details such as the Experiment ID, Session number, and Trial number. It also includes a "Home" button that allows users to navigate back to the home page.


         ## 2. `Main.js`

         The `Main` component handles the main part of the experiment, where the trials are conducted. It includes functions to start the trial, handle user responses, and introduce random distructions using QTrobot.
         This is the component which is like the engine for the experiment. This component contains several effect hooks required to run the experiment. 
         Functionalities:
         1. Creates a QTrobot and connects to robot's JavaScript API 
         2. Change the displayed shape when the trial number is incremented.
         3. You can change the robot's speaker volume here.
         '''qtrobot.set_volume(20)'''
         4. Check if previous color/shape is the same as the current one to judge the users response. This is done on a one second interval to check the shapes where the user doesn't respond to and also every time the user responds to a target.
         5. The small bar (visual timer) which shows the remaining time is also set here. If you decide to change the width, don't forget to change the interval in which the width is decremented with respect to time.
         '''const visual_interval = setInterval(() => {
            setTimerWidth((prev) => prev - 4);
            }, 10);'''
         6. The random 30-45 second interval which sends a distruction from the robot is defined here. If you decide to change this interval, change the parameters at both instances of the function. They are located in consecutive useEffect hooks in the `Main.js` component.
         7. The user can respond using either the keyboard or the mouse. Both event listenters (keydown and mouseclick) are defined here. 
         8. Random distruction fucntion is defined here. Read through the qtrobot JavaScript api documentation and make modifications to this area. You can send predefined or custom distructions here. Distructions can be emotions, gestures or audio responses.
         9. Function to log the sent distructions to the data being collected is defined here.
         10. Function to display random shape is defined here.
         11. Function to handle the start of the experiment is defined here. Various states must be initialized at the start of the experiment.
   ## 2. `Calibration.js`

      The `Calibration` component in this project is responsible for calibrating the eye-tracking system before starting the actual experiment. When users access the calibration page, the application displays calibration points on the screen, and users are required to focus their gaze on each point to calibrate the eye-tracking system accurately. The calibration points are represented as buttons, and when clicked, the eye tracker records the gaze position for each point.

      **IMPORTANT: Once calibrated the app can be made to use the old calibration data for the experiment. You don't have to recalibrate it for every session.**
      
      ## Eye Tracking and Data Collection

      The eye tracking functionality is implemented using the `webgazer.js` library. The gaze data is stored in the `heatmapData` array, which is then used to generate a heatmap using the `heatmap.js` library.
      Webgazer utility components can be located at `my-app\App\src\utils.
      
      This is where the different components that run the eyetracker are defined. Read more about webgazer here;
            * `https://webgazer.cs.brown.edu/`
            * `https://github.com/brownhci/WebGazer`
   ## 3. Home.js
   This is component where the home page is defined. The home page is where the emperiment details are defined and set. Experiment number and session number are set here.
## Data Collection

The `Experiment` component handles data collection during the experiment trials, including raw gaze data (coordinates) in addition to other metrics:

1. **Raw Gaze Data (Coordinates)**: During each trial, the application records the raw gaze data, which consists of the (x, y) coordinates of the user's gaze on the screen. The raw gaze data is collected continuously throughout the trial and is stored in the `heatmapData` array. The `eyeListener` function is responsible for capturing and updating the gaze data at regular intervals.

2. **Response Time**: The time taken by the user to respond to each trial stimulus is recorded as the time difference between the presentation of the stimulus and the user's response. It provides insights into how quickly users process and react to the presented stimuli.

3. **Random Elements**: The component fetches random elements for each trial, such as shapes and colors, from an external API. This data is stored in the `randomElt` state, and the user is required to identify the displayed element correctly.

4. **Destruction Data**: During the trials, random distructions are introduced using QTrobot, such as yawning, sneezing, or singing. The application records the timing of these distructions for each trial, allowing researchers to analyze the impact of interruptions on users' responses and gaze behavior.

All the recorded data, including raw gaze data, response time, random elements, and distruction data, is collected for each trial and can be analyzed after the experiment to gain insights into users' performance and behavior during the eye-tracking experiment. The raw gaze data is used to generate the heatmap, providing a visual representation of gaze concentration across all trials and helping to identify areas of interest and potential areas of improvement in the experimental design.

#### Distructions

The application interacts with QTrobot to introduce random distructions during the experiment trials. QTrobot is a social robot that can perform various gestures and expressions. The `Main` component includes functions to handle random distructions such as yawning, sneezing, and singing. These distructions are triggered at random intervals to introduce interruptions during the trials and simulate real-world distractions. These distructions are implemented using the `QTrobot` API.

#### Visual Stimuli

The `Main` component displays visual stimuli, such as shapes and colors, for participants to interact with during each trial. Participants are required to respond to the stimuli based on certain criteria.

### Heatmap

The `Heatmap` component generates a heatmap based on the raw gaze data collected during the experiment. The heatmap is generated using the `heatmap.js` library, which visualizes participants' gaze patterns as they interact with the visual task.

## Important Notes

- Before running the experiment, make sure to start the API server by following the instructions in the API section above.
- The experiment requires access to the Webgazer API for data collection, so ensure that you have a compatible browser and a working webcam.

## API

The API server is implemented using Node.js and Express.js. It provides randomized visual elements for the experiment. There are three endpoints available:

1. `/`: Returns a randomized array of visual elements for the experiment.
2. `/shapes`: Returns a randomized array of visual elements with varying shapes for the experiment.
3. `/colors`: Returns a randomized array of visual elements with varying colors for the experiment.

The API uses the following dependencies:

- `express`: A web framework for Node.js used to build the API endpoints.
- `cors`: A middleware for enabling CORS (Cross-Origin Resource Sharing) to allow requests from different origins.
- `nodemon`: A development tool that automatically restarts the server when code changes are detected.

Please make sure to start the API server before running the React experiment to ensure that the experiment can fetch the necessary data from the API.


## Author

- Natty Metekie (nm3833@nyu.edu)