let processing = false;

// example listeners
//listerners are like detectives waiting for a sound(event trigger) so they can do some action(listerner callback/event handler)
// }

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // See that the tab is changing
    // console.log(tabId)
    // console.log(changeInfo)
    // console.log(tab)
    const URL = tab.url.split('/')[2]
    const protocol = tab.url.split('/')[0]  // can work with any protocol (e.g. https, http, ftp, ws etc.)

    if (tab.url.includes('skip_interceptor')) {
        debugger;
        console.log("trigger interceptor skip");
        return;
    }

    if (tab.status != "loading")
        return

    await chrome.storage.local.get(["blockedSites", "warnedSites", "whiteListedSites","tempAllowedSites"], async (storage) => {
        const isWhitelisted = storage.whiteListedSites.filter(x => x.includes(URL)).length > 0;
        const isWarnedSite = storage.warnedSites.find(x => {
            return URL.includes(x)
        }) ?? false;
        const isBlockedSite = storage.blockedSites.find(x => URL.includes(x)) ?? false;
        const isTempAllowedSite = storage.tempAllowedSites.find(x => URL.includes(x)) ?? false;

        debugger
        if (!processing && (!isWhitelisted || !isTempAllowedSite ) && (isWarnedSite || isBlockedSite)) {
            console.log('interceptor for blocked and warnedsites triggered');

            processing = true;
            // close target
            // TODO: Save off the old page OR make this change what the tab loads
            chrome.tabs.remove(tabId)
            // create warning page
            let opened = await chrome.tabs.create({ url: 'display.html?url=' + protocol + '//' + URL, active: true })
            console.log(opened);
            setTimeout(() => processing = false, 50)
        } else if (!processing) {
            // sessionStorage.setItem('before', URL);
        }
    })
})


chrome.runtime.onMessage.addListener(async (message) => {
    console.log("GOT A MESSAGE")
    if (message.action == "leave") {
        debugger
        // leave the webpage
        console.log("LEAVE")
        // window.location.push(message.url)
        chrome.storage.local.get(['blockedSites'], ({ blockedSites }) => {
            blockedSites.push(message.url)
            chrome.storage.local.set({ blockedSites })
        })
        chrome.tabs.update(undefined, { url: message.url });
    } else if (message.action == "go") {


        // Add to a temp whitelist so we don't annoy them
        chrome.storage.local.get(["tempAllowedSites"], async (storage) => {
            storage.tempAllowedSites.push(message.url) //remove https/ http and ?skip_inter
            chrome.storage.local.set({ tempAllowedSites: storage.tempAllowedSites });
        })

        // Go to the page
        // window.location.push(message.url)
        console.log(message);
        chrome.tabs.update(undefined, { url: message.url });
    } else if (message.action == "always go") {
        // Add to a "permenant"" whitelist so we don't block this again
        chrome.storage.local.get(["whiteListedSites"], async (storage) => { //retrieves whiteListedSites from local storage
            storage.whiteListedSites.push(message.url)  //update the whiteListedSites with a new entry 
            chrome.storage.local.set({ whiteListedSites: storage.whiteListedSites });  //saving whiteListedSites back into the database
        })


        chrome.tabs.update(undefined, { url: message.url });
    }
});


const reloadOldPage = async () => {
    console.log("LOAD THE PAGE THEY WANTED")
}