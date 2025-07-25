# backend/app/main/ai_module.py

import json
import os
import re
from datetime import datetime
from time import timezone

# import openai
from app.extensions import mongo
from bson import ObjectId
from dotenv import load_dotenv
from flask import jsonify

load_dotenv()
# openai.api_key = os.getenv("OPENAI_API_KEY")

# write function for unsused values:  -> locationOptions.suggestFlights


def generate_prompt(data: any ) -> str:
    # print("\ngenerate_prompt: data ", data, "\n")
    # location
    locations = data.get("locations")
    locationOptions = data.get("locationOptions")
    locations_prompt = ""

    # -> locationOptions -> anywhere
    anywhere = locationOptions.get("anywhere", False) 
    # print("\ngenerate_prompt: anywhere ", anywhere, "\n")
    if not anywhere and locations:
        location_names = ", ".join(location['name'] for location in locations)
        locations_prompt = "The locations for the trip are: " + location_names  
    if anywhere:
        locations_prompt = "you pick the locations for the trip." 
    # print("\ngenerate_prompt: anywhere ", locations_prompt, "\n")

    # -> locationOptions -> suggestFlights
    suggestFlights = locationOptions.get("suggestFlights", False) 
    if suggestFlights:
        locations_prompt += " suggest flights or arrival ways from israel to the locations."

    # -> dates 
    # startDate = data.get("startDate", "")
    startDate = data.get("startDate")
    if not startDate:
         startDate = datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
    print("\ngenerate_prompt: startDate ", startDate, "\n")
    startDate = startDate.split("T")[0] if "T" in startDate else startDate

    endDate = data.get("endDate", "")
    if not endDate:
         endDate = datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
    endDate = endDate.split("T")[0] if "T" in endDate else endDate

    # -> dates -> optimizeDates
    optimize_dates = data.get("optimizedDates", False)
    tripLength = data.get("tripLength", 1)
    dates_prompt = ""
    if optimize_dates:
        dates_prompt = f"""make a plan for {tripLength} days in the near futer, and pick the best date for the location."""
    else:
        dates_prompt = f"""the trip is from {startDate} to {endDate}."""
        
    # -> group
    group = data.get("group")
    group_total = group.get("total")
    children_prompt = ""
    if int(group.get("children", 0)) > 0:
        children_prompt = "there are children under 18 in the group. find relevant activities for them too."
    

    # -> budget
    budgetOptions = data.get("budget")
    includeMeals = budgetOptions.get("includeMeals", False)
    includeMeals_prompt = ""
    if includeMeals:
        includeMeals_prompt = "reccomand on good restarutants that will fit the budget and the group size."
    minBadgetValue = budgetOptions.get("range")[0]
    maxBudgetValue = budgetOptions.get("range")[1]

    # -> details
    details = data.get("details")
    noneChecked = True
    hotels_checkbox = details.get("hotels", False)
    hostels_checkbox = details.get("hostels", False)
    resorts_checkbox = details.get("resorts", False)
    camping_checkbox = details.get("camping", False)

    guidedTours_checkbox = details.get("guidedTours", False)
    trails_checkbox = details.get("trails", False)
    urbanTrip_checkbox = details.get("urbanTrip", False)

    accommodation_prompt = "include accommodation options: "
    if hotels_checkbox:
        accommodation_prompt += "hotels, "
        noneChecked = False
    if hostels_checkbox:
        accommodation_prompt += "hostels, "
        noneChecked = False
    if resorts_checkbox:
        accommodation_prompt += "resorts, "
        noneChecked = False
    if camping_checkbox:
        accommodation_prompt += "camping, "
        noneChecked = False
    if (noneChecked):
        accommodation_prompt += "any type of accommodation that fits the budget and the group size. "
    else:
        accommodation_prompt += "are preferred. "

    activities_prompt = "if possible, include activities from the following types: "
    noneChecked = True
    if guidedTours_checkbox:
        activities_prompt += "guided tours, "
        noneChecked = False
    if trails_checkbox:
        activities_prompt += "trails, "
        noneChecked = False
    if urbanTrip_checkbox:
        activities_prompt += "urban trip, "
        noneChecked = False
    if (noneChecked):
        activities_prompt += "any type of activities that fits the budget and the group size. "
    else:
        activities_prompt += "activities are preferred. "


    # dates_prompt: Optimize dates
    prompt = f"""
        You are a travel assistant AI. Ggenerate a daily travel itinerary in a specific structured JSON format.
        Plan The daily itinerary by the following information:
        {locations_prompt}
        
        {dates_prompt}                             
        consider there are {group_total} people in the group. {children_prompt}
        the budget for the trip is {minBadgetValue} - {maxBudgetValue} dollars.
        {includeMeals_prompt}
        {accommodation_prompt}
        {activities_prompt}
        Provide a day-by-day itinerary. return a json.
        Heres the required format:
            {{
            
                "trip_dates": "<start date> to <end date>",
                "locations": "<city, country> // list of all the locations",
                "flight_info": "<flight details for the locations, if suggestFlights is true>",
                "group_size": <number>,
                "budget": "<minimum>-<maximum> USD",
                "itinerary": {{
                    "<YYYY-MM-DD>": {{
                        "day": "<Day of the week>",
                        "theme": "<Summary or main theme of the day>",
                        "activities": [
                            {{
                                "title": "<short title for the UI>",
                                time: "<recommended time of day>",
                                "description": "<Short description of the activity>",
                                "cost": "<Estimated cost in local currency>",
                                "notes": "<Optional notes or tips>"
                            }},
                            ...
                        ],
                        "accommodation": "<recommended at least 3 good accommodation places.>",
                        "transportation": "<transportation details needed for the day. (how to pay on public transport if needed, what is recommaned to use, etc)>",
                    }},
                    ...
                }}
            }}

    """
    return prompt


# convert str agent response to json and store in mongo
def save_plan_in_mongo(data: str, user_id: any):
    db = mongo.get_db("Users")
    plans_collection = db.get_collection("plans")
    users_collection = db.get_collection("user_profile")
    
    json_str = re.search(r'\{.*\}', data, re.DOTALL).group()
    try:
        plan = json.loads(json_str)
        _id = ObjectId()
        
        # save labels for button display
        trip_dates  = plan.get("trip_dates")
        if not trip_dates or "to" not in trip_dates:
            return jsonify({"error": "Invalid or missing 'trip_dates' format"}), 400
        start_str = trip_dates.split("to")[0].strip()
        end_str = trip_dates.split("to")[1].strip()
        end_date = datetime.strptime(end_str, "%Y-%m-%d").date()

        start_date = datetime.fromisoformat(start_str)
        formatted_date = start_date.strftime("%B, %Y")
        today = datetime.today().date()

        locations = plan.get("locations", "")
        name = locations.split(",")[0].strip() if "," in locations else locations.strip()

        plan["_id"] = str(_id)
        plan["creator"] = user_id
        plan["formatted_date"] = formatted_date
        plan["name"] = name
        plan["is_past"] = end_date < today

        plans_collection.insert_one(plan)
        users_collection.update_one(
            { "userId": user_id },
            { "$push": { "plans": str(_id) } },
            upsert=True  # set to True if you want to create the field if not found
        )
        return jsonify({"id": str(_id), "name": name})
    except json.JSONDecodeError:
        return jsonify({"error": "AI response was not valid JSON"}), 500




# check if needed for the app. from prev versions 

def generate_query_for_hobby(destination: str, hobby: str) -> str:
    """
    Uses OpenAI's API to generate a query string to send to the Google Places API.
    For example, if destination is 'Berlin' and hobby is 'museums', the function might return:
    "Give me the 10 most ranked museums in Berlin"
    """
    prompt = (
        f"Generate a query for the Google Places API for a user interested in {hobby} in {destination}. "
        "The query should ask for the 10 most highly ranked places related to that interest in that destination. "
        "Return only the query string without any additional text."
    )
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or use gpt-4 if available
            messages=[
                {"role": "system", "content": "You are an assistant that generates query strings for the Google Places API."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=50,
        )
        query = response["choices"][0]["message"]["content"].strip()
        return query
    except Exception as e:
        print("Error calling OpenAI API:", e)
        # Fallback query in case of error
        return f"10 most ranked {hobby} in {destination}"
