let processing = false;
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // See that the tab is changing
    // console.log(tabId)
    // console.log(changeInfo)
    // console.log(tab)


    const URL = tab.url.split('/')[2]
    await chrome.storage.local.get(["blockedSites", "warnedSites","whiteListedSites"], async (storage) => {
        const isWhitelisted = getTemporaryWhiteList().filter(x => x.includes(URL)).length > 0;
        if (!processing && (storage.warnedSites.find(x => URL.includes(x)) || storage.blockedSites.find(x => URL.includes(x))) && !isWhitelisted) {
            processing = true;
            // close target
            // TODO: Save off the old page OR make this change what the tab loads
            chrome.tabs.remove(tabId)
            // create warning page
            let opened = await chrome.tabs.create({ url: 'display.html?url='+URL, active: true })
            console.log(opened);
            setTimeout(() => processing = false, 50)
        } else if(!processing) {
            sessionStorage.setItem('before', URL);
        }
    })
})

function getTemporaryWhiteList(){
    return sessionStorage.tempAllowedSites ? JSON.parse(sessionStorage.tempAllowedSites) : [];
}

chrome.runtime.onMessage.addListener(async (message) => {
    console.log("GOT A MESSAGE")


    if (message.action == "leave") {
        // leave the webpage
        console.log("LEAVE")
        window.location.push(message.url)
    } else if (message.action == "go") {
        const tempWhitelist = getTemporaryWhiteList();
        tempAllowedSites.push(message.url);
        sessionStorage.tempAllowedSites = JSON.stringify(tempWhitelist);
        // Add to a temp whitelist so we don't annoy them
        // await chrome.storage.local.get(["tempAllowedSites"], async (storage) => {
        //     chrome.storage.local.set({ tempAllowedSites: storage.tempAllowedSites.push("THE SITE THEY ARE TRYING TO GO TO") });
        // })

        // Go to the page
        window.location.push(message.url)
    } else if (message.action == "always go") {
        // Add to a "permenant"" whitelist so we don't block this again
        await chrome.storage.local.get(["whiteListedSites"], async (storage) => {
            chrome.storage.local.set({ whiteListedSites: storage.whiteListedSites.push("THE SITE THEY ARE TRYING TO GO TO") });
        })

        // Go to the page
        window.location.push(message.url)
    }
});






const reloadOldPage = async () => {
    console.log("LOAD THE PAGE THEY WANTED")
}