# -*- coding:utf-8 -*-
import json
import mysql.connector

# 讀取JSON檔案

with open("/Users/ms951236/taipei-day-trip/data/taipei-attractions.json") as f:
    jsondata = json.load(f)
    datas = jsondata['result']['results']
    # print(datas)

# 將讀取檔案資料寫入資料庫

conn = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = 'Aaa-860221',
    db = 'siteDB',
    charset = 'utf8mb4'
)
cursor = conn.cursor()
cursor.execute("DROP TABLE IF EXISTS site")
cursor.execute("CREATE TABLE site(id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,category VARCHAR(255) NOT NULL,description VARCHAR(1800) NOT NULL,address VARCHAR(255) NOT NULL,transport VARCHAR(500) NOT NULL,mrt VARCHAR(255),lat VARCHAR(255) NOT NULL,lng VARCHAR(255) NOT NULL,images VARCHAR(2200) NOT NULL);")
conn.commit()

# file 只留 .jpg

for each in datas:
    each["file"] = each["file"].replace(".JPG",".jpg")
    each["file"] = each["file"].split("https://")
    picList = []
    for element in each["file"]:
        try:
            if element[-3:] == "jpg":
                element = "https://" + element
                picList.append(element)
        except:
            continue
    name = each["name"]
    category = each["CAT"]
    description = each["description"]
    address = each["address"]
    transport = each["direction"]
    mrt = each["MRT"]
    lat = each["latitude"]
    lng = each["longitude"]

    cursor.execute(
        """INSERT INTO site(name,category,description,address,transport,mrt,lat,lng,images)values(%s,%s,%s,%s,%s,%s,%s,%s,%s);""", (each["name"],each["CAT"],each["description"],each["address"],each["direction"],each["MRT"],each["latitude"],each["longitude"],str(picList)))
    conn.commit()
cursor.close()