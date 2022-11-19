from flask import *
import mysql.connector
import math

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False # 支援 JSON 顯示中文
app.config["JSON_SORT_KEYS"] = False # JSON 輸出瀏覽器不會自動排序
app.config["TEMPLATES_AUTO_RELOAD"] = True

# 打開資料庫 

conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Aaa-860221',
    db='siteDB',
    charset='utf8mb4'
)
cursor = conn.cursor()

# api 旅遊景點

@app.route("/api/attractions",methods=["GET"])
def getAttractions():
    page = request.args.get("page","")
    page = int(page)
    print("page:",page)
    keyword = request.args.get("keyword","")
    print("keyword:[",keyword,"]")
    outDict = {}
    indictList = []
    
    try:
        if keyword != "":
            cursor.execute("SELECT * FROM site WHERE name REGEXP %s OR category= %s;",(str(keyword),str(keyword)))
            alldata = cursor.fetchall()
            # print(alldata)
        else:
            cursor.execute("SELECT * FROM site;")
            alldata = cursor.fetchall()
        dataNum = len(alldata)
        # print(dataNum) 
        lastpage = math.floor(dataNum/12)
        print(lastpage) 
        if 0 <= page <= lastpage:
            head_id = 1+12*page
            # print(head_id)
            if page == lastpage:
                tail_id = head_id+((dataNum%12)-1)
                # print(tail_id)
                outDict["nextPage"] = None
            else:
                tail_id = head_id+11
                outDict["nextPage"] = page+1

            # 把資料塞進字典

            for i in range(head_id-1,tail_id):
                inDict = {}
                inDict["id"] = alldata[i][0]
                inDict["name"] = alldata[i][1]
                inDict["category"] = alldata[i][2]
                inDict["description"] = alldata[i][3]
                inDict["address"] = alldata[i][4]
                inDict["transport"] = alldata[i][5]
                inDict["mrt"] = alldata[i][6]
                inDict["lat"] = alldata[i][7]
                inDict["lng"] = alldata[i][8]
                inDict["images"] = alldata[i][9]
                indictList.append(inDict)
            # print(indictList)
            outDict["data"]=indictList
            return jsonify(outDict),200
        # 如果page超出範圍，顯示資料為空
        else:
            outDict["nextPage"] = None
            outDict["data"]=indictList
            return jsonify(outDict),200
        
    except:
        outDict["error"] = True
        outDict["message"] = "There is something wrong."
        return jsonify(outDict),500

@app.route("/api/attraction/<attractionId>",methods=["GET"])
def getIdAttractions(attractionId):
    # attractionId = int(attractionId)
    cursor.execute("SELECT id FROM site;")
    alldata = cursor.fetchall()
    maxNum = max(alldata)[0]
    minNum = min(alldata)[0]
    dataNum = len(alldata)

    outDict = {}
    # 景點編號不正確
    if int(attractionId) > maxNum or int(attractionId) < minNum:
        outDict["error"] = True
        outDict["message"] = "The attraction_id is not valid."
        return jsonify(outDict),400
    cursor.execute("SELECT * FROM site WHERE id=%s;",(attractionId,))
    alldata = cursor.fetchall()
    # print(alldata) # [(3, '士林官邸', '歷史建築',...)]
    
    # 景點資料
    if alldata != []:
        inDict={}
        inDict["id"] = alldata[0][0]
        inDict["name"] = alldata[0][1]
        inDict["category"] = alldata[0][2]
        inDict["description"] = alldata[0][3]
        inDict["address"] = alldata[0][4]
        inDict["transport"] = alldata[0][5]
        inDict["mrt"] = alldata[0][6]
        inDict["lat"] = alldata[0][7]
        inDict["lng"] = alldata[0][8]
        inDict["images"] = alldata[0][9]
        outDict["data"]=inDict
        return jsonify(outDict),200
    # 伺服器內部錯誤
    else:
        outDict["error"] = True
        outDict["message"] = "There is something wrong."
        return jsonify(outDict),500

# api 旅遊景點分類

@app.route("/api/categories",methods=["GET"])
def getCategoriesAttractions():
    cursor.execute("SELECT category FROM site;")
    alldata = cursor.fetchall()
    # print(alldata)
    outData={}
    if alldata != []:
        categoriesList = []
        for category in alldata:
            if category[0] not in categoriesList:
                categoriesList.append(category[0])
        outData["data"] = categoriesList
        return jsonify(outData),200
    else:
        outData["error"] = True
        outData["message"] = "There is something wrong."
        return jsonify(outData),500

# Pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


app.run(host='0.0.0.0',port=3000,debug=True)
