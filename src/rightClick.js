// Get the URL of the service
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

// Listen for when we are clicked 
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId == "see_wall_of_shame") {
		console.log("see_wall_of_shame clicked")
		//open new tab with wall of shame url
		chrome.tabs.create({ url: "https://cyberspace-citizenship-coefficient.github.io/Wall-of-Shame/", active: true });
		return;
	}

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
		).then(res => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				
				chrome.storage.local.get(['dont_show_again_preference'], (storage) => {
					
					let message_obj = {
						message: "Thank you for your submission. We will process and add it to the infractions wall of shame in a few days. Click on the wall of shame context menu item later to see your enty",
						dont_show_again_preference: storage.dont_show_again_preference
					}
					chrome.tabs.sendMessage(tabs[0].id, message_obj, function (response) {
						console.log(response.farewell);
					});
				})
			});
		})
			.catch(error => {
				console.log('Error:', error)
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { message: "Failed to post your infraction. Our sysems might be experiencing some technical issues" }, function (response) {
						console.log(response.farewell);
					});
				});
			});

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
	chrome.contextMenus.create({
		title: "See Wall of Shame",
		type: "normal",
		id: 'see_wall_of_shame',
		contexts: ['all']
	})
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