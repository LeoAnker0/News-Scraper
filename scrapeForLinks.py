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
	"""
	Currently accepted filter rules are as follows
	starts_with:
		string: match string (starts_with)
		command-is_numeric: checks if first character is a number
		
	doesnt_start_with:
		string: ! match string (doesnt_start_with)
		command-is_not_numeric: checks if first character is not a number

	ends_with:
		string: match string
		command-is_numeric: checks if last character is a number

	doesnt_end_with:
		string: !match string
		command-is_not_numeric: checks if last character is not a number

	has:
		string: requires that links have this string in them

	doesnt_have:
		string: remove all linkks that have this string

	"""

	linksTooFilter = []
	for link in soup.find_all('a'):
		link = str(link.get('href'))
		linksTooFilter.append(link)

	#Starts with
	#-------------------------------------------------


	#check for starts_with_type, if type string, then do string type, 
	#if none, then do none, if comman, then do command

	starts_with_type = str(rules['starts_with_type'])

	if starts_with_type == "string":
		#starts with
		startsWith = str(rules['starts_with'])
		#new list of only the items wanted
		startsWithLinksList = []

		lengthOfStart = len(startsWith)
		for link in linksTooFilter:
			#this checks if the characters of the string, are equal to the wanted string
			if link[0:lengthOfStart] == startsWith:
				#adds to  the list
				startsWithLinksList.append(link)

		#set main list to be equal to new list
		linksTooFilter = startsWithLinksList

	elif starts_with_type == "command":
		command = str(rules['starts_with_command'])
		#checks if the first character of link is a number, and removes if not
		if command == "is_numeric":
			startsWithNumberLinksList = []

			for link in linksTooFilter:
				firstCharacter = link[0]
				if checkIfNumeric(firstCharacter) == True:
					startsWithNumberLinksList.append(link)

			linksTooFilter = startsWithNumberLinksList

	#doesn't start with
	#-------------------------------------------------

	doesnt_start_with_type = str(rules['doesnt_start_with_type'])

	if doesnt_start_with_type == "string":
		#starts with
		doesntStartWith = str(rules['doesnt_start_with'])
		#new list of only the items wanted
		doesntStartWithLinksList = []

		lengthOfStart = len(doesntStartWith)
		for link in linksTooFilter:
			#checks if the selected strings match
			if link[0:lengthOfStart] != doesntStartWith:
				doesntStartWithLinksList.append(link)

		#set the main list to be equal to new list
		linksTooFilter = doesntStartWithLinksList


	elif doesnt_start_with_type == "command":
		command = str(rules['doesnt_start_with_command'])
		#checks if the first character of link is a number, and removes if not
		if command == "is_not_numeric":
			doesntStartWithLinksList = []

			for link in linksTooFilter:
				firstCharacter = link[0]
				if checkIfNumeric(firstCharacter) == False:
					doesntStartWithLinksList.append(link)

			linksTooFilter = doesntStartWithLinksList



	#ends with
	#-------------------------------------------------
	




	#doesn't end with
	#-------------------------------------------------







	#doesn't have
	#-------------------------------------------------

	#remove all links which have strings matching the doesnt_have array
	noElementsInDoesntHaveArray = len(rules['doesnt_have'])
	for i in range(noElementsInDoesntHaveArray):
		doesntHave = str(rules['doesnt_have'][i])
		if len(doesntHave) > 0:
			doesntHaveLinksList = []

			#if doesntHave not in link, then append to doesntHaveLinksList
			for link in linksTooFilter:
				if link.find(doesntHave) <=0:
					doesntHaveLinksList.append(link)

			#set main list to be equal to new list
			linksTooFilter = doesntHaveLinksList

	#has
	#-------------------------------------------------


	#remove all links which have strings matching the has array
	noElementsInHasArray = len(rules['has'])
	for i in range(noElementsInHasArray):
		has = str(rules['has'][i])
		if len(has) > 0:
			hasLinksList = []

			#if has in link, then append to hasLinksList
			for link in linksTooFilter:
				if link.find(has) > 0:
					hasLinksList.append(link)

			#set main list to be equal to new list
			linksTooFilter = hasLinksList





	#last step is to remove all duplicates, whilst maintaing order
	linksTooFilter = list(OrderedDict.fromkeys(linksTooFilter))

	for link in linksTooFilter:
		print(link)







if __name__ == "__main__":
	print("run link scraper")
	scrapeListFile = "scrapeListConfig.json"

	websites = importScrapeList(scrapeListFile)

	for websiteRules in websites:
		soup = downloadWebPage(websiteRules)
		filterWebPage(websiteRules, soup)












