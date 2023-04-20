function myFunction() {
    var input = document.getElementById("input").value;
    eel.python_function(input)(function(ret) {
        alert(ret);
    });
}


const pageHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
);

document.documentElement.style.setProperty('--page-height', pageHeight + 'px');




//get scrapeListConfig.json-- actually tell python to get the config file, or
//tell python to get scrapeListConfig.json


async function getFileFromPython(wantedFile) {
    const file = await eel.sendFile(wantedFile)();
    //console.log(file);
    return file;
}

function processAllItemsInJson(jsonFile) {
    const jsonObject = JSON.parse(jsonFile);

    //add the websites to an array
    let arrayOfWebsiteNames = []
    for (const website of jsonObject.websites) {
        //console.log(website.name);
        arrayOfWebsiteNames.push(website.name);
    }

    //add all the website names to the list in index.html
    //keep track of all these items inside the li array by creating one of
    //those fancy pancy dom objects arrays or something

    //add the websites to the dispaly
    let websitesList = document.getElementById('websitesListID');
    for (let i = 0; i < arrayOfWebsiteNames.length; i++) {
        let newListItem = document.createElement("li");

        newListItem.innerHTML = arrayOfWebsiteNames[i];

        websitesList.appendChild(newListItem)
    }

    //add event listeners to all the li's that can distinguish between them all
    websitesList.addEventListener("click", function(event) {
        if (event.target.nodeName === "LI") {
            let target = event.target;

            let name = event.target.textContent;
            //event.target.textContent = "cheese"
            //console.log("the ", clickedText, " element was clicked")

            //get the json of that name
            let jsonOfLI = jsonObject.websites.find(function(obj) {
                return obj.name === name;
            });

            hashChange = "rules" + "#" + name

            //console.log(jsonOfLI)
            //call function that clears the current page and loads the json rules 
            //editing page
            //loadEditJsonPage(jsonOfLI)
            window.history.pushState(null, null, hashChange);
            //window.location.hash = hashChange;


        }
    });

}


//function for loading up the editing pane
async function loadEditJsonPage(name) {
    //declare consts
    const mainJson = "scrapeListConfig.json";

    //get the config.json from python
    const jsonFile = await getFileFromPython(mainJson);

    const jsonObject = JSON.parse(jsonFile);
    let jsonOfLI = jsonObject.websites.find(function(obj) {
        return obj.name === name;
    });


    console.log(jsonOfLI);



    //load the details into view
    //get the name and domain name
    //get the elements in the html
    //change the elements inner text to being what it's supposed to be
    let siteName = jsonOfLI.name;
    let siteURL = jsonOfLI.url;
    let siteURLforLinks = jsonOfLI.urlForLinks;
    let commands = jsonOfLI.commands;

    let siteTag = document.getElementById('contentBoxSiteName');
    let domainTag = document.getElementById('contentBoxDomainName');

    //change it in the hmtl view
    //siteTag.innerText = siteName;
    //domainTag.innerText = siteURL;

    /*
    //console log stuff
    for (let i = 0; i <commands.length; i ++) {
        console.log(commands[i])
    }
    */




    //dealing with the websites list stuff...
    listOfWebsitesToAdd = ['https://www.dr.dk/nyheder/indland/kirkeminister-er-stadig-ikke-klar-til-aendre-regel-om-kvindelige-praester-kan', 'https://www.dr.dk/nyheder/udland/loekke-efter-omstridt-macron-udtalelse-jeg-ville-selv-have-udtrykt-mig-paa-en', 'https://www.dr.dk/nyheder/indland/alvorligt-syge-tarmkraeftpatienter-blev-fejlinformeret-om-livsvigtig-operation-i', 'https://www.bbc.co.uk/news/live/world-us-canada-65270164', 'https://www.nrk.no/sport/nrk-erfarer_-age-hareide-blir-islandsk-landslagssjef-1.16372979', 'https://www.svt.se/nyheter/utrikes/ung-man-pekas-ut-ska-ligga-bakom-lackan-av-hemliga-dokument']
    loadAndCreateListForRules(listOfWebsitesToAdd)
    /*
    lets do this all in a new function, for cleanliness
    */

    //create a fake list here first for testing purposeses
    /*make sure it so that you use a list to populate another list, since this will be the 
    most easy to make work when we integrate it with the other parts*/

    //make that list populate the list in html

    //make sure that there are either two well linked lists, or that there's some way of better
    ///represeting the data, since i would like to be able to show how the link shows up in 
    ///the scraper, whilst also being able to actually link them into being, so i will need to
    ///have some system that checks wether they have a https already, or not, and then apply a valid
    ///a valid pre-https for them.

    //make a simple function that when one of those links is clicked will then tell the python
    ///to download the file, and then to add the html to temp-downloads.
    ///and ideally it should only have to download a specifc link once
    ///and also it should be relatively snappy, so therefore we might need to use the requests library
    ///instead of selenium, since selenium is slow, but i can try benchmarking that before i say anything
    ///particularly rash

    //then the local cached version should be set as the path for the previewing iframe
    ///this should make the rules be hidden

    /*and then after we should start adding the functionality where we can actually cached a real
    version of the file that we want to scrape the links from, and then we can start doing all the 
    rules things and so on, but we can get this key piece of infrastructure up and running first*/



}

function setIframeFontFamily(iframeId, fontFamily) {
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const style = iframeDocument.createElement('style');
    style.id = 'custom-style'; // Add an ID to the style element for easier removal
    style.textContent = `* { background-color: transparent !important; color: white !important; }`;

    iframeDocument.head.appendChild(style);
}

function resetIframeStyles(iframeId) {
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const style = iframeDocument.getElementById('custom-style'); // Get the style element by its ID

    if (style) {
        iframeDocument.head.removeChild(style); // Remove the style element
    }
}

function loadAndCreateListForRules(listOfWebsitesToAdd) {
    console.log("loadAndCreateListForRules")
    console.log(listOfWebsitesToAdd)

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


    /* check styling filter and execute */
    //console.log(checkboxesJson)
    const reCheckVariables = document.getElementById("reCheckVariables");

    reCheckVariables.addEventListener("click", function() {
        // Code to run when the div is clicked
        //console.log("The div with id reCheckVariables was clicked.");
        checkboxesObject = {
            removeScripts,
            stylingFilter,
            focusArticle
        }

        checkboxesJson = JSON.stringify(checkboxesObject);

        //console.log(checkboxesJson)

        /* recheck stylingFilter */
    });


    //now add detection for which item has been clicked
    //add event listeners to all the li's that can distinguish between them all
    websitesList.addEventListener("click", function(event) {
        if (event.target.nodeName === "LI") {
            let target = event.target;

            let url = event.target.textContent;

            //console.log(url)
            //console.log(checkboxesJson)


            sendLinkToPythonToBeDownloadedAndLoaded(url, checkboxesJson)

            //create an async function that can deal with the python/time delay stuff





        }
    });
}


function showLoader() {
    var loader = document.getElementById("loader");
    loader.classList.add("show");
}

function hideLoader() {
    var loader = document.getElementById("loader");
    loader.classList.remove("show");
}

function togglePlaceholderStyles() {
    var placeholder = document.querySelector('.MAINrulesRight-iFrame-placeholder');

    if (placeholder.classList.contains('filter-applied')) {
        // Remove the filter class to remove the filter
        placeholder.classList.remove('filter-applied');
    } else {
        // Add the filter class to apply the filter
        placeholder.classList.add('filter-applied');
    }
}

/* implement some thing where if the checkboxesJSON hasn't changed since last, and the 
async function sendLinkToPythonToBeDownloadedAndLoaded(url, checkboxesJson) {
    page has already been accessed this session, then go open the last requested version of the url
    rather then getting a whole new one for this call, 

    so perhaps we hash the checkboxesJson, and then we compare and contrast, and then we will have 
    to make a json to store that locally with requested urls, and if they have been requested already
    so i guess i will have to look up how to store something for only an open window

    and then if it has already been called this session, without changes, then send back the last 
    previously used url, else just go through the process of requesting a new one
    */
fetchWithCache(url, checkboxesJson);

}


/* for loading in the main pane */
async function loadMainPane() {
    let configFile = ""

    //declare consts
    const mainJson = "scrapeListConfig.json";

    //get the config.json from python
    configFile = await getFileFromPython(mainJson);
    //console.log("config file: ", configFile);

    //now go through the json file for all items in the websites list
    processAllItemsInJson(configFile)

}


//really this should be done in an orchestrator function or file, but i'll just call it from here for now
//loadMainPane
loadMainPane()






var iframe = document.getElementById('MAINrulesRightIframeID');

// Wait for the iframe to load
iframe.addEventListener('load', function() {
    // Overwrite the console.log method of the iframe's document to a no-op function
    iframe.contentWindow.console.log = function() {};
});










//