function findParam(param){
    const all = window.location.search;
    const allParams = new URLSearchParams(all);  //allParams performs parsing function to find key parameters in line 5
    let response = allParams.get(param);  //response is now just the URL
    return response;
}

const onClick(act) => {
	const dstURL = findParam('url');
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {
        action: act,
        url: dstURL.split('/')[2] 
    });
	//setting flag so that the interceptor ignores this request
	window.location.replace(dstURL + dstURL.includes("?") ? "&skip_interceptor" : "?skip_interceptor" )
}

window.onload = function(){
    document.getElementById('DoNotVisitThisSite').addEventListener('click', () => {
		window.history.back()
	});
	document.getElementById('VisitAnyways').addEventListener('click', () => {
		onClick("go")
	});
	document.getElementById('NeverBlockThisSite').addEventListener('click', () => {
		onClick("always go")
	});
	document.getElementById('GoToGoogle').addEventListener('click', () => {
		window.location.replace('https://www.google.com');
	});
	const baseURL = findParam('url');
	document.getElementById('site_url').innerHTML = baseURL.split('/')[2];
}