const base_URL = () => {
	return 'https://439r656kxf.execute-api.us-east-2.amazonaws.com/dev'
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const URL = tab.url.split('/')[2]

	if (URL == 'afffkcmpebnikjnoagiiofainbpffnch') {
		// it is us, skip
		return;
	}

    if (tab.url.includes('skip_interceptor')) {
        return;
    }

    if (tab.status != "loading") {
        return;
	}
	
    await chrome.storage.local.get(["blockedSites", "warnedSites", "whiteListedSites","tempAllowedSites"], async (storage) => {
        const isWhitelisted = storage.whiteListedSites.includes(URL);
        const isWarnedSite = storage.warnedSites.includes(URL);
        const isBlockedSite = storage.blockedSites.includes(URL);
        const isTempAllowedSite = storage.tempAllowedSites.includes(URL);
		
		if (!isWhitelisted && !isTempAllowedSite) {
			// Gotta do something with this
			if (isWarnedSite || isBlockedSite) {
				// Have seen this recently, and it is bad, send it to the Warning Page
				await chrome.tabs.update(tabId, { url: 'display.html?url=' + tab.url, active: true })
			} else {
				// This is a new site, gotta check it 
				let block = false;
				let memory = 'unknown';
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
				if (block) {
					await chrome.tabs.update(tabId, { url: 'display.html?url=' + tab.url, active: true })
				}
				if (memory !== 'unknown') {
					chrome.storage.local.get([memory], async (storage) => {
						storage[memory].push(URL)
						chrome.storage.local.set({ ...storage });
					})
				}
			}
		}
    })
})

chrome.runtime.onMessage.addListener(async (message) => {
	console.log(message)
    if (message.action == "go") {
        // Add to a temp whitelist so we don't annoy them
        chrome.storage.local.get(["tempAllowedSites"], async (storage) => {
            storage.tempAllowedSites.push(message.url)
            chrome.storage.local.set({ ...storage });
        })
    } else if (message.action == "always go") {
        // Add to a "permanent" whitelist so we don't block this again
        chrome.storage.local.get(["whiteListedSites"], async (storage) => { //retrieves whiteListedSites from local storage
            storage.whiteListedSites.push(message.url)  //update the whiteListedSites with a new entry 
            chrome.storage.local.set({ ...storage });  //saving whiteListedSites back into the database
        })
    }
});