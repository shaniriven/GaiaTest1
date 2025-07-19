
from copy import deepcopy
from datetime import datetime, timedelta
from typing import Dict, List


def generate_dates_list(data: str, itinerary: dict) -> List[Dict]:
    date_range = data.split(" to ")
    start_date_str, end_date_str = date_range
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    dates_list = []
    current_date = start_date
    # day_counter = 1
    print("\nmanipulate: generate_dates_list: start_date ", start_date)
    print("\nmanipulate: generate_dates_list: end_date ", end_date)
    print("\nmanipulate: generate_dates_list: current_date ", current_date)
    while current_date <= end_date:
        date_key = current_date.strftime("%Y-%m-%d")
        # format to dd.mm
        value = current_date.strftime("%d.%m").lstrip("0").replace(".0", ".")
        day_data = deepcopy(itinerary.get(date_key, {}))
        day_data.update({
            "value": value
        })
        dates_list.append(day_data)
        current_date += timedelta(days=1)
    print("manipulate: generate_dates_list: dates_list", dates_list)
    return dates_list