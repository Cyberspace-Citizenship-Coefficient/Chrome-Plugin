// Setup 
chrome.runtime.onInstalled.addListener(async ()=>{
    fetch(`${baseURL()}/device`,
		{
			body: JSON.stringify({}),
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		}
	)
		.then(response => response.json())
		.then(response => {
			chrome.storage.local.set({ instanceID: response });
		}
	).catch(error => console.log('Error:', error));
    
    chrome.storage.local.set({ 
        redSites: [],
        yellowSites: [],
        greenSites: [],
        whiteListedSited: [],
        tempAllowedSites: []
    });
});