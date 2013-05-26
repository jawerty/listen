$(window).load(function () {
  if (child) {
    delete child;
  }
});

$("#play").mousedown(function(e){
	$("#play").src = 'images/play_clicked.png';
}).mouseup(function(e){

  text = "Listen is a text to speech app for hearing the text on any website. \
  By the click of a button, the website's text is generated and played through the \
  tts-api. Another feature the Listen app has it the ability to read pdf pages. \
  This feature is in beta and somewhat delicate for production, so try not to read \
  pdf websites more than 5-10 pages long. For developers reading this, the source code \
  is hosted here on Github. Enjoy...";

  api="http://tts-api.com/tts.mp3?q="+text;
  child = document.createElement("audio");
  child.setAttribute("src",api);
  child.load(); //reload the source (the source changes a lot)
  child.volume=1;
  child.play();
  //event listener for when the audio ends
  //...mainly for control flow and a more intuitive UI
  child.addEventListener("ended", function(e){
  	$("#play").src = 'images/play_large.png';
  	$("#pause").css('display', 'none');
  	$("#play").css('display', 'block');
  });

	$("#play").css('display', 'none');
	$("#pause").css('display', 'block');
})

$('#pause').mousedown(function(e){
	$("#pause").src = 'images/pause_clicked.png';
}).mouseup(function(e){
	child.pause();
  $("#pause").css('display', 'none');
  $("#play").src = 'images/play_large.png';
  $("#play").css('display', 'block');
})