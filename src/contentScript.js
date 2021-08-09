chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		
		// alert(request.message);
		if (!!request.dont_show_again_preference && request.dont_show_again_preference){ 
			return ;
		}
		
		//show pop up if dont_show_again_preference is false
		let popup = makePopHtml(request.message)
		injectPopup(popup)
	}
);

function injectPopup(popup) {//insert the popup into DOM
	document.querySelector('body').appendChild(popup)
	setupDismissalListeners();
}

function ejectPopup() {//remove popup from DOM
	document.querySelector('.ccc_popup_wrapper').remove();
}


function makePopHtml(message) {
	let temp_popup = `
	<div class="ccc_popup_frame" style="position: fixed;top: 0px;left: 0px;right: 0px;bottom: 0px;display: grid;place-items: center;z-index: 2;background-color: rgb(169, 169, 197);">
	<div class="ccc_popup_card" style="height: 400px;    width: 500px;    display: flex;    flex-direction: column;    border-radius: 10px;    box-shadow:2px 2px 7px 1px grey;">

		<span class="ccc_popup__title" style="height: 20%;color: black;border-bottom: 1px solid red;text-align: start;padding: 10px;">
			<h1>Infraction submitted</h1>
		</span>
		<div class="ccc_popup__body" style=" height: 80%;padding: 10px;">
			${message}
		</div>
		<div class="ccc_popup_actions" style="height: 20%;border-top: 1px solid red;padding:10px;display: flex;justify-content: flex-end;gap: 15px;">
			<button class="ccc_btn_dont_show" style="padding: 10px 40px;border-radius: 5px;">Dont show again</button>
			<button class="ccc_btn_dismiss"  style="padding: 10px 40px;border-radius: 5px;">Dismiss</button>
		</div>
	</div>
</div>
	`

	let wrapper = document.createElement('div')
	wrapper.classList.add('ccc_popup_wrapper')
	wrapper.innerHTML = temp_popup;
	return wrapper;
}


function setupDismissalListeners(){	
	let DISMISAL_LISTENERS = {
		ccc_btn_dont_show: true,
		ccc_btn_dismiss: false
	}

	for (const [key,value] of Object.entries(DISMISAL_LISTENERS)) {
		document.querySelector('.'+key).addEventListener('click',()=>{
			dismissPopup(value);
		})
	}

}
function dismissPopup(dont_show_again) {
	ejectPopup();
	sendDismissalPreference( dont_show_again )
}


function sendDismissalPreference( dont_show_again = false ) {
	chrome.runtime.sendMessage({ message: "dont_show_again_preference", value: dont_show_again })
}

// Send to the plugin all elements that are right clicked on
document.addEventListener('contextmenu', e => {
	// Send messages to ourself
	chrome.runtime.sendMessage("afffkcmpebnikjnoagiiofainbpffnch", {
		outerHTML: e.target.outerHTML, // Grab the HTML
		path: e.path.map( x => {
			return {
				ID: x.id, // HTML ID
				localName: x.localName // This is a HTML type for some reason
			}
		}) ,// rebuild the array of how to find the element
		action: "Right Click"
	});
});