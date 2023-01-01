from flask import *
from flask import Blueprint
from flask import jsonify
from flask import request
from function.accessDB import *
import jwt

member_blueprint = Blueprint('member', __name__)

@member_blueprint.route('/api/history', methods=['GET'])
def history():
    try:

        # 取得使用者資訊
        token = request.cookies.get("token")
        
        # 若未登入
        if token == None:
            return jsonify({"error": True, "message": "未登入系統"}),403
        
        # 已登入
        else:
            decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
            userId = decodedtoken["data"]["id"]
            userName = decodedtoken["data"]["name"]

            # 打開資料庫，取得歷史訂單資料
            conn = openDB()
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM orders WHERE user_id = %s and user_name = %s;""",(userId,userName))
            data = cursor.fetchall()
            closeDB(conn,cursor)
            
            if data == None:
                return jsonify({"error": True,"message": "查無訂單"}),400
            
            # 整理資料
            else:
                historyData={}
                orders=[]
                for each in data:
                    eachData = {
                        "data": {
                            "number": each[14],
                            "isPaid":each[13],
                            "price": each[12],
                            "trip": {
                            "attraction": {
                                "id": each[6],
                                "name": each[7],
                                "address": each[8],
                                "image": each[9]
                            },
                            "date": each[10],
                            "time": each[11]
                            },
                            "contact": {
                            "name": each[3],
                            "email": each[4],
                            "phone": each[5]
                            }
                        }
                    }
                    orders.append(eachData)
        historyData["orders"] = orders
        return jsonify(historyData),200        
    except:
        return jsonify({"error": True,"message": "伺服器內部錯誤"}),500
            