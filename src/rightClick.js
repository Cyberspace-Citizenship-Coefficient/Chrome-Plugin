//chrome.contextMenus.create({
//	id: "RightClickReport"
//	title: "Report HTML Element",
//	contexts:["selection"],  // ContextType
//	onclick: console.log // A callback function
//});

chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		title: 'Report HTML Element',
		type: 'checkbox',
		id: 'RightClickReport',
		contexts: ['all']
	});
	
	chrome.contextMenus.create({
		title: 'Report Video Element',
		type: 'checkbox',
		id: 'VideoReport',
		contexts: ['video']
	});
	
	chrome.contextMenus.create({
		title: 'Report Audio Element',
		type: 'checkbox',
		id: 'AudioReport',
		contexts: ['audio']
	});
	
	//document.addEventListener('contextmenu', e => {
	//	console.log(e)
	//});
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	//handle context menu actions
	console.log('CLICKED SOMETHING')
	console.log(info)
	console.log(tab)
	console.log('LOAD')
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	console.log(request)
  }
);

//var port = chrome.runtime.connect();
//
//window.addEventListener("message", (event) => {
//  // We only accept messages from ourselves
//  if (event.source != window)
//    return;
//
//  if (event.data.type && (event.data.type == "CCC")) {
//    console.log("Content script received: " + event.data.text);
//    port.postMessage(event.data.text);
//  }
//}, false);