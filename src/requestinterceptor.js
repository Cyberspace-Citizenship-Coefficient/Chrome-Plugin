// Setup 
chrome.runtime.onInstalled.addListener(async ()=>{
    chrome.storage.local.set({ 
        blackList: [],
        whiteList: [],
        
    });
});

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
            chrome.tabs.remove(tabId)
            // create warning page
            let opened = await chrome.tabs.create({url:'display.html?url='+URL, active: true})
            console.log(opened);
            setTimeout(()=> processing = false, 50)

            // chrome.scripting.executeScript({
            //     target: {tabId: tabId}, function: ()=>{
            //         console.log('on page?')
            //         document.body.innerHTML = '<p>Warning</p>'
            //     }
            // });
        }
    })
})

chrome.runtime.onMessage.addListener((message) => {
    console.log("GOT A MESSAGE")
	if (message.action == "leave") {
        // leave the page
        console.log("LEAVE")
	} else if (message.action == "go") {
        // Add to a temp whitelist so we don't annoy them
        // go ahead to that page
        console.log("GO")
    } else if (message.action == "always go") {
        // Add to a "permenant"" whitelist so we don't block this again
        // go ahead to that page
        console.log("ALWAYS GO")
    }
});