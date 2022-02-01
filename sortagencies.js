
class ClassWatcher {
    // ClassWatcher(document.body: element, css class, function to execute on class change)

    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallBack) {

        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallBack = classRemovedCallBack
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, { attributes: true })
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.classAddedCallback()
                    }
                    else{
                        this.classRemovedCallBack()
                    }
                }
            }
        }
    }
}

// Converts call back to a promise
const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}

// Class to be called for popup.js to get the chrome.storage.local object
class GetStorageItems{

    // Get the storage object by key
    static getItemFromKey = (key) => {
            return toPromise((resolve, reject) => {
                chrome.storage.local.get([key], (result) => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);

                    resolve(result);
                });
            });
        }
    }


function addAgenciesBtnClickEventListener(agencies_element){

    //We only want to take action when the button is clicked. 
    const agency_select_btn = document.querySelector('.set-agency-select-button');
    agency_select_btn.addEventListener('click', sort_agencies)
    // agencies_element.removeEventListener(agencies_element);
}

function setChromeStorage(){

    // Get information about the active agency

    const active_agency = JSON.parse(window.localStorage.ACTIVE_AGENCY)

    const local_storage = {
        'origin': window.origin,
        'active_agency_id': active_agency.id,
        'active_agency_pid': active_agency.primary_account_id,
        'active_agency_name': active_agency.name,
        'token': window.localStorage.access_token
    }

    // Set local storage object in chrome storage
    chrome.storage.local.set({'local_storage': local_storage}, function() {
        return true
      });
    
}

function sort_agencies(event) 
{

    // Get all the buttons in the drop down list, each button has text content
    // which reprsents the agency name.
    const dropdown_items = document.querySelectorAll('button.dropdown-item');

    // Order the drop down by their textContent and filter out any non gdh dropdown agency options
    const ordered_agencies = [].slice.call(dropdown_items).filter(x => x.id.includes('gdh') == true).sort(function (a, b) {
         return a.textContent > b.textContent ? 1 : -1; });

    // Get the agency drop items
    const agencies = document.querySelector('.agency-dropdown-items');

    
    // Append Child replace the node if it already exists
    ordered_agencies.forEach(element => {
        agencies.appendChild(element)
    });

}

function workOnClassAdd() {

    // Add an event listener for when nodes get added to the list

    const agencies = document.querySelector('.agency-dropdown-items.dropdown-menu');

    // Add set-agency-select-button listener after because button does not exist
    // unit user selects button
    if (agencies){

        agencies.addEventListener('DOMNodeInserted', addAgenciesBtnClickEventListener(agencies))

    }
}


//When the document is ready then watch the body to see when modal is open
if (document.readyState === "complete" || document.readyState === "interactive") {

    // watch for a specific class change
    const classWatcher = new ClassWatcher(document.body, 'modal-open', workOnClassAdd, setChromeStorage);

    setChromeStorage();

}
