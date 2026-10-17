#!/usr/bin/env python3
"""Download high-res destination photos (Unsplash + Wikimedia Commons) into public/media as 2400px WebP
and write attribution to lib/mock/image-sources.json. Run from the web/ folder: python3 scripts/fetch_images.py"""
import io, json, re, sys, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/media"
UA = {"User-Agent": "ThroughVacationsBot/1.0 (nivassri183@gmail.com)"}

# Unsplash covers (id from lib/mock/image-sources.json). Re-fetched at 2400px.
unsplash = json.loads((ROOT / "lib/mock/image-sources.json").read_text())
unsplash = [u for u in unsplash if u.get("url", "").startswith("https://images.unsplash.com") and u["name"] not in ("north-india", "malaysia", "coorg", "andaman")]

# Commons files: output name -> (title, ...). First of each trip is the cover.
commons = {
    "kashmir": ["Dal Lake Hazratbal Srinagar.jpg", "Dal Lake, Srinagar, Jammu and Kashmir.jpg", "Shalimar Bagh, Srinagar.jpg"],
    "munnar-alleppey": ["Munnar - Tea Plantations.jpg", "Nedumudy - Houseboat.jpg", "Mattupetty Lake View.jpg", "Eravikulam National Park-WUS07186.jpg"],
    "ladakh": ["Sand dunes of Nubra Valley, Ladakh.jpg", "Pangong Tso Lake 1.jpg", "Shanti Stupa Ladakh.jpg"],
    "goa": ["Anjuna Beach, Goa, India, Legendary Curlies beach shack.jpg", "Mandrem Beach and Mandrem River, Mandrem, Goa, India.jpg", "Beaching Fishing Boat Goa Jan19 DSC06163.jpg", "Laterite Cola Bay Goa Jan19 DSC00317.jpg"],
    "udaipur-jaipur": ["20191207 Lake Pichola, City Palace, Udaipur, 1516 7254.jpg", "Taj Lake Palace Udaipur from City Palace.jpg", "East facade Hawa Mahal Jaipur from ground level (July 2022) - img 01.jpg", "Hawa Mahal east facade (14-07-2022).jpg"],
    "maldives": ["Malediven Sandbank (28800504836).jpg", "Diamonds Thudufushi Beach and Water Villas, May 2017 -04.jpg", "Strand Malediven Velidhu Dezember 2005.JPG", "Baa atoll islands.JPG", "Hängematte Chillen Malediven (29367163651).jpg"],
    "singapore": ["Marina Bay Sands and illuminated polyhedral building Louis Vuitton over the water at blue hour with pink clouds in Singapore.jpg", "Singapore (SG), Gardens By The Bay -- 2019 -- 4468.jpg", "ArtScience Museum, Marina Bay Sands, Singapore.jpg"],
    "sri-lanka": ["SL Demodara near Ella asv2020-01 img02.jpg", "Tea-plantation Nuwara Eliya-2567.jpg", "Kandy Sri Lanka Temple of the tooth.jpg", "Nine-Arch Bridge in Sri Lanka.jpg"],
    "bangkok-pattaya": ["Templo Wat Arun, Bangkok, Tailandia, 2013-08-22, DD 30.jpg", "Templo Wat Arun, Bangkok, Tailandia, 2013-08-22, DD 37.jpg"],
    "shimla-manali-amritsar": ["Beas Valley - Palchan - Kullu 2014-05-10 (edit).jpg", "Golden Temple, Amritsar 01.jpg", "Hidimba Devi Temple, Dhungri Manali.jpg", "Christ Church at the Ridge, Shimla.jpg", "Solang valley under snow, 2015.jpg"],
    "malaysia": ["Kuala Lumpur Malaysia Petronas-Twin-Towers-01.jpg", "The Beauty of Genting Highlands.jpg", "Gombak Selangor Batu-Caves-01.jpg", "Kuala Lumpur, Malaysia, Petronas Towers at night.jpg"],
    "coorg": ["ABBEY FALLS ,COORG ,KARNATAKA.jpg", "Coffee Shade Trees Paddy Fields Coorg Feb24 R16 07670.jpg", "Raja's Tomb, Madikeri, Kodagu (Coorg), Karnataka, India.jpg"],
    "andaman": ["Havelock Island, Radhanagar Beach, tropical bliss, Andaman Islands.jpg", "Havelock Island, Radhanagar Beach sunset, Andaman Islands.jpg", "Cellular Jail, Andaman, Port Blair, India.jpg"],
    "bali": ["Tegallalang Rice Terraces Bali 1.jpg", "Tanah Lot, Bali, Indonesia, 20220827 1008 1159.jpg"],
    "pondicherry": ["Beach Promenade, Pondicherry, India.jpg", "Night views of the Promenade Beach in Pondicherry 04.jpg"],
    "dubai": ["Sunset captured on Dubai Dunes (Wide Angle).jpg", "Dubai Marina by night (2).jpg", "Forever Marina Dubai.jpg"],
    "thailand": ["Maya Bay enclosed limestone cliffs and turquoise water Ko Phi Phi Le.jpg", "Thalang Road, Old Phuket Town.jpg", "A Long-tail Boat in Pileh Lagoon, Phi Phi Le.jpg"],
}
# Slugs whose cover stays the Unsplash photo: Commons titles go to <slug>-2.. instead of replacing the cover.
keep_cover = {"bali", "pondicherry", "dubai", "thailand"}

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()

def save(data, path, width=2400):
    im = Image.open(io.BytesIO(data)).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=90, method=6)
    return im.size

sources = []
for u in unsplash:
    url = re.sub(r"w=\d+", "w=2400", u["url"]).replace("q=85", "q=90")
    path = OUT / f'{u["name"]}.webp'
    size = save(get(url), path)
    sources.append({**u, "file": f'/media/{u["name"]}.webp', "author": u.get("author", "Unsplash contributor"), "license": "Unsplash License"})
    print(path.name, size)

for slug, titles in commons.items():
    for i, title in enumerate(titles):
        name = f"{slug}-{i + 2}" if slug in keep_cover else (slug if i == 0 else f"{slug}-{i + 1}")
        api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
            "action": "query", "format": "json", "titles": "File:" + title, "prop": "imageinfo",
            "iiprop": "extmetadata|url", "iiextmetadatafilter": "LicenseShortName|Artist"})
        pg = next(iter(json.loads(get(api))["query"]["pages"].values()))
        ii = pg["imageinfo"][0]
        meta = ii["extmetadata"]
        author = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "Unknown")).strip()
        lic = meta.get("LicenseShortName", {}).get("value", "")
        thumb = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title) + "?width=2400"
        size = save(get(thumb), OUT / f"{name}.webp")
        sources.append({"name": name, "file": f"/media/{name}.webp", "page": ii["descriptionurl"], "author": author, "license": lic, "url": thumb})
        print(name, size, lic)

(ROOT / "lib/mock/image-sources.json").write_text(json.dumps(sources, indent=2, ensure_ascii=False))
