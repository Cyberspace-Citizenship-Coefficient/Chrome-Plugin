//chrome.runtime.onInstalled.addListener(async ()=>{
//    const display = chrome.runtime.getUrl("display.html");
//    const tab = chrome.tabs.create({display});
//
//})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	// See that the tab is changing
    console.log(tabId)
    console.log(changeInfo)
    console.log(tab)
    const URL = tab.url.split('/')[2]
    await chrome.storage.local.get(["blockedSites", "warnedSites"], async (storage) => {
        if (storage.warnedSites.find(x => URL.includes(x)) || storage.blockedSites.find(x => URL.includes(x))) {
            // close target
            chrome.tabs.remove(tabId)
            // create warning page
            let opened = await chrome.tabs.create({url:'display.html', active: true})
            console.log(opened);
            

            // chrome.scripting.executeScript({
            //     target: {tabId: tabId}, function: ()=>{
            //         console.log('on page?')
            //         document.body.innerHTML = '<p>Warning</p>'
            //     }
            // });
        }
    })
})