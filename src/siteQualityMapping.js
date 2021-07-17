const initializeSiteMappingsinStorage = async () => {  // void function that adds the list of sites to local storage
	// Load blacklist and greylist from lambdas (Red and yellow status) 
	// TEMP Harcode for testing
	const responseFromLambda = {
		statusCode: 200,
		body: {
			blockedSites: [ // things that cause red
				'serebii.net',
				'patimex.com',
				'rudgwicksteamshow.co.uk',
				'bellads.info',
				'arngren.net',
				'thebiguglywebsite.com',
				'theworldsworstwebsiteever.com',
				'roverp6cars.com/'

			], 
			warnedSites: [ //things that cause yellow
				'regalcapitallenders.com',  
				'uat.edu/',
				'nwokillers.weebly.com',
				'pnwx.com',
				'lingscars.com',
				'pennyjuice.com',
				'blinkee.com',
				'seals.com', 
				'uglytub.com',
				'mrbottles.com/'
			], 
			whiteListedSites: [
				'airbnb.com',
				'purdue.edu',
				'vanderbilt.edu',
				'slack.com',
				'dropbox.com',
				'carmax.com',
				'healthline.com',
				'marcjacobs.com',
				'skype.com',
				'nest.com'
			]
		}
	}

	// Storing the blocked and warned sites in the local plugin memory storage
	chrome.storage.local.set({ ...responseFromLambda.body });  //using spread operator 
}

// Register the Plugin when installed
chrome.runtime.onStartup.addListener(() => {  //want to get an updated list from lambda when the browser opens up
	chrome.action.setIcon({
		path: {
			"128": 'images/128_CCC_GREEN.png'
		}
	})
	initializeSiteMappingsinStorage();
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(initializeSiteMappingsinStorage);

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
	await chrome.storage.local.get(["blockedSites", "warnedSites", "whiteListedSites"], async (storage) => {
				
		var icon = 'images/128_CCC_GREEN.png'
		const whiteListed = storage.whiteListedSites.find(x => URL.includes(x))  //checking if current URL is whitelisted
		if (!whiteListed && storage.warnedSites.some(x => URL.includes(x))) {  // screening for URLs that are not whiteListed
			// SET ICON TO YELLOW
			icon = 'images/128_CCC_YELLOW.png'
		} else if (!whiteListed && storage.blockedSites.some(x => URL.includes(x))) {  // screening for URLs that are not whiteListed
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
