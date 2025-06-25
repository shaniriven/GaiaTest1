# backend/app/main/ai_module.py

import json
import os
import re

import openai
from app.extensions import mongo
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_prompt(data: any ) -> str:
    locations = data.get("locations")
    locationOptions = data.get("locationOptions")
    startDate = data.get("startDate", "")
    startDate = startDate.split("T")[0] if "T" in startDate else startDate

    endDate = data.get("endDate", "")
    endDate = endDate.split("T")[0] if "T" in endDate else endDate
    optimized_dates = data.get("optimizedDates")
    group = data.get("group")
    budget = data.get("budget")
    details = data.get("details")
    is_optimized = data.get("isOptimized")
    setting_labels = data.get("settingsLabels")
    activities_labels = data.get("activitiesLabels")
    accommodation_labels = data.get("accommodationLabels")

    interestsKeysAndActiveLabels = data.get("interestsKeysAndActiveLabels")

    # prompt versions
    # -> location 
    location_names = ", ".join(location['name'] for location in locations)
    print(location_names)
    # -> dates
    dates_prompt = ""

    # # -> group
    group_total = group.get("total")
    children_prompt = ""
    if locationOptions.get("isOptimized") == True:
        dates_prompt = "pick the best dates for each locations between the start date and the return date of the trip"
    if int(group.get("children", 0)) > 0:
        children_prompt = "there are children under 18 in the group. find relevant activities for them too."
        
    # -> budget
    minBadgetValue = budget.get("range")[0]
    maxBudgetValue = budget.get("range")[1]

    # -> details
    include_settings = [
        item["label"] for item in setting_labels if details.get(item["key"]) is True
    ]
    include_settings = ", ".join(include_settings)

    # dates_prompt: Optimize dates
    prompt = f"""
        You are a travel assistant AI. Ggenerate a daily travel itinerary in a specific structured JSON format.
        Plan The daily itinerary by the following information:
        The locations of the trip are: {location_names}.
        the trip is from {startDate} to {endDate}. {dates_prompt}                               
        consider there are {group_total} people in the group. {children_prompt}
        the budget for the trip is {minBadgetValue} - {maxBudgetValue} dollars.
        in your plan {include_settings}
        Provide a day-by-day itinerary. return a json.
        Heres the required format:
            {{
                "trip_dates": "<start date> to <end date>",
                "locations": "<city, country> // list of all the locations",
                "group_size": <number>,
                "budget": "<minimum>-<maximum> USD",
                "itinerary": {{
                    "<YYYY-MM-DD>": {{
                        "day": "<Day of the week>",
                        "theme": "<Summary or main theme of the day>",
                        "activities": [
                            {{
                                "time": "<Time of day>",
                                "description": "<Short description of the activity>",
                                "cost": "<Estimated cost in local currency>",
                                "notes": "<Optional notes or tips>"
                            }},
                            ...
                        ],
                        "food": "<Highlight local food tried that day>"
                    }},
                    ...
                }}
            }}

    """
    return prompt

def save_plan_mongo(data: str, user_id: any):
    db = mongo.get_db("Users")
    plans_collection = db.get_collection("plans")
    users_collection = db.get_collection("user_profile")
    json_str = re.search(r'\{.*\}', data, re.DOTALL).group()
    plan = json.loads(json_str)
    _id = ObjectId()
    plan["_id"] = str(_id)
    plan["creator"] = user_id
    plans_collection.insert_one(plan)
    users_collection.update_one(
        { "userId": user_id },
        { "$push": { "plans": str(_id) } },
        upsert=True  # set to True if you want to create the field if not found
    )
    return _id




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
