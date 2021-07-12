function leave()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "leave"
        document.getElementById("leave").innerHtml = sessionStorage.getItem("$backwardurl")
    });
}

function go()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "go"
        document.getElementById("go").innerHtml = sessionStorage.getItem("$forwardurl")
    });
}

function alwaysGo()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "always go"
        document.getElementById("always go").innerHtml = sessionStorage.getItem("$forwardurl")
    });
}

window.onload = function(){
    document.getElementById('DoNotVisitThisSite').addEventListener('click', leave);
    document.getElementById('VisitAnyways').addEventListener('click', go);
    document.getElementById('NeverBlockThisSite').addEventListener('click', alwaysGo);
}