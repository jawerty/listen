/*
listen.js

MIT License
Copyright (c) 2013
 
author: Jared Wright
email: jawerty210@gmail.ocm

description: content_script code for listen extension
*/

//Usage for chrome optimization based on runtime || extension
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

//event variables
var mainSent = false;
var ended; 
var msgRemoved;
var msgAdded = false;
var pdfFinishMsg = false;
var stopAdded;
var port = chrome[runtimeOrExtension].connect({name: "listen_port"}); //port variable

port.postMessage({text:"startListen"});

port.onMessage.addListener(function(msg){
  //initiated the UI
  if (msg.text == 'listening...'){
    //so I can log messages in the background console
    //var bkg = chrome.extension.getBackgroundPage();
    main(ended);
  }

  //if the url is a pdf
  if (msg.pdf == true){

    if (msgAdded == false) {
      //for when it's still loading
      $("#play_div").append("<p id='message_4'>Long PDFs (books) may take a few minutes to load.</p>")
      msgAdded = true;
    }
    
    //UI stuff, I won't get into this since it's self explanatory
    $("#play").css("display", "none");
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "running");

  }

  if (msg.pdf == 'finished'){
    $("#message_4").remove(); //get rid of the loading screen
    if (pdfFinishMsg == false){
      $("#play_div").append("<p id='message_5'>PDF finished loading...</p>");
      pdfFinishMsg = true;
    }
    
    if (stopAdded != true) {
      $("#play_div").append("<p id='stop'>stop</p>");
      stopAdded = true;
    }

    $("#play").css("display", "none");
    $("#pause").css("display", "block");
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "running");
    port.postMessage({text:"play"});
  }

  //when any audio is finished remove these messages and change the UI accordingly
  if (msg.ended == true) {
    $("#message_4").remove();
    $("#message_5").remove();
    $("#stop").remove();

    stopAdded = false;
    ended = true
    msgAdded = true;
    pdfFinishMsg = false;

    $("#loading").css("display", "none");
    $("#play").css("display", "block");
    $("#pause").css("display", "none");
  }

  //when the background tells the content_script it's playing, do this.
  if (msg.text == 'playing') {
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "running");
    $("#play").css("display", "none");
    $("#pause").css("display", "block");
    if (stopAdded != true) {
      $("#play_div").append("<p id='stop'>stop</p>")
      stopAdded = true;
    }
  }

  //when the background tells the content_script it's paused, do this.
  if (msg.text == 'paused') {
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "paused");
    $("#play").css("display", "block");
    $("#pause").css("display", "none");
    if (stopAdded != true) {
      $("#play_div").append("<p id='stop'>stop</p>")
      stopAdded = true;
    }
  }

  //function for intiating the UI
  function main(ended){
    //so the main function isn't being executed hundreds of times  
    if (mainSent != true) {
      port.postMessage({text:'main'});
      mainSent = true;
    }

    //UI stuff to do when the mouse clicks the play button
    $('#play').mousedown(function(e){
      $("#pause").css("display", "none");
      $("#play").attr('src',"images/play_clicked.png");
      return true;

    }).mouseup(function(e){
      $("#play").css("display", "none");
      $("#play").attr('src',"images/play.png");
      $("#pause").css("display", "block");
      $("#pause").attr('src',"images/pause.png");
      $("#loading").css("display", "block");
      $("#loading").css("-webkit-animation-play-state", "running");
      
      if (stopAdded != true) {
        $("#play_div").append("<p id='stop'>stop</p>")
        stopAdded = true;
      }

      //sends the message to play
      port.postMessage({text:"play"});
      return true; 
    });

    //UI stuff to do when the mouse clicks the pause button
    $('#pause').mousedown(function(e){   
      $("#pause").attr('src',"images/pause_clicked.png");

      if (msgAdded == true) {
        $("#message_4").remove();
        msgAdded = false;
      }

    }).mouseup(function(e){
      if (pdfFinishMsg == true) {
        $("#message_5").remove();
        pdfFinishMsg = false;
      }
      
      $("#pause").attr('src',"images/pause.png");
      $("#pause").css("display", "none");
      $("#play").css("display", "block");
      $("#play").attr('src',"images/play.png");
      $("#loading").css("-webkit-animation-play-state", "paused");
      port.postMessage({text:"pause"}); //tells background that the audio should be paused   
      
      if (msgAdded == true) {
        $("#message_4").remove();
        msgAdded = false;
      }

    });

    //UI stuff to do when the mouse clicks the stop button
    $('#stop').click(function(e){
      $("#pause").css("display", "none");
      $("#play").css("display", "block");
      $("#play").attr('src',"images/play.png");
      $("#loading").css("display", "none");
      port.postMessage({text:"stop"}); //tells background page that the stop button was clicked
      $("#stop").remove();  
      stopAdded = false;
      window.close();
    });  
  }
});


