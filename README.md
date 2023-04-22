# News Scraper

This is an ongoing project aimed at developing a versatile news scraper capable of extracting content from various news websites. The project focuses on creating tools to simplify the process of setting up scraper and filter rules.

## Notes
As this project is currently under development, most or all features are still being implemented. The Python Eel library is being used for creating the graphical user interfaces (GUIs). Although this might not be the most optimal choice, it can be modified in the future. The project also utilises vanilla JavaScript and CSS for front-end development.

The project is divided into four main components:

* [Link Scraping](#Link-Scraping)
* Article Scraping
* Processing, Analysis, and API Integration
* Front-End Development
Currently, the project is in the initial phase, focusing on link scraping.


## Table of Contents
<!--
- [Installation](#installation)-->
- [Features](#Features)
- [License](#license)
<!--
- [Usage](#Usage)
- [Contact](#contact) -->

<!--
## Installation
For some sections of this scraper Selenium is used, so that will need to be downloaded -->

## Features
#### This project comprises four distinct areas, each corresponding to a specific step in the news scraping process. Each area consists of multiple tasks that contribute to the overall functionality.

**Link Scraping:** News sites feature their most important articles on the main page with links. Our first task is to grab these links to process the articles. Due to the various messy links on a typical webpage, we need to write individual filters for each site to ensure compatibility and quality results. A GUI simplifies this process with page previews and real-time updates.

**Article Scraping:** This step involves scraping the article content, which will likely require individual filters per site or even multiple filters for sites with different page layouts.

**Processing/Analysis:** With all articles formatted uniformly, we can begin processing them, which includes translation, analysis, and understanding article content (e.g., mentioned places, names, events, sentiment). By connecting the articles and placing them on a map, we can create summaries and group articles discussing the same subject.

**Front End:** The final step involves creating a front end for users to access and interact with the collected data. Users can select countries they are interested in, view top stories between their chosen countries, and see how different sources cover the same story. They can also choose specific locations, filter stories based on places, or add filters to exclude certain article types.

### Link Scraping
* **scrapeForLinks.py**: This is the core script for the link scraping section, as it handles the actual link scraping process.
* **linkScraperGui.py**: This is a GUI designed for configuring the scraper rules for each site, making it easier to set up and manage individual filters.

###### The Link Scraper GUI previewing a link
![linkScraperGui](https://user-images.githubusercontent.com/112939203/233508753-bfd71102-de76-46fe-9ab5-d184c9008061.png)

###### The Link Scraper GUI previewing a link, with script tags removed by Python, and an extra styling filter added to the iframe
![linkScraperGui](https://user-images.githubusercontent.com/112939203/233508772-87a573cc-010b-4c37-905f-44c15a237017.png)


### Article Scraping
 * *not started yet*

### Processing/Analysis
 * *not started yet*

### Front End
 * *not started yet*


## License

[MIT License](LICENSE.md) © Leo Anker
