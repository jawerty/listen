url="http://google.com"; 
chrome.runtime.sendMessage({method:"getStorage",extensionSettings:"storage"},
function(response) {
  var json = JSON.parse(response.storageString);

  alert(json);

  var sendBack = {"one": "new data", "two": "more new data"};
  chrome.runtime.sendMessage({method:"setStorage", newData:sendBack});
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

            child.addEventListener("load", function() {
                child.play();
            });

            child.addEventListener("ended", function() {
                child.remove()
                $("#play").css("display", "block")
            })
            document.getElementById("container").appendChild(child);
        }, delay);
    };

    
    $(function() {
     $('#play').mousedown(function(){
       $("#play").attr('src',"images/play_clicked.png");
       return false;
     }).mouseup(function(){
       $("#play").css("display", "none")
       $("#play").attr('src',"images/play.png");
       listen("Hello World", 1)
       return false; 
     })
    })
});
