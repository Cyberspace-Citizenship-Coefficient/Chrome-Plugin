//var s = document.createElement('script');
//s.src = chrome.extension.getURL('getElement.js');
//(document.head||document.documentElement).appendChild(s);
//s.onload = function() {
//    s.parentNode.removeChild(s);
//};

var s = document.createElement('script');
s.src = chrome.runtime.getURL('getElement.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onConnect.addListener(port => {
	console.log('connected ', port);

	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
		if (request.greeting === "hello") {
			sendResponse({farewell: "goodbye"});
		}
		return true
	  }
	)
});