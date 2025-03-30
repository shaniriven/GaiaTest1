# backend/app/main/scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_municipality_open_data(city: str) -> dict:
    # Replace the URL below with the actual URL for the city's open data portal
    url = f"https://opendata.{city.lower()}.gov"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException:
        return {"data": []}
    
    soup = BeautifulSoup(response.text, 'html.parser')
    data = []
    for item in soup.find_all("div", class_="attraction"):
        name = item.find("h2").text.strip() if item.find("h2") else "Unnamed"
        description = item.find("p").text.strip() if item.find("p") else ""
        data.append({"name": name, "description": description})
    
    return {"data": data}
