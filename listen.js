var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

$("#controls").css("display", "none")

/*
to do:
=end and start button in content script
=create audio tag in background
=
=
*/
var msgRemoved;
function wrap(){
  chrome.extension.sendMessage({text:"startListen"},function(response){
    $(function main(){      
      $('#play').mousedown(function(e){
        $("#play").attr('src',"images/play_clicked.png");
        return false;
      }).mouseup(function(e){
        $("#body_text").css("display", "none");
        $("#play").css("display", "none");
        $("#play").attr('src',"images/play.png");
        $("#pause").css("display", "block");
        $("#pause").attr('src',"images/pause.png");
        $("#loading").css("display", "block")
        $("#loading").css("-webkit-animation-play-state", "running");

        if (msgRemoved != true) $("#play_div").append("<label id='message_4'>hint: Hold pause to stop</label>")
        
        chrome.extension.sendMessage({text:"play"});
        return false; 
      });

      $('#pause').mousedown(function(e){    
        $("#pause").attr('src',"images/pause_clicked.png");

        this.timeout = setTimeout(function() {
            $("#pause").css("display", "none");
            $("#play").css("display", "block");
            $("#play").attr('src',"images/play.png");
            $("#loading").css("display", "none");
            chrome.extension.sendMessage({text:"stop"});
        }, 2000);

        return false;
      }).mouseup(function(e){

        clearTimeout(this.timeout);
        if (typeof msgRemoved == 'undefined') {
          $("#message_4").remove();
          msgRemoved = true;
        }

        $("#pause").css("display", "none");
        $("#play").css("display", "block");
        $("#play").attr('src',"images/play.png");
        $("#loading").css("-webkit-animation-play-state", "paused");

        chrome.extension.sendMessage({text:"pause"});
        return false; 
      });
    });

    chrome.extension.sendMessage({text:"restartListen"});
  });
}

wrap()