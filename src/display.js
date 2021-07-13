function findParam(param){
    const all = window.location.search;
    const allParams = new URLSearchParams(all);
    return allParams.get(param);
}
function leave()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "leave",
        url: sessionStorage.before || 'https://google.com'
    });
}

function go()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "go",
        url: findParam('url')
    });
}

function alwaysGo()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "always go",
        url: findParam('url')
    });
}

window.onload = function(){
    document.getElementById('DoNotVisitThisSite').addEventListener('click', leave);
    document.getElementById('VisitAnyways').addEventListener('click', go);
    document.getElementById('NeverBlockThisSite').addEventListener('click', alwaysGo);
}