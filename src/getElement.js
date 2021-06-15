console.log('LOADED IN EMBEDDED SCRIPT TO GET RIGHT CLICK EVENTS')

document.addEventListener('contextmenu', e => {
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {greeting: "hello"});
	console.log(e)
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {greeting: "hello"}, function(response) {
		console.log(response.farewell);
	});
	
	console.log("SENT SOMETHING")
});