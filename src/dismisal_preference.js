chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if (!!request.message && request.message == 'dont_show_again_preference'){
        //insert preference value into storage
        chrome.storage.local.set({dont_show_again_preference: request.value})
    }
})