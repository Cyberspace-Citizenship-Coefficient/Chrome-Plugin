let processing = false;
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // See that the tab is changing
    // console.log(tabId)
    // console.log(changeInfo)
    // console.log(tab)


    const URL = tab.url.split('/')[2]
    await chrome.storage.local.get(["blockedSites", "warnedSites"], async (storage) => {
        if (!processing && (storage.warnedSites.find(x => URL.includes(x)) || storage.blockedSites.find(x => URL.includes(x)))) {
            processing = true;
            // close target
            // TODO: Save off the old page OR make this change what the tab loads
            chrome.tabs.remove(tabId)
            // create warning page
            let opened = await chrome.tabs.create({ url: 'display.html', active: true })
            console.log(opened);
            setTimeout(() => processing = false, 50)
        }
    })
})

chrome.runtime.onMessage.addListener((message) => {
    console.log("GOT A MESSAGE")

    $backwardurl = history.back(); //Go to the previous page
    $forwardurl = history.forward(); //Go to the next page in the stack

    //Store
    sessionStorage.setItem("LEAVE", "$backwardurl")
    sessionStorage.setItem("Go", "$forwardurl")
    sessionStorage.setItem("Always Go", "$forwardurl")

    //Retrieve
    document.getElementById("result").innerHTML = sessionStorage.getItem("$url");
    
    if (message.action == "leave") {
        // leave the webpage
        console.log("LEAVE")
    } else if (message.action == "go") {
        // Add to a temp whitelist so we don't annoy them
        await chrome.storage.local.get(["tempAllowedSites"], async (storage) => {
            chrome.storage.local.set({ tempAllowedSites: storage.tempAllowedSites.push("THE SITE THEY ARE TRYING TO GO TO") });
        })

        // Go to the page
        reloadOldPage()
    } else if (message.action == "always go") {
        // Add to a "permenant"" whitelist so we don't block this again
        await chrome.storage.local.get(["whiteListedSites"], async (storage) => {
            chrome.storage.local.set({ whiteListedSites: storage.whiteListedSites.push("THE SITE THEY ARE TRYING TO GO TO") });
        })

        // Go to the page
        reloadOldPage()
    }
});






const reloadOldPage = async () => {
    console.log("LOAD THE PAGE THEY WANTED")
}