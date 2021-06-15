console.log('LOADED IN EMBEDDED SCRIPT TO GET RIGHT CLICK EVENTS')

document.addEventListener('contextmenu', e => {
	//chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", e);
	console.log(e)
});

