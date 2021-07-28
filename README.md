# Chrome-Plugin

## [Intercept the Requests](https://gist.github.com/JAStanton/3490cf799a0d184cedd7)

### ToDo:
- [ x ] Get the buttons working 100%
    - [x] Go back brings us to the last loaded page
    - [x] The other two bring us to the desired page
- [ x ] Store the whitelist for all of time (?) and make sure we consult it 
- [ x ] Use a local cache 
    - [ x ] Store the temp whitelist (for this session)
    - [ x ] Store the red/blockedSites list (for this session)
    - [ x ] Store the yellow/warnedSites list (for this session)
    - [ x ] Store the green/whiteListed Sites list (for this session)
- [ x ] Clear the local caches
    - Stretch ish, only needed for MVP  //this goal might not be necessary as once we close Chrome and open it up again then the local cache will be cleared

- [ x ] Hit the newest lambda to see if the sites are good, bad, or ugly 
    - Waiting for other work, just fake it for now

### Notes:
1) We want to keep the tab's history in tact so people can hit the back button after this runs


https://developer.chrome.com/docs/extensions/reference/action/

https://stackoverflow.com/questions/5642603/how-can-i-get-the-element-that-was-right-clicked-via-a-google-chrome-context-men 

https://groups.google.com/a/chromium.org/g/chromium-extensions/c/th776vlEc2Y 

https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions

https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/apps/samples/context-menu/main.js

https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication

https://stackoverflow.com/questions/21497781/how-to-change-chrome-packaged-app-id-or-why-do-we-need-key-field-in-the-manifest/21500707#21500707
