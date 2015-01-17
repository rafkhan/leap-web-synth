"use strict";

var freq;

document.addEventListener('DOMContentLoaded', function(event) { 
  var CtxFn = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new CtxFn();

  freq = 0;

  var oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency = freq;

  var gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();


  var freqLow = 20;
  var freqHigh = 5000;
  var freqDelta = freqHigh - freqLow;

  var palmRightXLow = 0;
  var palmRightXHigh = 150;
  var palmRightXDelta = palmRightXHigh - palmRightXLow;

  var palmRightYLow = 75;
  var palmRightYHigh = 350;
  var palmRightYDelta = palmRightYHigh - palmRightYLow;

  Leap.loop(function (frame) {

    var hands = {};


    if(!frame.hands[0]) { return; }
    hands[frame.hands[0].type] = frame.hands[0];

    if(frame.hands[1]) {
      hands[frame.hands[1].type] = frame.hands[1];
    }


    if(hands.right) {
      var rightPalmPos = hands.right.palmPosition;
      var rightPalmX = rightPalmPos[0];
      
      var xFromZero = rightPalmX + palmRightXLow;
      var xPercentage = xFromZero / palmRightXDelta;

      var outputFreq = (freqDelta * xPercentage) + freqLow;

      var rightPalmY = rightPalmPos[1];

      if(rightPalmY >= 75) {
        var yPercentage = (rightPalmY - palmRightYLow) / palmRightYDelta;
        gainNode.gain.value = 1 - yPercentage;
      } else {
        gainNode.gain.value = 1;
      }


      oscillator.frequency.setValueAtTime(outputFreq, audioCtx.currentTime);
    }

    /*
    //ensure two handed
    if(frame.hands[1]) {
      var rightPalmPos = frame.hands[1].palmPosition;
      var rightPalmX = rightPalmPos[0];
      console.log('hand1 ', rightPalmPos);
    }

    var leftPalmPos = frame.hands[0].palmPosition;
    var leftPalmX = leftPalmPos[0];


    console.log('hand0 ', leftPalmPos);

    */
  
  });
});
