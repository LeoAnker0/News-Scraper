import random
import requests
import time
from datetime import datetime
import datetime
import os
import string
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import ActionChains


#timer
def timer_decorator(func):

    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(
            f"Function {func.__name__!r} elapsed time: {elapsed_time:.6f} seconds"
        )
        return result

    return wrapper


def downloadPageUsingRequests(url):
    response = requests.get(url)
    html_content = response.content
    return html_content


@timer_decorator
def downloadPageUsingSelenium(url):
    s = Service('./driver/chromedriver')

    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    options.add_argument(
        "--user-data-dir=/Users/Leo/Library/Application Support/Google/Chrome/Profile 1"
    )
    options.add_argument("--profile-directory=Profile 1")

    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(service=s, options=options)

    driver.get(url)
    html_content = driver.page_source
    #quit the driver
    driver.quit()

    return html_content


def save_html_to_file(html_content, directory):
    # Create the directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Generate a unique filename based on the current date and time
    timestamp = int(datetime.datetime.now().timestamp() * 1000)
    rand_string = ''.join(random.choices(string.ascii_uppercase, k=4))
    filename = f"{rand_string}-{timestamp}.html"
    filepath = os.path.join(directory, filename)

    # Write the HTML content to the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html_content)

    #print(f"HTML content saved to file: {filepath}")
    filepath = filepath[4:]

    return filepath


def removeHrefsFromA(html):
    #initialise the soup
    soup = BeautifulSoup(html, 'html.parser')

    #go through for all a tags and clear the href
    for a in soup.find_all('a'):
        del a['href']

    #return the processed html
    processedHTML = str(soup)

    return processedHTML

def replace_external_fonts(html, font_name, font_path):
    soup = BeautifulSoup(html, 'html.parser')
   
    # Add local font
    head = soup.find('head')
    style = soup.new_tag('style')
    style.string = f'* {{ font-family: "{font_name}", sans-serif !important; }} @font-face {{ font-family: "{font_name}"; src: url("{font_path}"); }}'
    head.append(style)
    return str(soup)


def downloadAndProcessPageToFile(url):
    html = downloadPageUsingRequests(url)

    #using bs4 process the html and remove all hrefs of the all a tags
    html = removeHrefsFromA(html)

    #change the fonts to reduce time to load
    #fontPath = './web/fonts/CirkaVariable.ttf'
    #fontName = "Cirka"
    #html = replace_external_fonts(html, fontName, fontPath)


    #add functionality where if the requests download wasn't good enough, you can
    #do it in selenium, but it just takes 10 times longer...

    #stringified_html = html.decode('utf-8')

    directory = "web/temp-downloads/"

    filePath = save_html_to_file(html, directory)

    #save to a file

    return filePath, int(datetime.datetime.now().timestamp() * 1000)


if __name__ == "__main__":
    url = "https://www.dr.dk/nyheder/indland/kirkeminister-er-stadig-ikke-klar-til-aendre-regel-om-kvindelige-praester-kan"
    #html = downloadPageUsingRequests(url)
    #html = downloadPageUsingSelenium(url)

    filePath, timeStamp = downloadAndProcessPageToFile(url)

    #save to a file with a random unique name
    #print(html)
