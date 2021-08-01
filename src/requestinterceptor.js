// Get the URL of the service
const base_URL = () => {
	return 'https://439r656kxf.execute-api.us-east-2.amazonaws.com/dev'
}

// Wait for tabs to change
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	// Only operate on tabs as they load 
    if (tab.status != "loading") {
        return;
	}

    const URL = tab.url.split('/')[2]
	// it is us, skip
	if (URL == 'afffkcmpebnikjnoagiiofainbpffnch') {
		return;
	}

	// If we were re-directed here from the bloicking site do not re-block
    if (tab.url.includes('skip_interceptor')) {
        return;
    }
	
	// Get the information on what we should and should not block
    await chrome.storage.local.get(["blockedSites", "warnedSites", "whiteListedSites","tempAllowedSites"], async (storage) => {
		// Check if we know about this site
        const isWhitelisted = storage.whiteListedSites.includes(URL);
        const isWarnedSite = storage.warnedSites.includes(URL);
        const isBlockedSite = storage.blockedSites.includes(URL);
        const isTempAllowedSite = storage.tempAllowedSites.includes(URL);
		
		// Check if the site may need to be blocked
		if (!isWhitelisted && !isTempAllowedSite) {
			// Gotta do something with this
			if (isWarnedSite || isBlockedSite) {
				// Have seen this recently, and it is bad, send it to the Warning Page
				await chrome.tabs.update(tabId, { url: 'display.html?url=' + tab.url, active: true })
			} else {
				// This is a new site, gotta check it 
				let block = false;
				let memory = 'unknown';
				// Ask the service about this site
				await fetch(`${base_URL()}/site-quality?site=${URL}`)
					.then(response => response.json())
					.then(siteRating => {
						switch (siteRating.rating) {
							case "good":
								memory = 'greenSites';
								break;
							case "bad":
								block = true;
								memory = 'redSites';
								break;
							case "iffy":
								block = true;
								memory = 'yellowSites';
								break;
						}
					}).catch(error => console.log('Error:', error));
				// If the site should be blocked, do so
				if (block) {
					// Redirect to our page before it finishes loading 
					await chrome.tabs.update(tabId, { url: 'display.html?url=' + tab.url, active: true })
				}
				// Save off the quality of this site for the session so we do not have to ask again
				if (memory !== 'unknown') {
					chrome.storage.local.get([memory], async (storage) => { // retrieves list from local storage
						storage[memory].push(URL) // update the list with a new entry 
						chrome.storage.local.set({ ...storage }); // saving list back into storage
					})
				}
			}
		}
    })
})

// Wait for our page to tell us if we need to take action based on the user's selection
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action == "go") {
        // Add to a temp whitelist so we don't annoy them
        chrome.storage.local.get(["tempAllowedSites"], async (storage) => { // retrieves tempAllowedSites from local storage
            storage.tempAllowedSites.push(message.url) // update the tempAllowedSites with a new entry 
            chrome.storage.local.set({ ...storage }); // saving tempAllowedSites back into storage
        })
    } else if (message.action == "always go") {
        // Add to a "permanent" whitelist so we don't block this again
        chrome.storage.local.get(["whiteListedSites"], async (storage) => { // retrieves whiteListedSites from local storage
            storage.whiteListedSites.push(message.url)  // update the whiteListedSites with a new entry 
            chrome.storage.local.set({ ...storage });  // saving whiteListedSites back into storage
        })
    }
});