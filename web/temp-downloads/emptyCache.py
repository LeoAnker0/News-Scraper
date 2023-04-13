"""empties the cache, and in theory it should be possible to trigger
this from some other script, perhaps if the cache is too old or something
but i'm only really interested in being able to just easily clear it

and perhaps at some point it might be able to check if the majority of 
the cache, and if the dates are majority older than some threshold, clear it
but this will not be triggered by this script... 
"""
import os 
import fnmatch
import json

#remove all the html files
def deleteAllHTMLfiles(directoryToRemove):
	# Define the pattern for files to be deleted
	pattern = "*.html"

	# Get the current directory
	# Change the current working directory to "temp-downloads"
	os.chdir(directoryToRemove)


	# Get a list of all files in the current directory that match the pattern
	files_to_delete = [os.path.join(os.getcwd(), file) for file in os.listdir(os.getcwd()) if fnmatch.fnmatch(file, pattern)]

	# Delete each file
	for file in files_to_delete:
		os.remove(file)


#clear the json file
def remove_items_from_array(x):
	with open(x) as f:
		data = json.load(f)

	# Get the first item in the "cachedSites" array
	first_item = data["cachedSites"][0]

	# Remove all but the first item in the "cachedSites" array
	data["cachedSites"] = data["cachedSites"][:1]

	# Write the updated data back to the file
	with open(x, 'w') as f:
		json.dump(data, f, indent=4)


if __name__ == "__main__":
	directoryToRemove = "web/temp-downloads"
	deleteAllHTMLfiles(directoryToRemove)

	remove_items_from_array(f"cacheList.json")
	#remove all but the one item in the list in cacheList.json