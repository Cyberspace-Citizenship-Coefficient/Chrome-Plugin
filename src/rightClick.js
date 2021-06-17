// Add right click elements when installed
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		title: 'Report HTML Element',
		type: 'normal',
		id: 'RightClickReport',
		contexts: ['all']
	});
	
	chrome.contextMenus.create({
		title: 'Report Video Element',
		type: 'normal',
		id: 'VideoReport',
		contexts: ['all']
	});
	
	chrome.contextMenus.create({
		title: 'Report Audio Element',
		type: 'normal',
		id: 'AudioReport',
		contexts: ['all']
	});
});

//https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#state
// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	//handle context menu actions
	console.log('CLICKED SOMETHING')
	console.log(info)
	console.log(tab)
	console.log('LOAD')
	chrome.storage.local.get(["htmlElement"], ({ htmlElement }) => {
		console.log(htmlElement)
		// Need to send all of this to the Lambdas
	});
})

// Listen for the context script to tell us they right clicked on something
chrome.runtime.onMessage.addListener((message) => {
	// Gotta store the clicking action
	chrome.storage.local.set({ htmlElement: message });
});