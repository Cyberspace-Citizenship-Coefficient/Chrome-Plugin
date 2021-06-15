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
});

//https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#state
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	//handle context menu actions
	console.log('CLICKED SOMETHING')
	console.log(info)
	console.log(tab)
	console.log('LOAD')
	chrome.storage.local.get(["htmlElement"], ({ htmlElement }) => {
		console.log(htmlElement)
	});
})

chrome.runtime.onMessage.addListener((message) => {
	console.log(message)
	chrome.storage.local.set({ htmlElement: message });
});