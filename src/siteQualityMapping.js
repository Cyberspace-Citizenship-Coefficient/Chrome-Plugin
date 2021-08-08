// Register the Plugin when installed
chrome.runtime.onStartup.addListener(() => {  //want to get an updated list from lambda when the browser opens up
	chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_GREEN.png'
		}
	})

	
});

//https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#state
// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	//handle context menu actions
	await chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_BLUE.png'
		}
	})
})


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status === "complete") {
		await checkURL(tab.url.split('/')[2])
	}
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	setTimeout(async () => {
		const tab = await chrome.tabs.get(activeInfo.tabId);
		await checkURL(tab.url.split('/')[2])
	}, 100)
})

// TODO: Re-use FCN to map URL to ICON
const checkURL = async (URL) => {
	await chrome.storage.local.get(["redSites", "yellowSites", "whiteListedSites"], async (storage) => {		
		var icon = 'images/128_CCC_GREEN.png'
		const whiteListed = storage.whiteListedSites.includes(URL)  //checking if current URL is whitelisted
		if (!whiteListed && storage.yellowSites.includes(URL)) {  // screening for URLs that are not whiteListed
			// SET ICON TO YELLOW
			icon = 'images/128_CCC_YELLOW.png'
		} else if (!whiteListed && storage.redSites.includes(URL)) {  // screening for URLs that are not whiteListed
			// SET ICON TO RED
			icon = 'images/128_CCC_RED.png'
		}
		await chrome.action.setIcon({
			path: {
				"128": icon
			}
		})
	});
}

chrome.runtime.onMessage.addListener(async (msg)=>{
	switch(msg){
		case 'reset_site_mappings':{
			initializeSiteMappingsinStorage();
			console.log('mappings have been reset, check console watcher')
			break;
		}
	}
})
