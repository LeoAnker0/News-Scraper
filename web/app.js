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
    siteTag.innerText = siteName;
    domainTag.innerText = siteURL;


    //console log stuff
    for (let i = 0; i <commands.length; i ++) {
        console.log(commands[i])
    }


}

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