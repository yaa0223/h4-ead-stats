#!/usr/bin/python

from bs4 import BeautifulSoup
import requests
import json

s = requests.Session()

def get_page(page_number):
    r = s.get("http://www.trackitt.com/usa-immigration-trackers/h4-ead/page/" + str(page_number))
    return get_data(r.text)

def get_data(file_name):
    soup = BeautifulSoup(file_name, "html.parser")
    datas = []
    for row in soup.findAll("tr", {"class" : ["regulartrackerrow", "certifiedtrackerrow"]}):
        data = {}
        columns = row.findAll("td")
        data["name"] = columns[1].text
        data["nationality"] = columns[3].text
        data["application_type"] = columns[4].text
        data["service_center"] = columns[5].text
        data["filed_date"] = columns[6].text
        data["received_date"] = columns[7].text
        data["notice_data"] = columns[8].text
        data["ref_received"] = columns[10].text
        data["application_status"] = columns[15].text
        data["approval_denial_date"] = columns[16].text
        data["ead_ordered_date"] = columns[17].text
        data["ead_received_date"] = columns[18].text
        data["total_processing_time"] = columns[19].text
        data["days_elapsed"] = columns[20].text
        data["note"] = columns[21].text
        datas.append(data)
    return datas

all_datas = []
for i in range(1, 59):
    all_datas.append(get_page(i))
