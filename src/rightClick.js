const baseURL = () => {
	return 'https://439r656kxf.execute-api.us-east-2.amazonaws.com/dev'
}

// Load available infractions when installed
chrome.runtime.onInstalled.addListener(() => {
	mapMenus();
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(() => {
	mapMenus();
});

//https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#state
// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(async (info, tab) => {

	if (info.menuItemId == "see_wall_of_shame"){
		console.log("see_wall_of_shame clicked")
		//open new tab with wall of shame url
		chrome.tabs.create({url: "https://cyberspace-citizenship-coefficient.github.io/Wall-of-Shame/",active: true});
		return ;
	}
	
	//handle context menu actions
	await chrome.storage.local.get(["htmlElement", "instanceID"], async (storage) => {
		const infraction = {
			reporter: storage.instanceID,
			url: info.pageUrl,
			type: info.menuItemId,
			content: storage.htmlElement
		};
		await fetch(`${baseURL()}/infraction`,
			{
				body: JSON.stringify(infraction),
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}
		)
			.catch(error => console.log('Error:', error));

		await chrome.action.setIcon({
			path: {
				"128": 'images/128_CCC_YELLOW.png'
			}
		})
	});
})

// Listen for the context script to tell us they right clicked on something
chrome.runtime.onMessage.addListener((message) => {
	// Gotta store the clicking action
	chrome.storage.local.set({ htmlElement: message });
});

const mapMenus = async () => {
	await chrome.contextMenus.removeAll();

	chrome.contextMenus.create({
		title: "See Wall of Shame",
		type: "normal",
		id: 'see_wall_of_shame',
		contexts: ['all']
	})
	await fetch(`${baseURL()}/infraction-types`)
		.then(response => response.json())
		.then(availableInfractions => {
			availableInfractions.forEach(infraction => {
				chrome.contextMenus.create({
					title: infraction.title,
					type: 'normal',
					id: infraction.id,
					contexts: ['all']
				})
			})
		}).catch(error => console.log('Error:', error));
}

function sendResetMessage() {
	chrome.runtime.sendMessage({ message: "reset_site_mappings" })
}