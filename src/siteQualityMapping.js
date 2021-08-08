// Startup set the icon to green
chrome.runtime.onStartup.addListener(() => {  
	chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_GREEN.png'
		}
	})

	
});

// Set the icon to blue when we are sending an infraction to show progress of the report
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	await chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_BLUE.png'
		}
	})
})

// Check the quality of a site that we allowed to fully load
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status === "complete") {
		await checkURL(tab.url.split('/')[2])
	}
})

// Check the quality of a tabs when you swap between them
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	setTimeout(async () => {
		const tab = await chrome.tabs.get(activeInfo.tabId);
		await checkURL(tab.url.split('/')[2])
	}, 100)
})

// Check if a URL is a bad actor
const checkURL = async (URL) => {
	// Load memory
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