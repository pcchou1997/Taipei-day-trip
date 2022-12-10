from flask import *
import mysql.connector
from mysql.connector import pooling
import math
import jwt
from datetime import datetime,timedelta
# from flask_cors import CORS
# from flask_cors import cross_origin

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False # 支援 JSON 顯示中文
app.config["JSON_SORT_KEYS"] = False # JSON 輸出瀏覽器不會自動排序
app.config["TEMPLATES_AUTO_RELOAD"] = True

# cors = CORS(app, resources={r"/api/*": {"origins": "*"}}) #所有api路徑都可以使用CORS
# CORS(app)

# 打開 siteDB 資料庫 
def openSiteDB():
    pool=pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=20,
        pool_reset_session=True,
        host='localhost',
        user='root',
        password='Aaa-860221',
        db='siteDB',
        charset='utf8mb4')
    conn = pool.get_connection()
    return conn

# 打開 memberDB 資料庫 
def openMemberDB():
    pool=pooling.MySQLConnectionPool(
        pool_name="mypool2",
        pool_size=20,
        pool_reset_session=True,
        host='localhost',
        user='root',
        password='Aaa-860221',
        db='TaipeiDayTripMemberDB',
        charset='utf8mb4')
    conn = pool.get_connection()
    return conn

# 關閉資料庫 
def closeDB(conn,cursor):
    cursor.close()
    conn.close()
    
# api 旅遊景點

@app.route("/api/attractions",methods=["GET"])
def getAttractions():
    page = request.args.get("page","")
    page = int(page)
    keyword = request.args.get("keyword","")
    outDict = {}
    indictList = []
    
    head_id = 12*page
    try:
        conn=openSiteDB()
        cursor = conn.cursor()
        # 判斷有無keyword，執行對應sql指令
        if keyword != "":
            cursor.execute("SELECT * FROM site WHERE name REGEXP %s OR category= %s LIMIT %s, %s;",(str(keyword),str(keyword),head_id,12))
            alldata = cursor.fetchall()
            cursor.close()
            conn.close()
        else:
            
            cursor.execute("SELECT * FROM site LIMIT %s, %s;",(head_id,12))
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

@app.route("/api/attraction/<attractionId>",methods=["GET"])
def getIdAttractions(attractionId):
    conn=openSiteDB()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM site WHERE id=%s;",(attractionId,))
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

@app.route("/api/categories",methods=["GET"])
def getCategoriesAttractions():
    conn=openSiteDB()
    cursor = conn.cursor()
    cursor.execute("SELECT category FROM site;")
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

# 註冊新會員 /api/user (POST)
@app.route("/api/user",methods=["POST"])
def signup():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    conn = openMemberDB()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM member WHERE email= %s;",(email,))
    data = cursor.fetchall()
    closeDB(conn,cursor)
    # print("data:",data)
    outerDict={}
    try:
        if data ==[]:
            conn = openMemberDB()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO member(name,email,password)values(%s,%s,%s);",(name,email,password))
            conn.commit() 
            outerDict["ok"]=True
            return jsonify(outerDict),200
        else:
            outerDict["error"]=True
            outerDict["message"] = "已有使用者註冊過"
            return jsonify(outerDict),400
    except:
        outerDict["error"]=True
        outerDict["message"]="Sorry，網頁存在內部錯誤"
        return jsonify(outerDict),500

# 取得當前登入會員資訊 /api/user/auth (GET)
@app.route("/api/user/auth",methods=["GET"])
def getCurrentLoginInfo():
    token = request.cookies.get("token")
    if token != None:
        decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
        return decodedtoken
    else:
       return jsonify(None)

# 登入會員帳戶 /api/user/auth (PUT)
@app.route("/api/user/auth",methods=["PUT"])
def signin():
    email = request.json.get("email") 
    password = request.json.get("password") 
    conn = openMemberDB()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM member WHERE email=%s and password=%s;",(email,password,))
    data = cursor.fetchone()
    closeDB(conn,cursor)
    # print("data:",data)
    try:
        if data != None:
            res = jsonify({
            "ok": True
            })

            # JWT 編碼簽名
            expire = datetime.now() + timedelta(days=7)
            payload = {
                'data': {  # 内容，一般存放使用者資訊
                    "id": data[0],
                    "name":data[1],
                    "email": data[2],
                    },
                'exp': expire,  # 過期時間
                'iat': datetime.now(),  # 開始時間
                # 'iss': 'PC',  # 簽名
            }
            token = jwt.encode(payload, "secret", algorithm = "HS256")

            # 設定Cookies
            res.set_cookie(key = 'token', value = token, expires = expire)
            return res,200
        else:
            res = {"error":True,"message":"email或密碼錯誤"}
            return res,400
    except:
        res = {"error":True,"message":"伺服器內部錯誤"}
        return res,500
    
# 登出會員帳戶 /api/user/auth (DELETE)
@app.route("/api/user/auth",methods=["DELETE"])
def logout():
    # 刪除cookies
    res = jsonify({"ok": True})
    res.set_cookie(key='token',expires=0)
    return res


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