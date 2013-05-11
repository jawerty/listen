$("#controls").css("display", "none")

url="http://google.com"; 
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'open_dialog_box') {
      alert("Message recieved!");
    }
  });
});

$(function main(){

    function listen(text,vol,loop,delay)
    {
        var child;
        if (loop == true) looped = true;
        else looped = false;
        vol=vol || 1;   
        delay=delay || 0;
        var text_mod = text.replace(' ', '+')
        api="http://tts-api.com/tts.mp3?q="+text_mod;

        setTimeout(function(){
            child = document.createElement("audio");
            child.setAttribute("src",api);
            child.volume=vol;
            child.load();
            child.setAttribute("autoplay","autoplay");
            if (looped) child.setAttribute("loop","loop");
            child.setAttribute("controls", "controls");
            child.setAttribute("style", "margin: 30px 0px;");
            child.addEventListener("load", function() {
                child.play();
            });

            child.addEventListener("ended", function() {
                child.remove()
                $("#play").css("display", "block")
            })
            $("#controls").css("display", "block")
            document.getElementById("controls").appendChild(child);
        }, delay);
    };
    
    $(function() {
     $('#play').mousedown(function(){
       $("#play").attr('src',"images/play_clicked.png");
       return false;
     }).mouseup(function(){
       $("#body_text").css("display", "none")
       $("#play").css("display", "none")
       $("#play").attr('src',"images/play.png");
       listen("Hello World. My name is Jared Wright and this is listen for chrome. Listen is a text to speech app for 'listening' to the text of any website at the click of a button", 1)
       return false; 
     })
    })
});
