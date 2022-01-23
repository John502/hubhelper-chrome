
class ClassWatcher {
    // ClassWatcher(document.body: element, css class, function to execute on class change)

    constructor(targetNode, classToWatch, classAddedCallback) {

        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
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
                    else {
                        this.classRemovedCallback()
                    }
                }
            }
        }
    }
}

function addAgenciesBtnClickEventListener(){

    //We only want to take action when the button is clicked. 
    var agency_select_btn = document.querySelector('.set-agency-select-button');
    agency_select_btn.addEventListener('click', sort_agencies)

}

function sort_agencies(event) 
{

    // Get all the buttons in the drop down list, each button has text content
    // which reprsents the agency name.
    var dropdown_items = document.querySelectorAll('button.dropdown-item');

    // Order the drop down by their textContent
    var ordered_agencies = [].slice.call(dropdown_items).sort(function (a, b) {
         return a.textContent > b.textContent ? 1 : -1; });
    
    // Get the agency drop items
    var agencies = document.querySelector('.agency-dropdown-items');


    // Append Child replace the node if it already exists
    ordered_agencies.forEach(element => {
        agencies.appendChild(element)
    });

}

function workOnClassAdd() {

    // Add an event listener for when nodes get added to the list

    var agencies = document.querySelector('.agency-dropdown-items.dropdown-menu');

    // Add set-agency-select-button listener after because button does not exist
    // unit user selects button
    agencies.addEventListener('DOMNodeInserted', addAgenciesBtnClickEventListener)
}


//When the document is ready then watch the body to see when modal is open
if (document.readyState === "complete" || document.readyState === "interactive") {

    // watch for a specific class change
    let classWatcher = new ClassWatcher(document.body, 'modal-open', workOnClassAdd);

}


