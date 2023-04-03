import eel

@eel.expose
def python_function(input):
    input = input + input + "cheese"
    return "You entered:  " + input

eel.init("web")
eel.start("index.html", size=(1000, 800), port=6969)