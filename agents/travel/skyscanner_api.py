import requests

API_HOST = "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
API_KEY = "4b5d4fc17dmsh79e966525fdf74ap194acdjsn050acce0eb0f"

HEADERS = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST
}

def search_flights(origin, destination, date):
    url = f"https://{API_HOST}/apiservices/browsequotes/v1.0/US/USD/en-US/{origin}/{destination}/{date}"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        return {"error": f"API call failed with status {response.status_code}"}

    data = response.json()
    quotes = data.get("Quotes", [])
    carriers = {c["CarrierId"]: c["Name"] for c in data.get("Carriers", [])}
    places = {p["PlaceId"]: p["Name"] for p in data.get("Places", [])}

    results = []
    for q in quotes:
        carrier = carriers.get(q["OutboundLeg"]["CarrierIds"][0], "Unknown")
        origin_place = places.get(q["OutboundLeg"]["OriginId"], "Unknown")
        dest_place = places.get(q["OutboundLeg"]["DestinationId"], "Unknown")
        price = q.get("MinPrice", 0)

        results.append({
            "airline": carrier,
            "origin": origin_place,
            "destination": dest_place,
            "price": price,
            "departure_date": date,
            "direct": q.get("Direct", False)
        })

    return results
