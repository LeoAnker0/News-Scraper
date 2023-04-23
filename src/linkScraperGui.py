import json
import fnmatch
import random
#import datetime
import os
import string
from bs4 import BeautifulSoup

#import sys
#sys.path.append('web/temp-downloads')
#import emptyCache

import eel
from htmlDownloader import downloadAndProcessPageToFile
from scrapeForLinks import filterForScraperRules


@eel.expose
def python_function(input):
    input = input + input + "cheese"
    return "You entered:  " + input


@eel.expose
def sendFile(wantedFile):
    #print(wantedFile)

    #check if the file exists
    #we'll only bother with this later, since it only matters
    #when anybody else is using it, but i'm the only person using it at the moment...

    #open the file
    with open(wantedFile, 'r') as f:
        jsonFile = f.read()
        #jsonData = json.load(f)

    #minimized_jsonFile = json.dumps(jsonData, separators=(',', ':'))

    #print(minimized_jsonFile)

    return jsonFile


@eel.expose
def downloadURLandReturnHTML(url, checkboxesObject):

    #print(url)

    #technically we should add this already, but processing of the url
    #so that we add the https:// if it's not there, but this might be a
    #JS job, since it would be so much more convenient with all that data there

    #check if url has already been tried, and then return the already cached one
    #however also check the time stamp to see if it was greater than a week ago
    #and if yes, then delete that cached one, remove the entry and then get a new copy

    #however if we start using too many magic numbers it might be worth
    #creating an actual config file/.toml thing, because then we can
    #access our magic numbers easily...

    #download url

    #save to a unique file in web/temp-downloads

    #in a file of some sort make a reference to the requested url, and then
    #if it's already in there get the html file that responds to it
    #perhaps make a nice convenient flush command so that it can cleaned out
    ##easily

    #go through cacheList.json and check for a match with the url
    cacheList = "web/temp-downloads/cacheList.json"

    #check if cacheList exists at it's path and then create an empty instance
    #also check for formatting, as in if it matches the format it's supposed to have
    if not os.path.exists(cacheList):
        data = """
            {
                "cachedSites":
                [
                    {
                        "url": "https://example.com",
                        "filepath": "temp-downloads/example.html",
                        "cacheDate": "111100001111000"
                    }
                ]
            }
        """

        data = {
            "cachedSites": [{
                "url": "https://example.com",
                "filepath": "temp-downloads/example.html",
                "cacheDate": "111100001111000"
            }]
        }

        with open(cacheList, 'w') as f:
            json.dump(data, f)

        #print('File created with template structure.')

    with open(cacheList, 'r') as f:
        jsonFile = f.read()

    parsedFile = json.loads(jsonFile)

    #go through the list of cached sites and check if already cached
    for i in range(len(parsedFile['cachedSites'])):
        cachedURL = parsedFile['cachedSites'][i]['url']
        cacheTime = int(parsedFile['cachedSites'][i]['cacheDate'])
        cachedPath = parsedFile['cachedSites'][i]['filepath']

        #prepare datetime stuff
        #time_in_DateTime = datetime.fromtimestamp(cacheTime / 1000)
        #current_DateTime = datetime.now()

        #time_diff = current_DateTime - time_in_DateTime

        #perform a comparison between the input url, and the one found here
        #also check that the cacheTime is less than a certain time away...
        if cachedURL == url:
            #since it matches, return the cachedPath
            #print(cachedPath)
            #time.sleep(1)

            #print(checkboxesObject)
            cachedPath = filterAndSend(cachedPath, checkboxesObject)
            return cachedPath

    #actully go and cache the file
    #call a function in a different python folder for the purposes of easy testing
    filePath, timeStamp = downloadAndProcessPageToFile(url)
    #now store this data to the json file
    # Load the JSON file into a Python object
    with open(cacheList, "r") as f:
        data = json.load(f)

    # Append the new cached site to the array
    new_site = {"url": url, "filepath": filePath, "cacheDate": timeStamp}
    data["cachedSites"].append(new_site)

    # Write the updated Python object back to the JSON file
    with open(cacheList, "w") as f:
        json.dump(data, f, indent=4)

    #now check for wanted filters, and then apply them
    #checkboxData = json.loads(checkboxesObject)
    #print(checkboxesObject)
    #now create a function which procceses the html according to our prefernces,
    #and then returns that extra temp file path§
    filePath = filterAndSend(filePath, checkboxesObject)

    return filePath


eel.init("web")


#process html file, and create new temporary html
def filterAndSend(filepath, checkboxesObject):
    #print(filepath)
    source_file_path = f"web/{filepath}"

    rand_string = ''.join(random.choices(string.ascii_uppercase, k=4))
    fileName = f"TEMP-{rand_string}"

    destination_file_path = f"web/temp-downloads/cache/{fileName}.html"

    # Open the source file for reading
    with open(source_file_path, "r") as source_file:
        # Read the contents of the file
        file_content = source_file.read()


    #perform all the filtering on file_content
    def filterThroughConditions(html, checkboxesObject):
        soup = BeautifulSoup(html, 'html.parser')

        #go through for all a tags and clear the href
        for a in soup.find_all('a'):
            del a['href']

        #add a script that will stop all logging, since it's clunkin up my console

        #check the json object and get conditions
        checkboxes = json.loads(checkboxesObject)
        removeScripts = checkboxes['removeScripts']
        #stylingFilter = checkboxes['stylingFilter']
        focusArticle = checkboxes['focusArticle']

        #print(f"removeScripts {removeScripts} stylingFilter {stylingFilter} focusArticle {focusArticle}")

        if removeScripts is True:
            #removes the script tags for le speed and also incase they should be doing something silly
            for script in soup.find_all('script'):
                script.decompose()

        #implement focusArticle
        if focusArticle is True:
            # Find the article tag
            article = soup.find('article')

            # If no article tag is found, return None
            if article is None:
                print("No <article> tag found.")
                return None

            # Get the parents of the article tag
            parents = list(article.parents)

            # Create a new soup for the filtered content
            soup = BeautifulSoup('<html><head></head><body></body></html>',
                                 'html.parser')

            # Add the parents to the new soup
            parent_node = soup.body
            for parent in reversed(
                    parents[:-2]
            ):  # Ignore the last 2 items, which are <body> and <html>
                new_parent = soup.new_tag(parent.name, **parent.attrs)
                parent_node.append(new_parent)
                parent_node = new_parent

            # Add the article to the new soup
            parent_node.append(article)

        #print(str(soup))

        return str(soup)

    file_content = filterThroughConditions(file_content, checkboxesObject)

    # Open the destination file for writing
    with open(destination_file_path, "w") as destination_file:
        # Write the contents of the source file to the destination file
        destination_file.write(file_content)

    destination_file_path = destination_file_path[4:]

    return destination_file_path


#when the window is closed, this will allow me to clear the temp temp cache
@eel.expose
def onWindowClose():
    #print("Window has been closed")

    directoryToRemove = "web/temp-downloads/cache"
    deleteAllHTMLfiles(directoryToRemove)

    #temporarily run emptyCache.py
    #emptyCache.emptyCache()



#selenium cacher/links filterer caller
@eel.expose()
def createSeleniumCacheOfSiteAndRequestLinks(url):
    #print(f"URL:\t{url}")

    #send to selenium and get it to cache
    links = filterForScraperRules(url)


    linksArray = links
    returnJSON = json.dumps({"linksArray":linksArray})
    return returnJSON



def deleteAllHTMLfiles(directoryToRemove):
    # Define the pattern for files to be deleted
    current_dir = os.getcwd()

    pattern = "*.html"

    # Get the current directory
    # Change the current working directory to "temp-downloads"
    os.chdir(directoryToRemove)

    # Get a list of all files in the current directory that match the pattern
    files_to_delete = [
        os.path.join(os.getcwd(), file) for file in os.listdir(os.getcwd())
        if fnmatch.fnmatch(file, pattern)
    ]

    # Delete each file
    for file in files_to_delete:
        os.remove(file)

    #change back to original directory
    os.chdir(current_dir)


@eel.expose
def index():
    return eel.start('index.html',
                     size=(1000, 900),
                     mode='chrome',
                     cmdline_args=['--disable-web-security'],
                     position=(400, 0),
                     port=8080)




#create a folder called cache, inside web/temp-downloads
def createCacheFolder():
    #i should really go and make this have an array input...

    folderPath = "web/temp-downloads/cache"
    if not os.path.exists(folderPath):
        os.makedirs(folderPath)

    folderPath = "seleniumCache"
    if not os.path.exists(folderPath):
        os.makedirs(folderPath)


if __name__ == "__main__":
    #ensure that this folder exists, since git
    createCacheFolder()

    #start web interface
    index()



