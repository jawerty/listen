console.log('audio');

text = "Listen is a text to speech app for hearing the text on any website. \
At the click of a button, the website's text is generated and played through the \
tts-api. Another feature the Listen app has is the ability to read pdf pages. \
This feature is in beta and somewhat delicate for production, so try not to read \
pdf websites more than 5-10 pages long. For developers reading this, the source code \
is hosted here on Git hub. Enjoy...";

api="http://tts-api.com/tts.mp3?q="+text;
child = document.createElement("audio");
child.setAttribute("src",api);
child.load(); 
child.volume=1;

child.addEventListener("ended", function(e){
  $("#play").src = 'images/play.png';
  $("#pause").css('display', 'none');
  $("#play").css('display', 'inline');
});
$("#play").mousedown(function(e){
	$("#play").src = 'images/play_clicked.png';
}).mouseup(function(e){
  child.play()
	$("#play").css('display', 'none');
	$("#pause").css('display', 'inline');
})

$('#pause').mousedown(function(e){
	$("#pause").src = 'images/pause_clicked.png';
}).mouseup(function(e){
	child.pause();
  $("#pause").css('display', 'none');
  $("#play").src = 'images/play.png';
  $("#play").css('display', 'inline');
})