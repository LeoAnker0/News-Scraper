function loadAndCreateListForRules(listOfWebsitesToAdd) {
    //console.log("loadAndCreateListForRules")
    //console.log(listOfWebsitesToAdd)

    //set the src of the iframe to be empty
    let iframeObject = document.getElementById('MAINrulesRightIframeID');
    iframeObject.src = "";
    //declare the ul and li
    let websitesList = document.getElementById('MAINrulesLeftWebsitesListID');

    websitesList.innerHTML = "";

    //go through each item in the list and add them to the html ul as li's
    for (let i = 0; i < listOfWebsitesToAdd.length; i++) {
        let newListItem = document.createElement("li");

        newListItem.innerHTML = listOfWebsitesToAdd[i];
        newListItem.classList.add("MAINrulesLeft-li");

        websitesList.appendChild(newListItem);
    }


    /* create event listeners for when the check boxes are clicked, or perhaps move them elsewhere */
    let focusArticle = false
    let removeScripts = false
    let stylingFilter = false

    /* append all the conditions to an array/json */
    let checkboxesObject = {
        removeScripts,
        stylingFilter,
        focusArticle
    }
    checkboxesJson = JSON.stringify(checkboxesObject);
    //add event listeners
    const checkboxFocus = document.getElementById('focusArticle')
    checkboxFocus.checked = focusArticle

    const checkboxStyleFilter = document.getElementById('stylingFilter')
    checkboxFocus.checked = stylingFilter

    const checkboxRemoveScripts = document.getElementById('removeScripts')
    checkboxFocus.checked = removeScripts

    //focus article
    checkboxFocus.addEventListener("change", function() {
        if (this.checked) {
            // Checkbox is checked
            focusArticle = true
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);

        } else {
            // Checkbox is unchecked
            focusArticle = false;
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);

        }
    });
    //style filter
    checkboxStyleFilter.addEventListener("change", function() {
        if (this.checked) {
            // Checkbox is checked
            stylingFilter = true
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);

            let iframeObject = document.getElementById('MAINrulesRightIframeID');
            iframeObject.addEventListener('load', setIframeFontFamily('MAINrulesRightIframeID', 'Arial'));
            // changes the font of the iframes content, a bit silly...
            /*iframeObject.addEventListener('load', () => {
                setIframeFontFamily('MAINrulesRightIframeID', 'Arial');
            });*/
            // setIframeFontFamily('MAINrulesRightIframeID', 'Arial')

        } else {
            // Checkbox is unchecked
            stylingFilter = false
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);
            let iframeObject = document.getElementById('MAINrulesRightIframeID');
            iframeObject.removeEventListener('load', setIframeFontFamily('MAINrulesRightIframeID', 'Arial'));
            //and then remove this stuff
            resetIframeStyles('MAINrulesRightIframeID')

        }
    });
    //remove scripts
    checkboxRemoveScripts.addEventListener("change", function() {
        if (this.checked) {
            // Checkbox is checked
            removeScripts = true
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);

        } else {
            // Checkbox is unchecked
            removeScripts = false
            checkboxesObject = {
                removeScripts,
                stylingFilter,
                focusArticle
            }

            checkboxesJson = JSON.stringify(checkboxesObject);

        }
    });



    //now add detection for which item has been clicked
    //add event listeners to all the li's that can distinguish between them all
    websitesList.addEventListener("click", function(event) {
        if (event.target.nodeName === "LI") {
            let target = event.target;

            let url = event.target.textContent;

            sendLinkToPythonToBeDownloadedAndLoaded(url, checkboxesJson)
            /* implement some thing where if the checkboxesJSON hasn't changed since last, and the */
            async function sendLinkToPythonToBeDownloadedAndLoaded(url, checkboxesJson) {
                fetchWithCache(url, checkboxesJson);

            }




        }
    });
}