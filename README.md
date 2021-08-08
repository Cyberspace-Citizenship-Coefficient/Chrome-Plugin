# Chrome-Plugin

## Base Files

### [main.js](./src/main.js)
This is the entry point of the chrome plugin.
It pulls in all of the other scripts.
1) [setup.js](./src/setup.js)
1) [requestinterceptor.js](./src/requestinterceptor.js)
1) [rightClick.js](./src/rightClick.js)
1) [siteQualityMapping.js](./src/siteQualityMapping.js)

### [setup.js](./src/setup.js)
This registers the install of the plugin with the service.
It also initalizes the memory for the plugin.

## Infraction Reporting Scripts

### [contentScript.js](./src/contentScript.js)
This file is loaded as a background worker on all web pages. 
It is used to tell the remainder of the plugin what element was most recently right clicked on. 
It has access to the DOM, but none of the internal information on the website. 

### [rightClick.js](./src/rightClick.js)
Maps the menu buttons based on what the service tells it can be reported.
Sends infractions to the service.

## Blocking of Bad Sites

### [siteQualityMapping.js](./src/siteQualityMapping.js)
Sets the color of the icon in the toolbar based on the quailty of the site.

### [requestinterceptor.js](./src/requestinterceptor.js)
When a tab is changed, it checks to see if the site should or should not be blocked and acts accordingly.
Also, this script maintains the session and install level whitelists for sites. 

### [display.html](./src/display.html)
This is the web page that is shown to block users from loading bad actors.

### [display.js](./src/display.js)
This is the script that makes the [display.html](./display.html) function. 

# Workflow
## Install
[setup.js](./src/setup.js) registers the plugin with the service and initalizes memory

[rightClick.js](./src/rightClick.js) gets the available infractions from the service and maps them locally 

## Open a new browser window
[rightClick.js](./src/rightClick.js) gets the available infractions from the service and maps them locally 

## Close all chrome windows
[setup.js](./src/setup.js) resets session level memory of bad actors and temporarially allowed sites 

## Load a site
1) [requestinterceptor.js](./src/requestinterceptor.js) checks to see if the site is a bad actor
	- If so, [blocks the site](#site-is-blocked)
1) If the site is not blocked, [siteQualityMapping.js](./src/siteQualityMapping.js) will set the color of the icon based on the reported quality of the site
	
## Site is bocked
1) [display.html](./src/display.html) is loaded
	1) Users can return to the preious site
	1) Users can go to the site anyways
		- The site is added to a session long whitelist of sites to not block
	1) Users can ask that the site is never blocked
		- The site is added to a "permanent" whitelist of sites to not block
	1) Users can be redirected to the google homepage
	
## An infraction is reported
[rightClick.js](./src/rightClick.js) sends the infraction to the service for validation, then marks the site as yellow
