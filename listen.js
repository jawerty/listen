var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

/*
to do:

=optimize play and pause button
=create website 

*/
var bg = chrome.extension.getBackgroundPage();

var msgRemoved;

chrome.extension.sendMessage({text:"startListen"},function(response){
  child = bg.document.getElementById('listen');
  
  $(function main(){ 
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
      
      chrome.extension.sendMessage({text:"play"});
      return true; 
    });

    $('#pause').mousedown(function(e){    
      $("#pause").attr('src',"images/pause_clicked.png");
      timeout = setTimeout(function() {
        var filler = true;
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
        }, 2000)
        chrome.extension.sendMessage({text:"stop"});
      }, 2000);
      
      return true;

    }).mouseup(function(e){
      clearTimeout(timeout);
       
      $("#pause").css("display", "none");
      $("#play").css("display", "block");
      $("#play").attr('src',"images/play.png");
      $("#loading").css("-webkit-animation-play-state", "paused");
      chrome.extension.sendMessage({text:"pause"});   
    
      if (typeof msgRemoved == 'undefined') {
        $("#message_4").remove();
        msgRemoved = true;
      }
      return true; 
    });
    
  });
  chrome.extension.sendMessage({text:"restartListen"});
});

