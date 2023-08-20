from urllib.error import HTTPError
from urllib.error import URLError
from bs4 import BeautifulSoup
import requests

def getFood(food):
    # Get the image url
    url = "https://www.google.com/search?q=" + food + "&tbm=isch"
    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    image_url = soup.find("img")["src"]
    print("Image URL: " + image_url)
    # Download the image
    try:
        print(image_url)
    except HTTPError as e:
        print("HTTP Error:", e.code, url)
    except URLError as e:
        print("URL Error:", e.reason, url)
    except Exception as e:
        print("Unknown error:", e, url)
    else:
        print("Image downloaded successfully")
    print();

while(True):
    getFood(input("Enter food: "))