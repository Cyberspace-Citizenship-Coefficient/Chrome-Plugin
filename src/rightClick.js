// Get the URL of the service
const baseURL = () => {
	return 'https://cyberspace-citizenship-coefficient.com'
}

// Load available infractions when installed
chrome.runtime.onInstalled.addListener(() => {
	mapMenus();
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(() => {
	mapMenus();
});

// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	// Load the clicked element
	await chrome.storage.local.get(["htmlElement", "instanceID"], async (storage) => {
		// Create an infraction
		const infraction = {
			reporter: storage.instanceID,
			url: info.pageUrl,
			type: info.menuItemId,
			content: storage.htmlElement
		};
		// Send it to the service
		await fetch(`${baseURL()}/infraction`,
			{
				body: JSON.stringify(infraction),
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}
		)
			.catch(error => console.log('Error:', error));
		// Set the icon to warning, it was set to blue in siteQualityMapping when we started reporting the infraction
		await chrome.action.setIcon({
			path: {
				"128": 'images/128_CCC_YELLOW.png'
			}
		})
	});
})

// Listen for the context script to tell us they right clicked on something
chrome.runtime.onMessage.addListener((message) => {
	// Store the clicking action
	chrome.storage.local.set({ htmlElement: message });
});

// Get the reportable infractions from the service
const mapMenus = async () => {
	// Clear the current setup
	await chrome.contextMenus.removeAll();
	// Get a list of all the things a user can report
	await fetch(`${baseURL()}/infraction-types`)
		.then(response => response.json())
		.then(availableInfractions => {
			availableInfractions.forEach(infraction => {
				// Add each reportable infraction to the context menu
				chrome.contextMenus.create({
					title: infraction.title,
					type: 'normal',
					id: infraction.id,
					contexts: ['all']
				})
			})
		}).catch(error => console.log('Error:', error));
}
