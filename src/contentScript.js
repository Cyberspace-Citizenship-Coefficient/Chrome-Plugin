chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {hello: "world"})

document.addEventListener('contextmenu', e => {
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {
		outerHTML: e.target.outerHTML,
		path: e.path.map( x => {
			return {
				ID: x.id,
				localName: x.localName
			}
		})
	});
	console.log(e)
	console.log(e.path)
});