chrome.runtime.onStartup.addListener(function() {
	chrome.tabs.getSelected(null, function(tab) {
		url = tab.url;
	});
	var response = '';
	$.ajax({ 
		type: "GET",   
		url: url,   
		async: false,
		success : function(text)
		{
			
		}
	});
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
});