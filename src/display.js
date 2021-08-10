// Get the URL from the site parameters
function findParam(param){
    const allParams = new URLSearchParams(window.location.search);  //allParams performs parsing function to find key parameters in line 5
    let response = allParams.get(param);  //response is now just the URL
    return response;
}

// Continue on to the site and inform the plugin
const onClick = (act) => {
	const dstURL = findParam('url');
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {
        action: act,
        url: dstURL.split('/')[2] 
    });
	//setting flag so that the interceptor ignores this request
	window.location.replace(dstURL + (dstURL.includes("?") ? "&skip_interceptor" : "?skip_interceptor"))
}

// Add functionality to the buttons
window.onload = function(){
	// Go to the previous site
    document.getElementById('DoNotVisitThisSite').addEventListener('click', () => {
		window.history.back()
	});
	// Go to the site and tell the plugin not to block it "today"
	document.getElementById('VisitAnyways').addEventListener('click', () => {
		onClick("go")
	});
	// Go to the site and tell the plugin not to block it ever
	document.getElementById('NeverBlockThisSite').addEventListener('click', () => {
		onClick("always go")
	});
	// Go to google
	document.getElementById('GoToGoogle').addEventListener('click', () => {
		window.location.replace('https://www.google.com');
	});
	// Load the URL we blocked into the webpage itself 
	const baseURL = findParam('url');
	document.getElementById('site_url').innerHTML = baseURL.split('/')[2];
}