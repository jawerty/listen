var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

/*
to do:

=get pdf working just like any other website
=optimize gui
=make indexing faster
=create website 

*/

var ended; 
var msgRemoved;
var msgAdded = false;
var pdfFinishMsg = false;
var stopAdded;
var port = chrome[runtimeOrExtension].connect({name: "listen_port"});

port.postMessage({text:"startListen"});

var bkg = chrome.extension.getBackgroundPage();

port.onMessage.addListener(function(msg){
  if (msg.pdf == true){

    if (msgAdded == false) {
      $("#play_div").append("<p id='message_4'>Long PDFs (books) may take a few minutes to load.</p>")
      msgAdded = true;
    }
    
    $("#play").css("display", "none");
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "running");

  }

  if (msg.pdf == 'finished'){
    $("#message_4").remove();
    if (pdfFinishMsg == false){
      $("#play_div").append("<p id='message_5'>PDF finished loading...Now playing</p>");
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

  if (msg.text == 'listening...'){
    main(ended);
  }

  if (msg.text == 'playing') {
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "running");
    $("#play").css("display", "none");
    $("#pause").css("display", "block");
  }

  if (msg.text == 'paused') {
    $("#loading").css("display", "block");
    $("#loading").css("-webkit-animation-play-state", "paused");
    $("#play").css("display", "block");
    $("#pause").css("display", "none");
  }

  function main(ended){  
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

      port.postMessage({text:"play"});
      return true; 
    });

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
      port.postMessage({text:"pause"});   
      
      if (msgAdded == true) {
        $("#message_4").remove();
        msgAdded = false;
      }

    });
    
    $('#stop').click(function(e){
      $("#pause").css("display", "none");
      $("#play").css("display", "block");
      $("#play").attr('src',"images/play.png");
      $("#loading").css("display", "none");
      port.postMessage({text:"stop"});
      $("#stop").remove();  
      stopAdded = false;
    });  
  }
});

