/*
background.js

MIT License
Copyright (c) 2013
 
author: Jared Wright
email: jawerty210@gmail.ocm

description: background code for listen extension
*/

//global event variables 
var initPDF;
var child;
var newTab = false;
var updatedTab = false;
var playing = null;
var stopped;
var text;
var generateOnce;
looped = false;
vol=1;   
delay=0;

//Usage for chrome optimization based on runtime || extension
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ?
 'runtime' : 'extension';

//console.log("Running background...");

//function for deleting all tags in a html document object for a specific tag
//used when sanatizing text for readability
function stripTags(tag, s, doc) {
  var div = doc.createElement('div');
  div.innerHTML = s;
  var tags = div.getElementsByTagName(tag);
  var i = tags.length;
  while (i--) {
    tags[i].parentNode.removeChild(tags[i]);
  }
  return div.innerHTML;
}

//function for finding the last characters in a string
//used in determining whether a page is a pdf (i.e. '.pdf')
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*
function for object iteration over pdf text, 
uses pdf object from pdf.js library
https://github.com/mozilla/pdf.js/
*/
function generatePDFText(pdf, callback) {
	//appends each pdf line to a string...
	//currently looking for an easier method since the iteration is VERY slow
	pdfText = '';
	for(i=1;i<=pdf.pdfInfo.numPages;i++){
		pdf.getPage(i).then(function(page) {
			//indexing each pdf page 
			i -= 1
			console.log('next page ' + i) 
			if (page.getTextContent()._data.bidiTexts){
				//indexing each pdf page line
				for(ii=0;ii<page.getTextContent()._data.bidiTexts.length;ii++){
					//finally appending to the string
					pdfText += page.getTextContent()._data.bidiTexts[ii].str+'\n';
					//if statement is used to finalize the fuction and initialize the callback.
					if (i == pdf.pdfInfo.numPages && ii == page.getTextContent()._data.bidiTexts.length-1) {
						end_response = "done: %d page"
						if (i == 1) console.log("done: "+i+" page");
						else console.log("done: "+i+" pages")
						callback(); //running the callback
					}
				}
	    }   
	  });
	}
	
}

/*
function for creating the audio child in the background.html file.
(uses HTML5 audio tag)
*/
function createChild(text_mod, port){
	playing = undefined
  //console.log("listen reinitiated");
  console.log(text_mod)
	//uses tts-api for audio
	//http://tts-api.com
  api="http://tts-api.com/tts.mp3?q="+text_mod;
  child = document.createElement("audio");
  child.setAttribute("src",api);
  child.load(); //reload the source (the source changes a lot)
  child.setAttribute("id","listen");
  child.volume=vol;
  if (looped) child.setAttribute("loop","loop");
  child.setAttribute("controls", "controls");
  child.setAttribute("style", "margin: 30px 0px;");

  //event listener for when the audio ends
  //...mainly for control flow and a more intuitive UI
  child.addEventListener("ended", function(e){
  	var ended = true
  	playing = undefined;
  	port.postMessage({ended:ended});
  	console.log('ended')
  });

}
/*
function is meant to wrap around code if something ever needed to be
run before all the code
*/
function queue(wrapper, callback) {
	callback();
}

$(function wrapper(){	 //wrapper function
	chrome[runtimeOrExtension].onConnect.addListener(function(port) {
		queue(wrapper, function(){
			console.assert(port.name == "listen_port");

			/*
			port.onDisconnect.addListener(function(e) {
				console.log("disconnected")
			});
			*/

		  port.onMessage.addListener(function(message){

		  	port.postMessage({text:"listening..."});

				chrome.tabs.query({'active': true}, function (tabs) { 
					//gets url asynchronously to use the jquery ajax get function
			  	url = tabs[0].url;
			  	$.get(url, function(rawData) { //some ajax to get the content of the website
						//create a nameless, empty HTML5 document 
						var doc = document.implementation.createHTMLDocument("");

						//strip certain HTML tags 
						data = stripTags('code', stripTags('style', stripTags('script', rawData, doc), doc), doc);
						data = data.replace(/\#/g,' ').replace(/\:/g,'.').replace(/\./g,'. ').replace(/\&/g,' and ').replace(/\*/g,' ').replace(/\$/g,' ').replace(/\;/g,'. ').replace(/\n\b\s\p\;/g,' ').replace(/\c\o\p\y\;/g,' copyright ')
		       			doc.body.innerHTML = data

		       	//checks if it's a pdf url
						if (endsWith(url, '.pdf')) {
							//the pdf content is ran after the messaging() function is ran unlike most websites
							//removes audio child
							$("#listen").remove();
							ended = true
							
							if (generateOnce == true) { //checks if it was already generated
								/*
								executes the function for initiating messaging between the
								background and content_script
								*/
								messaging(null, true);
								return true;
							} else{
								messaging(null, true, generateOnce, newTab, tabs);
								return true;
							}
						
					
						}else{
							//text_mod is the content being read by tts-api
						  text_mod = doc.body.innerText;
						  messaging(text_mod, false, generateOnce, newTab, tabs);
						  return true;
						}

					});
			  	
				});
				
				//function for passing data between background and content_script
				function messaging(text_mod, pdf, generateOnce, newTab, tabs) {
					//starting the program
					if (message.text == "startListen") {
						if (playing == true){ //if playing
							port.postMessage({text:"playing"});
						} 

						else if (playing == false){ //if paused
							port.postMessage({text:"paused"});
						} 

						else {
							//now the pdf is being played
							if (pdf == true) {
								initPDF = true;
						  	console.log('pdf is true')
					  		
							} else {
								initPDF = false;
								createChild(text_mod, port);
							}
						 
						}
			
					}

					//what happens when the audio is played
					else if(message.text == "play") {
						playing = true;
					  child.play();
					  $("#controls").css("display", "block");
					  document.getElementById("controls").appendChild(child);
					}

					//what happens when the audio is paused
					else if(message.text == "pause"){
						playing = false;
					  child.pause();
					}

					//what happens when the audio is stopped
					else if(message.text == "stop"){
						console.log('stopped')
						stopped = true;
						playing = undefined;
						child.currentTime = 0;
						child.pause();
						child.load();
						ended = true;
					  port.postMessage({ended:ended});
					  //refreshes the page when stopped so a new connection is made
					  var code = 'window.location.reload();';
  					chrome.tabs.executeScript(tabs[0].id, {code: code});
					} 

					//whenever it's initiated
					else if (message.text == "main"){
						if (initPDF == true) {

							port.postMessage({pdf:true});
							PDFJS.disableWorker = true; //using pdf.js: PDFJS is in the pdf.js code /scripts/pdf.js

							//getting the pdf document by url
							PDFJS.getDocument(url).then(function getPdf(pdf) {

								//generating the text from the pdf
								//using the callback I made before the wrapper to generate the pdf
								generatePDFText(pdf, function(){
							    console.log(pdfText);
							    text_mod = pdfText;
								  createChild(text_mod, port); //running the audio
								  
								  //event variables
								  initPDF = false;
							  	playing = true;
							  	generateOnce = true

									port.postMessage({pdf:"finished"}) //sending the message to the content_script that it's finsihed loading
									console.log('-----pdf finished-----')
									return true;
							  });

						  });
						} else if (playing == true) {
							//replays audio when pdf is initiated
							child.play();
						}
						
					}	

				}
			});
		});
	});
});



