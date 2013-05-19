var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

/*
to do:

=make persistent connection
=get content from website
=read content from website
=create website 

*/
var ended; 
var msgRemoved;
var port = chrome[runtimeOrExtension].connect({name: "listen_port"});

port.postMessage({text:"startListen"});

port.onMessage.addListener(function(msg){
  if (msg.ended == true) {
    $("#message_4").remove();
    ended = true
    msgRemoved = true

    $("#loading").css("display", "none");
    $("#play").css("display", "block");
    $("#pause").css("display", "none");
    $("#body_text").css("display", "none");
  }
  if (msg.text == 'listening...'){
    main(ended);
  }

  function main(ended){  
    $('#play').mousedown(function(e){
      $("#play").attr('src',"images/play_clicked.png");
      return true;
    }).mouseup(function(e){
      $("#body_text").css("display", "none");
      $("#play").css("display", "none");
      $("#play").attr('src',"images/play.png");
      $("#pause").css("display", "block");
      $("#pause").attr('src',"images/pause.png");
      $("#loading").css("display", "block");
      $("#loading").css("-webkit-animation-play-state", "running");

      if (msgRemoved != true) $("#play_div").append("<label id='message_4'>hint: Hold pause to stop</label>")
      
      port.postMessage({text:"play"});
      return true; 
    });

    $('#pause').mousedown(function(e){    
      $("#pause").attr('src',"images/pause_clicked.png");
      this.timeout = setTimeout(function() {
        if (typeof msgRemoved == 'undefined') {
          $("#message_4").remove();
          msgRemoved = true;
        }

        $("#pause").css("display", "none");
        $("#loading").css("margin-top", "20px");

        setTimeout(function(){
          $("#loading").css("display", "none")
          $("#play").css("display", "block");
          $("#play").attr('src',"images/play.png");
          $("#loading").css("margin-top", "0px");
        }, 2000);

        port.postMessage({text:"stop"});

      }, 2000);
      return true;

    }).mouseup(function(e){
      this.clearTimeout(timeout);
       
      $("#pause").css("display", "none");
      $("#play").css("display", "block");
      $("#play").attr('src',"images/play.png");
      $("#loading").css("-webkit-animation-play-state", "paused");

      port.postMessage({text:"pause"});   
    
      if (typeof msgRemoved == 'undefined') {
        $("#message_4").remove();
        msgRemoved = true;
      }

      return true;
    });
    
  }
});

