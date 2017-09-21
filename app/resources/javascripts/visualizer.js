const AudioVisualizer = require('audio-visualizer');

var Visualizer = (function(audioElement, parentElement) {
  var visualizer = new AudioVisualizer();

  _constructor();
  function _constructor() {

    // Create Web Audio API references and creates container svg element for visualizer inserted inside parentElement
    visualizer.containerHeight = 2500;
    visualizer.containerWidth = 2750;
    visualizer.create(audioElement, parentElement);

    // Refer to Web Audio API analyser for option's reference
    visualizer.analyserOptions({
      fftSize: 2048,
      minDecibels: -87,
      maxDecibels: -3,
      smoothingTimeConstant: 0.83
    });

    // CSS styling for visualizer container
    visualizer.containerStyles({
      position: 'absolute',
      top: visualizer.containerHeight * -1,
      left: 0,
      'z-index': 10000,
      'pointer-events': 'none'
    });

    // Options for visualization bars
    // Available colors: purple, blue, green, red, orange, gray
    visualizer.options({
      color: 'orange',
      opacity: 0.7,
      interval: 30,
      frequencyDataDivide: 9,
      barPadding: 1.7
    });


    visualizer.initialize();
  }

  function start() {
    visualizer.start();
  }

  return{
    start: start
  }



})

module.exports = Visualizer;
