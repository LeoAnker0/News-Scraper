//catches all the changes to the url/history
function onHistoryChange(callback) {
    var currentState = getCurrentState();

    function handleStateChange(event) {
        var newState = getCurrentState();
        if (newState !== currentState) {
            currentState = newState;
            callback(currentState);
        }
    }

    function handleHashChange() {
        var newState = getCurrentState();
        if (newState !== currentState) {
            currentState = newState;
            callback(currentState);
        }
    }

    function handlePathChange() {
        var newState = getCurrentState();
        if (newState !== currentState) {
            currentState = newState;
            callback(currentState);
        }
    }

    function getCurrentState() {
        return {
            state: history.state,
            hash: getHashState(),
            path: window.location.pathname
        };
    }

    function getHashState() {
        var hash = window.location.hash;
        if (hash.startsWith("#")) {
            return hash.slice(1);
        }
        return null;
    }

    window.addEventListener("popstate", handleStateChange);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("pushstate", handlePathChange);
    window.addEventListener("replacestate", handlePathChange);

    return function() {
        window.removeEventListener("popstate", handleStateChange);
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("pushstate", handlePathChange);
        window.removeEventListener("replacestate", handlePathChange);
    };
}
// Call onHistoryChange with your callback function
onHistoryChange(function(state) {
    //console.log("History state changed to:", state["path"]);
    var currentPath = state["path"];
    var currentHash = state["hash"];
    var parts = currentPath.split("/");
    var partOne = parts[1];
    console.log(currentPath)
    if (currentPath == "/main") {
        buildPANEmain()
    }
    if (currentPath == "/rules") {
        buildPANEaddRules(currentHash)
    }
});


// Override pushState() method to trigger custom event
const originalPushState = history.pushState;
history.pushState = function(state) {
    originalPushState.apply(this, arguments);
    const event = new Event('pushstate');
    event.state = state;
    window.dispatchEvent(event);
};




//functions for loading individual pages
async function buildPANEmain() {
    //set the class of PANEhome to fullScreenVisible
    //and the other panes to fullScreenHidden
    const PANEhome = document.getElementById('PANEhome');
    const PANEaddRules = document.getElementById('PANEaddRules');
    PANEhome.classList.add('fullScreenVisible')
    PANEhome.classList.remove('fullScreenHidden')

    PANEaddRules.classList.add('fullScreenHidden')
    PANEaddRules.classList.remove('fullScreenVisible')

    //clear all the content inside, which isn't made by this function
    removeListItemsById('websitesListID');
    loadMainPane()
}

//functions for loading individual pages
async function buildPANEaddRules(websiteName) {
    //set the class of PANEaddRules to fullScreenVisible
    //and the other panes to fullScreenHidden
    const PANEhome = document.getElementById('PANEhome');
    const PANEaddRules = document.getElementById('PANEaddRules');

    PANEaddRules.classList.add('fullScreenVisible')
    PANEaddRules.classList.remove('fullScreenHidden')

    PANEhome.classList.add('fullScreenHidden')
    PANEhome.classList.remove('fullScreenVisible')
    loadEditJsonPage(websiteName)
    //remove hash from url
    //remove all the items inside the li

}

//clearing all items inside the li's
async function removeListItemsById(id) {
  const list = document.getElementById(id);
  if (!list) {
    console.error(`No element with ID "${id}" found`);
    return;
  }
  const items = list.querySelectorAll('li');
  for (let i = 0; i < items.length; i++) {
    await new Promise(resolve => {
      setTimeout(() => {
        items[i].remove();
        resolve();
      }, 1);
    });
  }
}







window.onload = function() { 
    window.history.pushState(null, null, "main");
}

