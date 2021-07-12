function leave()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "leave"
    });
}

function go()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "go"
    });
}

function alwaysGo()
{
    chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch",
    {
        action: "always go"
    });
}

window.onload = function(){
    document.getElementById('DoNotVisitThisSite').addEventListener('click', leave);
    document.getElementById('VisitAnyways').addEventListener('click', go);
    document.getElementById('NeverBlockThisSite').addEventListener('click', alwaysGo);
}