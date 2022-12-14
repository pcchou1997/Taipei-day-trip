from flask import *
from flask import Blueprint
from flask import request
import jwt
from datetime import datetime,timedelta
from function.accessDB import *
 
user_blueprint = Blueprint('user', __name__)

# 註冊新會員 /api/user (POST)
@user_blueprint.route("/api/user",methods=["POST"])
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
@user_blueprint.route("/api/user/auth",methods=["GET"])
def getCurrentLoginInfo():
    token = request.cookies.get("token")
    if token != None:
        decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
        return decodedtoken
    else:
       return jsonify(None)

# 登入會員帳戶 /api/user/auth (PUT)
@user_blueprint.route("/api/user/auth",methods=["PUT"])
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
@user_blueprint.route("/api/user/auth",methods=["DELETE"])
def logout():
    # 刪除cookies
    res = jsonify({"ok": True})
    res.set_cookie(key='token',expires=0)
    return res