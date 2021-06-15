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
	
	console.log('Add video one')
	chrome.contextMenus.create({
		title: 'Report Video Element',
		type: 'checkbox',
		id: 'VideoReport',
		contexts: ['video']
	});
	console.log('Add audio one')
	chrome.contextMenus.create({
		title: 'Report Audio Element',
		type: 'checkbox',
		id: 'AudioReport',
		contexts: ['audio']
	});
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	//handle context menu actions
	console.log('CLICKED SOMETHING')
	console.log(info)
	console.log(tab)
})