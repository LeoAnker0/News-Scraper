/* this code intialises a cache for already asked pages, and then if they
are in and the parametres are the same will return the path that was asked before, 
else it will go and request a new one and update the cache

it has since been updated  so that this *module* also includes all that chunk of 
code that was sitting in app.js, in some function where it was just looking
cluttery, whereas here it's all in a quick easy place

 */

const requestCache = {};

function createCacheKey(url, jsonString) {
    return url + jsonString;
}

async function fetchWithCache(url, jsonString = '{}') {
    const params = JSON.parse(jsonString);
    const cacheKey = createCacheKey(url, jsonString);

    //console.log('Current cache:', requestCache);
    //console.log('Cache key for the current request:', cacheKey);

    if (requestCache[cacheKey]) {
        console.log("Returning cached result");

        const filePath = requestCache[cacheKey];
        let iframeObject = document.getElementById('MAINrulesRightIframeID');
        iframeObject.src = filePath

        //change the text of the preview site text
        let previewSiteLinkText = document.getElementById('MAINrulesRightIframeLinkText');

        previewSiteLinkText.innerText = url;


    } else {
        //const queryString = new URLSearchParams(params).toString();
        //const requestUrl = queryString ? `${url}?${queryString}` : url;

        console.log("Fetching new result");
        // Implement your own logic here for handling new requests.

        //dump in the function that deals with getting new links
        showLoader()
        togglePlaceholderStyles()
        async function downloadURLandReturnHTML(url, checkboxesJson) {
            htmlPath = await eel.downloadURLandReturnHTML(url, checkboxesJson)();

            return htmlPath
        }

        filePath = await downloadURLandReturnHTML(url, checkboxesJson)
        //console.log(filePath)

        //set the src of the iframe to this htmlPath
        let iframeObject = document.getElementById('MAINrulesRightIframeID');
        iframeObject.src = filePath

        //change the text of the preview site text
        let previewSiteLinkText = document.getElementById('MAINrulesRightIframeLinkText');

        previewSiteLinkText.innerText = url;


        hideLoader()
        togglePlaceholderStyles()


        const data = filePath; // Replace this with the actual data you fetched
        requestCache[cacheKey] = data;
    }
}



//calling the function
//fetchWithCache(url, jsonString);