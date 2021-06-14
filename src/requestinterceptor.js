chrome.runtime.onInstalled.addListener(async ()=>{
    const display = chrome.runtime.getUrl("display.html");
    const tab = chrome.tabs.create({display});
    
})