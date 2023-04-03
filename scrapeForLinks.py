import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import io
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains
import os
from bs4 import BeautifulSoup
from collections import OrderedDict
import time

#i should really add error handling, especially for the big cases
#like when downloading the webpage
#should also add error handling for all the places where user
#inputs are used, since those can't be trusted, but hopefully
#i can also solve that using a gui, with input validation, 
#but proper error handling would be the *correct* way of doing it...





def importScrapeList(scrapelist):
	with open(scrapelist, 'r') as f:
		data = json.load(f)

	websites = data['websites']

	return websites

def initialise_driver(url):
	s = Service('./driver/chromedriver')

	options = webdriver.ChromeOptions()
	options.add_argument("--window-size=1920,1080")
	options.add_argument("--user-data-dir=/Users/Leo/Library/Application Support/Google/Chrome/Profile 1")
	options.add_argument("--profile-directory=Profile 1")

	options.add_argument('--headless')
	options.add_argument('--disable-gpu')
	options.add_argument('--no-sandbox')

	driver = webdriver.Chrome(service=s, options=options)

	driver.get(url)
	return driver

def downloadWebPage(website):
	name = website['name']
	url = website['url']
	print(f"\ndownloading {url}, from {name} \n\n")

	#initialise the driver
	driver = initialise_driver(url)
	#perform any page cleaning here

	#get the html from the driver into bs4
	html_content = driver.page_source
	soup = BeautifulSoup(html_content, 'html.parser')

	#quit the driver
	driver.quit()

	return soup


def checkIfNumeric(character):
	return character.isdigit()



def filterWebPage(rules, soup):
	print()
	linksTooFilter = []
	for link in soup.find_all('a'):
		link = str(link.get('href'))
		linksTooFilter.append(link)

	#get a string for comparison, based on the input criteria
	def get_string(howMany, lengthOfContent, link, where):
		#if howMany is all or any
		if howMany == "all":
			if where == "start":
				try:
					return_string = link[0 : int(lengthOfContent)]
					#print(return_string)
					return return_string
				except IndexError:
					print("the indexs are out of range")
					return "::skip::"
			#gets the string from the end, rather than the beginning
			elif where == "end":
				try:
					return_string = link[-int(lengthOfContent):]
					#print(return_string)
					return return_string
				except IndexError:
					print("the indexes are out of range")
					return "::skip::"

		#if howMany is just a normal number
		elif howMany.isdigit():
			if where == "start":
				try:
					return_string = link[0: int(howMany)]
					#print(return_string)
					return return_string
				except IndexError:
					print("the indexes are out of range")
					return "::skip::"
			if where == "end":
				try:
					return_string = link[-int(howMany):]
					#print(return_string)
					return return_string
				except IndexError:
					print("the indexes are out of range")
					return "::skip::"

		elif "," in howMany:
			numbers = howMany.split(",")
			number1 = numbers[0]
			number2 = numbers[1]

			try:
				number1 = int(number1)
			except ValueError:
				number1 = None if number1 == "None" else number1

			try:
				number2 = int(number2)
			except ValueError:
				number2 = None if number2 == "None" else number2

			try:
				return_string = link[number1:number2]
				#print(return_string)
				return return_string
			except IndexError:
				print("the indexes are out or range")
				return "::skip::"

		else:
			print(f"there was any invalid input in get_start_string")
			return "::skip::"


	#for every command in the rules, do action
	for command in rules['commands']:
		array_of_commands = command.split(":")

		#split the array of commands into seperate variables
		where = array_of_commands[0] 	#start/end/in?
		how_many = array_of_commands[1]	#how many of those characters to check/slice indicing
		condition = array_of_commands[2]#wether it should be true or false
		what = array_of_commands[3]		#what it is that is being checked
		content = array_of_commands[4]	#a condition or value that is relevant to the what

		#intialise new array
		linksList = []

		#do something with them
		for link in linksTooFilter:
			#if where is start or end
			if where == "start" or where == "end":
				return_string = get_string(how_many, len(content), link, where)
				if return_string == "::skip::":
					continue

				#if what is string, and condition is true
				if what == "string" and condition == "true":
					if return_string == content:
						linksList.append(link)
						#print(f"return_string : {return_string}")
				#if what is string and condition is false
				elif what == "string" and condition == "false":
					if return_string != content:
						linksList.append(link)
						#print(f"return_string : {return_string}")

			#if where is in
			elif where == "in":
				#if check == string and condition == true
				if what == "string" and condition == "true":
					if content in link:
						#print(link)
						linksList.append(link)
				#if check == string and condition == false
				if what == "string" and condition == "false":
					if content not in link:
						#print(link)
						linksList.append(link)


		#then set linksTooFilter to equal linksList
		linksTooFilter = linksList

	#last step is to remove all duplicates, whilst maintaing order
	linksTooFilter = list(OrderedDict.fromkeys(linksTooFilter))

	return linksTooFilter




def addHTTPStoLinks(rules, linksTooFilter):
	#if link doesn't start with https, then add the url to link
	links = []
	for link in linksTooFilter:
		if not link.startswith("https://"):
			#print(link[8:], "https://", link, f"\n")
			newLink = str(rules['url']) + link
			print(newLink)
			links.append(newLink)
		else:
			links.append(link)

	return links



def writeLinksTooFile(name, url, links, targetOutputFile):
	scrapeTime = int(round(time.time() * 1000))

	data = {
		"scraper_version": "0.1",
		"name": name,
		"originURL": url,
		"scrape_time": scrapeTime,
		"linksArray": links
	}

	with open(targetOutputFile, "a", encoding="UTF-8") as file:
		json.dump(data, file, ensure_ascii=False)


def soupifyHTML(source):
	file = open(source, "r")
	file_contents = file.read()
	file.close()
	soup = BeautifulSoup(file_contents, 'html.parser')
	return soup



#for when i'm filtering a new site, and need to make the rules
def filterNewSite():
	print(f"adding new site to be scraped")
	scrapeListFile = "newScrapeConfig.json"

	websites = importScrapeList(scrapeListFile)
	for website in websites:
		#soup = downloadWebPage(website)
		soup = soupifyHTML('test.html')
		links = filterWebPage(website, soup)
		#for link in links:
	#		print(link)

#the normal procedure for scraping links from a page
def filterFromExistingScrapeList(scrapeListFile, targetLinksOutputFile):
	websites = importScrapeList(scrapeListFile)

	for websiteRules in websites:
		websiteName = websiteRules['name']
		websiteURL = websiteRules['url']
		soup = downloadWebPage(websiteRules)
		links = filterWebPage(websiteRules, soup)

		for link in links:
			print(link)
		#links = addHTTPStoLinks(websiteRules, links)
		#writeLinksTooFile(websiteName, websiteURL, links, targetLinksOutputFile)


if __name__ == "__main__":
	print("run link scraper")

	scrapeListFile = "scrapeListConfig.json"
	targetLinksOutputFile = "links.json"

	filterFromExistingScrapeList(scrapeListFile, targetLinksOutputFile)
	#filterNewSite()









