$("#play").mousedown(function(e){
	$("#play").src = '../images/play_clicked.png';
}).mouseup(function(e){
  api="http://tts-api.com/tts.mp3?q="+text_mod;
  child = document.createElement("audio");
  child.setAttribute("src",api);
  child.load(); //reload the source (the source changes a lot)
  child.volume=1;
  child.play();
  //event listener for when the audio ends
  //...mainly for control flow and a more intuitive UI
  child.addEventListener("ended", function(e){
  	$("#play").src = '../images/play.png';
  	$("#pause").css('display', 'none');
  	$("#play").css('display', 'block');
  });

	$("#play").css('display', 'none');
	$("#pause").css('display', 'block');
})

$('#pause').mousedown(function(e){
	$("#pause").src = '../images/pause_clicked.png';
}).mouseup(function(e){
	child.pause();
})