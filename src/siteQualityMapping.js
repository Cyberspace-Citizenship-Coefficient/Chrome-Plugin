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

// TODO: Fill out this FCN
const getBlacklists = async () => {
	// Load blacklist and greylist from lambdas (Red and yellow status) 
	// TEMP Harcode for testing
	
	// Remove whitelist items from blacklist and greylist ??? 
}

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


// TODO: Add a listener for changing tabs to change icons

// TODO: Add a listener for changing sites to change icons

// TODO: Re-use FCN to map URL to ICON
