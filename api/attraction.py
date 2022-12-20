from flask import *
from function.accessDB import *
from flask import Blueprint

attraction_blueprint = Blueprint('attraction', __name__)

# api 旅遊景點

@attraction_blueprint.route("/api/attractions",methods=["GET"])
def getAttractions():
    page = request.args.get("page","")
    page = int(page)
    keyword = request.args.get("keyword","")
    outDict = {}
    indictList = []
    
    head_id = 12*page
    try:
        conn=openDB()
        cursor = conn.cursor()
        # 判斷有無keyword，執行對應sql指令
        if keyword != "":
            cursor.execute("SELECT * FROM attraction WHERE name REGEXP %s OR category= %s LIMIT %s, %s;",(str(keyword),str(keyword),head_id,12))
            alldata = cursor.fetchall()
            cursor.close()
            conn.close()
        else:
            
            cursor.execute("SELECT * FROM attraction LIMIT %s, %s;",(head_id,12))
            alldata = cursor.fetchall()
            cursor.close()
            conn.close()

        # 根據抓出資料，決定顯示瀏覽器的 nextPage 和 data
        if alldata == None:
            outDict["nextPage"] = None
            outDict["data"] = indictList
            return jsonify(outDict),200
        elif len(alldata) != 12:
            outDict["nextPage"] = None
        else:
            outDict["nextPage"] = page+1

        # 把資料放入字典
        for each in alldata:
            inDict = {}
            inDict["id"] = each[0]
            inDict["name"] = each[1]
            inDict["category"] = each[2]
            inDict["description"] = each[3]
            inDict["address"] = each[4]
            inDict["transport"] = each[5]
            inDict["mrt"] = each[6]
            inDict["lat"] = each[7]
            inDict["lng"] = each[8]
            image ="".join(each[9].strip('][')).replace("'","").split(", ")
            inDict["images"] = image
            indictList.append(inDict)
        outDict["data"]=indictList
        return jsonify(outDict),200

    # 伺服器內部錯誤
    except:
        outDict["error"] = True
        outDict["message"] = "There is something wrong."
        return jsonify(outDict),500

@attraction_blueprint.route("/api/attraction/<attractionId>",methods=["GET"])
def getIdAttractions(attractionId):
    conn=openDB()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attraction WHERE id=%s;",(attractionId,))
    alldata = cursor.fetchone()
    cursor.close()
    conn.close()
    outDict = {}
    try:
        # 景點編號不正確
        if alldata == None:
            outDict["error"] = True
            outDict["message"] = "The attraction_id is not valid."
            return jsonify(outDict),400
        else:
            inDict = {}
            inDict["id"] = alldata[0]
            inDict["name"] = alldata[1]
            inDict["category"] = alldata[2]
            inDict["description"] = alldata[3]
            inDict["address"] = alldata[4]
            inDict["transport"] = alldata[5]
            inDict["mrt"] = alldata[6]
            inDict["lat"] = alldata[7]
            inDict["lng"] = alldata[8]
            image ="".join(alldata[9].strip('][')).replace("'","").split(", ")
            inDict["images"] = image
            outDict["data"]=inDict
            return jsonify(outDict),200
    except:
        # 伺服器內部錯誤
        outDict["error"] = True
        outDict["message"] = "There is something wrong."
        return jsonify(outDict),500

# api 旅遊景點分類

@attraction_blueprint.route("/api/categories",methods=["GET"])
def getCategoriesAttractions():
    conn=openDB()
    cursor = conn.cursor()
    cursor.execute("SELECT category FROM attraction;")
    alldata = cursor.fetchall()
    cursor.close()
    conn.close()
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