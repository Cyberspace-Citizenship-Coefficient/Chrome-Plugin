chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	// See that the tab is changing
    console.log(tabId)
    console.log(changeInfo)
    console.log(tab)
})