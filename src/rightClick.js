// Register the Plugin when installed
chrome.runtime.onInstalled.addListener(() => {
	fetch("https://cyber-citizenship-coefficient.com/register")
		.then(response => response.json())
		.then(response => {
			chrome.storage.local.set({ instanceID: response.body });
			chrome.action.setIcon({
				path: {
					"128": 'images/128_CCC_GREEN.png'
				}
			})
			mapMenus();
		}
	).catch(error => console.log('Error:', error));
});

// Load available infractions when a window is opened
chrome.windows.onCreated.addListener(() => {
	mapMenus();
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
	const htmlElement = await chrome.storage.local.get(["htmlElement", "instanceID"], async (storage) => {
		const infraction = {
			reporter: storage.instanceID,
			url: info.pageUrl,
			type: info.menuItemId,
			content: storage.htmlElement
		};
		console.log(infraction)
		await fetch(`https://cyber-citizenship-coefficient.com/infraction`, 
			{
				body: JSON.stringify(infraction),
				method: 'POST',
				headers: {'Content-Type': 'application/json'}
			}
		)

		await chrome.action.setIcon({
			path: {
				"128": 'images/128_CCC_GREEN.png'
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
	await fetch("https://cyber-citizenship-coefficient.com/load-infractions")
		.then(response => response.json())
		.then(response => response.body)
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
