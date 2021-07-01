const getBlacklists = async () => {
	// Load blacklist and greylist from lambdas (Red and yellow status) 
	// TEMP Harcode for testing
	const responeFromLambda = {
		statusCode: 200,
		body: {
			blockedSites: [
				'serebii.net',
			], // things that cause red
			warnedSites: [
				'airbnb.com',
				'purdue.edu',
			] // things that cause yellow
		}
	}

	// Storing the blocked and warned in the plugin memory
	chrome.storage.local.set({ ...responeFromLambda.body });
}

// Register the Plugin when installed
chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_GREEN.png'
		}
	})
	getBlacklists();
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(getBlacklists);

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
	await checkURL(tab.url.split('/')[2])
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	console.log('onActivated');
	setTimeout(async () => {
		const tab = await chrome.tabs.get(activeInfo.tabId);
		await checkURL(tab.url.split('/')[2])
	}, 100)
})

// TODO: Re-use FCN to map URL to ICON
const checkURL = async (URL) => {
	await chrome.storage.local.get(["blockedSites", "warnedSites"], async (storage) => {
				
		var icon = 'images/128_CCC_GREEN.png'
		if (storage.warnedSites.some(x => URL.includes(x))) {
			// SET ICON TO YELLOW
			icon = 'images/128_CCC_YELLOW.png'
		} else if (storage.blockedSites.some(x => URL.includes(x))) {
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
