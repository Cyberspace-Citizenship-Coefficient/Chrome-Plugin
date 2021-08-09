// Setup 
chrome.runtime.onInstalled.addListener(async () => {
	// Register the decive
    fetch(`${baseURL()}/device`,
		{
			body: JSON.stringify({}),
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		}
	)
		.then(response => response.json())
		.then(response => {
			// Store install ID so we can send it with infractions
			chrome.storage.local.set({ instanceID: response });
		}
	).catch(error => console.log('Error:', error));
    
	// Init memory
    chrome.storage.local.set({ 
        redSites: [],
        yellowSites: [],
        greenSites: [],
        whiteListedSites: [], // This is never reset
        tempAllowedSites: [], 
        dont_show_again_preference: false
    });
});

//https://developer.chrome.com/docs/extensions/reference/windows/#property-WINDOW_ID_NONE
// Clear session memory when all windows are closed 
chrome.windows.onFocusChanged.addListener((windowID) => {
	if (windowID == chrome.windows.WINDOW_ID_NONE) {
		// Reset the session memory when all windows are closed
		chrome.storage.local.set({ 
			redSites: [],
			yellowSites: [],
			greenSites: [],
			tempAllowedSites: []
		});
	}
});
