var s = document.createElement('script');
s.src = chrome.runtime.getURL('getElement.js');
//s.onload = function() {
//    this.remove();
//};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {hello: "world"})