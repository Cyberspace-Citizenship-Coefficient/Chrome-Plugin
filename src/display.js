function findParam(param){
    debugger
    const all = window.location.search;
    const allParams = new URLSearchParams(all);  //allParams performs parsing function to find key parameters in line 5
    let response = allParams.get(param);  //response is now just the URL
     return response;
}
function leave()
{
    debugger
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "leave",
        url: sessionStorage.before || 'https://google.com'
    });
    window.location = findParam('url')
}

function go()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "go",
        url: findParam('url')+"?skip_interceptor" //setting flag so that the interceptor ignores this request
    });
    // window.location = findParam('url')+"?skip_interceptor" //setting flag so that the interceptor ignores this request
}

function alwaysGo()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "always go",
        url: findParam('url')+"?skip_interceptor" //setting flag so that the interceptor ignores this request
    });
    // window.location = findParam('url')+"?skip_interceptor" //setting flag so that the interceptor ignores this request

}

window.onload = function(){
    document.getElementById('DoNotVisitThisSite').addEventListener('click', leave);
    document.getElementById('VisitAnyways').addEventListener('click', go);
    document.getElementById('NeverBlockThisSite').addEventListener('click', alwaysGo);
}