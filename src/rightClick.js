// Register the Plugin when installed
chrome.runtime.onInstalled.addListener(() => {
	// TODO: GET INSTANCE ID FROM LAMBDA
	chrome.storage.local.set({ instanceID: "xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx" });
	//chrome.browserAction.setIcon({
	//	path: {
	//		"128": 'images/128_CCC_GREEN.png'
	//	}
	//})
	mapMenus();
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(async () => {
	await mapMenus();
});

//https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#state
// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	//handle context menu actions
	//await chrome.browserAction.setIcon('images/128_CCC_BLUE.png')
	console.log('CLICKED SOMETHING')
	console.log(info)
	console.log(tab)
	console.log('LOAD')
	const htmlElement = await chrome.storage.local.get(["htmlElement"]);
	console.log(htmlElement)
	// TODO: SEND THIS TO THE INFRACTION LOGGING API
	//await chrome.browserAction.setIcon('images/128_CCC_GREEN.png')
})

// Listen for the context script to tell us they right clicked on something
chrome.runtime.onMessage.addListener((message) => {
	// Gotta store the clicking action
	chrome.storage.local.set({ htmlElement: message });
});

const mapMenus = async () => {
	await chrome.contextMenus.removeAll();
	
	// TODO: GET INFRACTIONS FROM LAMBDA
	const availableInfractions = [{
		title: "Report Ad with Audio",
		id:  "AdWithAudio"
	},{
		title: "Report Paywall in middle of page",
		id:  "PaywallInPage"
	}]
	
	availableInfractions.forEach(infraction => {
		chrome.contextMenus.create({
			title: infraction.title,
			type: 'normal',
			id: infraction.id,
			contexts: ['all']
		});
	})
}