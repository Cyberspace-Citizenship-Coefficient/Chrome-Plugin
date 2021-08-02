// Send to the plugin all elements that are right clicked on
document.addEventListener('contextmenu', e => {
	// Send messages to ourself
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {
		outerHTML: e.target.outerHTML, // Grab the HTML
		path: e.path.map( x => {
			return {
				ID: x.id, // HTML ID
				localName: x.localName // This is a HTML type for some reason
			}
		}) ,// rebuild the array of how to find the element
		action: "Right Click"
	});
});
