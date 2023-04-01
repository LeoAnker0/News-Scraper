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

def filterWebPage(rules, soup):
	linksTooFilter = []
	for link in soup.find_all('a'):
		link = str(link.get('href'))
		linksTooFilter.append(link)


	#starts with
	startsWith = str(rules['starts_with'])
	#remove string if not in beginning
	if len(startsWith) > 0:
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


	#doesn't start with
	doesntStartWith = str(rules['doesnt_start_with'])
	#remove link if in beginning
	if len(doesntStartWith) > 1:
		doesntStartWithLinksList = []

		lengthOfStart = len(doesntStartWith)
		for link in linksTooFilter:
			#checks if the selected strings match
			if link[0:lengthOfStart] != doesntStartWith:
				doesntStartWithLinksList.append(link)

		#set the main list to be equal to new list
		linksTooFilter = doesntStartWithLinksList


	#remove all links which have strings matching the doesnt_have array
	noElementsInDoesntHaveArray = len(rules['doesnt_have'])
	for i in range(noElementsInDoesntHaveArray):
		#if rule = "doesnt_have" isn't in link
		doesntHave = str(rules['doesnt_have'][i])
		if len(doesntHave) > 0:
			doesntHaveLinksList = []

			#if doesntHave not in link, then append to doesntHaveLinksList
			for link in linksTooFilter:
				if link.find(doesntHave) <=0:
					doesntHaveLinksList.append(link)

			#set main list to be equal to new list
			linksTooFilter = doesntHaveLinksList

	#remove all links which have strings matching the has array
	noElementsInHasArray = len(rules['has'])
	for i in range(noElementsInHasArray):
		#if rule = "doesnt_have" isn't in link
		has = str(rules['has'][i])
		if len(has) > 0:
			hasLinksList = []

			#if doesntHave not in link, then append to doesntHaveLinksList
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












