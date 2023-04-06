import eel
import json

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

eel.init("web")

@eel.expose
def index():
    return eel.start('index.html', size=(1000, 900), mode='chrome', cmdline_args=['--disable-web-security'], position=(0,0),  port=8080)



index()

