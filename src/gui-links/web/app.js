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


    //console.log(jsonOfLI);



    let siteName = jsonOfLI.name;
    let siteURL = jsonOfLI.url;
    let siteURLforLinks = jsonOfLI.urlForLinks;
    let commands = jsonOfLI.commands;

    /*send this domain to python, for it to create a download of it, and return all links*/
    let listOfWebsitesToAddJSONstring = await createSeleniumCacheOfSiteAndRequestLinks(siteURL);
    let listOfWebsitesToAddJSONobject = JSON.parse(listOfWebsitesToAddJSONstring);
    let listOfWebsitesToAdd = listOfWebsitesToAddJSONobject.linksArray;

    console.log("listOfWebsitesToAdd: ", listOfWebsitesToAdd)




    //dealing with the websites list stuff...
    //listOfWebsitesToAdd = ['https://www.dr.dk/nyheder/indland/kirkeminister-er-stadig-ikke-klar-til-aendre-regel-om-kvindelige-praester-kan', 'https://www.dr.dk/nyheder/udland/loekke-efter-omstridt-macron-udtalelse-jeg-ville-selv-have-udtrykt-mig-paa-en', 'https://www.dr.dk/nyheder/indland/alvorligt-syge-tarmkraeftpatienter-blev-fejlinformeret-om-livsvigtig-operation-i', 'https://www.bbc.co.uk/news/live/world-us-canada-65270164', 'https://www.nrk.no/sport/nrk-erfarer_-age-hareide-blir-islandsk-landslagssjef-1.16372979', 'https://www.svt.se/nyheter/utrikes/ung-man-pekas-ut-ska-ligga-bakom-lackan-av-hemliga-dokument']
    loadAndCreateListForRules(listOfWebsitesToAdd);

}

async function createSeleniumCacheOfSiteAndRequestLinks(url) {
    //start loading animation
    showLoader()
    const linksJson = await eel.createSeleniumCacheOfSiteAndRequestLinks(url)();
    //stop loading animation
    hideLoader()
    return linksJson;
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
















//