const webgazer = window.webgazer;
export const startWebgazer =  async () =>{
    await webgazer
      .setRegression('ridge')
      .setGazeListener(function(data, clock) {
        //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
        //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
      })
      .saveDataAcrossSessions(true)
      .begin();
      webgazer.showVideoPreview(true) /* shows all video previews */
          .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
          .applyKalmanFilter(true);
  };
export const setupCanvas = (canvas) => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
  };