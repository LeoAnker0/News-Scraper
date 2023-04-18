import eel
import json
from datetime import datetime, timedelta
import os
import time
import fnmatch

from htmlDownloader import downloadAndProcessPageToFile


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
def downloadURLandReturnHTML(url):

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
        time_in_DateTime = datetime.fromtimestamp(cacheTime / 1000)
        current_DateTime = datetime.now()

        time_diff = current_DateTime - time_in_DateTime

        #perform a comparison between the input url, and the one found here
        #also check that the cacheTime is less than a certain time away...
        if cachedURL == url and time_diff < timedelta(days=7):
            #since it matches, return the cachedPath
            #print(cachedPath)
            #time.sleep(1)
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

    return filePath


eel.init("web")


#when the window is closed, this will allow me to clear the temp temp cache
@eel.expose
def onWindowClose():
    #print("Window has been closed")

    directoryToRemove = "web/temp-downloads/cache"
    deleteAllHTMLfiles(directoryToRemove)


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


""" how to get the current dateTime in millis
current_datetime = datetime.now()

# convert datetime to milliseconds
current_time_in_millis = int(current_datetime.timestamp() * 1000)

print(current_time_in_millis)
"""
index()
