from flask import *
from flask import Blueprint
from flask import jsonify
from flask import request
from function.accessDB import *
import jwt
import requests
import os
import datetime
from dotenv import load_dotenv
load_dotenv()
partner_key = os.getenv("partner_key")
merchant_id = os.getenv("merchant_id")
print(partner_key)


order_blueprint = Blueprint('order', __name__)

orderNum = 0 
@order_blueprint.route('/api/orders', methods=['POST'])
def orders():
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

            # 取得前端傳來資料
            print(request.json)
            prime = request.json["prime"]
            name =request.json["order"]["contact"]["name"]
            email =request.json["order"]["contact"]["email"]
            phone =request.json["order"]["contact"]["phone"]
            attraction_id =request.json["order"]["trip"]["attraction"]["id"]
            attraction_name =request.json["order"]["trip"]["attraction"]["name"]
            attraction_address =request.json["order"]["trip"]["attraction"]["address"]
            attraction_image =request.json["order"]["trip"]["attraction"]["image"]
            date =request.json["order"]["trip"]["date"]
            time =request.json["order"]["trip"]["time"]
            price = request.json["order"]["price"]

            # 檢查資料是否有空值
            if name=="" or email=="" or phone=="":
                return jsonify({"error": True,"message": "任一資訊欄未填寫，訂單建立失敗"}),400
            elif userName != name:
                return jsonify({"error": True,"message": "登入身份、訂購者名稱不符，訂單建立失敗"}),400
            else:
                # 打開資料庫，建立「未付款」訂單資料
                conn = openDB()
                cursor = conn.cursor()
                cursor.execute("""INSERT INTO orders(user_id,user_name,contact_name,contact_email,contact_phone,attraction_id,attraction_name,attraction_address,attraction_image,date,time,price,isPaid)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,false);""",(userId,userName,name,email,phone,attraction_id,attraction_name,attraction_address,attraction_image,date,time,price))
                conn.commit()

                # 抓取最高的訂單編號，因可能重複點擊按鈕建立多次，或是過去訂單已完成，再次下單
                cursor.execute("""SELECT order_Id FROM orders WHERE user_id = %s ORDER BY order_id DESC LIMIT 1;""",(userId,))
                order_Id = cursor.fetchone()[0]
                closeDB(conn,cursor)

                # 取得訂單流水號 = 今天日期 + 訂單編號
                dateTime_now = datetime.datetime.now().strftime("%Y%m%d")
                serialNumber = dateTime_now + str(order_Id).zfill(5) # '2022122500001'

                # 連接TapPay伺服器，進行付款動作
                orderData = {
                    "prime": prime,
                    "partner_key": partner_key,
                    "merchant_id": merchant_id,
                    "details": "TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": phone,
                        "name": name,
                        "email": email,
                        "zip_code": "",
                        "address": "",
                        "national_id": ""
                    },
                    "remember": True
                }

                payResponse = requests.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", json = orderData,headers={'Content-Type': 'application/json','x-api-key': partner_key})
                print("payResponse.json().msg: ",payResponse.json()["msg"])
                print("payResponse.json().status: ",payResponse.json()["status"])

                # 若付款成功
                if payResponse.json()["msg"] == "Success" and payResponse.json()["status"]==0 :

                    # 打開資料庫，將訂單更改為「已付款」狀態、加入流水號
                    conn = openDB()
                    cursor = conn.cursor()
                    cursor.execute("""UPDATE orders SET isPaid=true,serialNumber=%s WHERE user_id = %s;""",(serialNumber,userId))
                    conn.commit()
                    cursor.execute("""DELETE FROM booking WHERE userId = %s;""",(userId,))
                    conn.commit()
                    closeDB(conn,cursor)


                    return jsonify({"data": {
                            "number": serialNumber,
                            "payment": {
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    }),200

                # 若付款失敗
                else:
                    return jsonify({"data": {
                            "number": serialNumber,
                            "payment": {
                                "status": 1,
                                "message": "付款失敗"
                            }
                        }
                    }),200
    except:
        return jsonify({"error": True,"message": "伺服器內部錯誤"}),500

@order_blueprint.route('/api/order/<orderNumber>', methods=["GET"])
def getOrderData(orderNumber):
    try:

        # 取得使用者資訊
        token = request.cookies.get("token")
        
        # 若未登入
        if token == None:
            return jsonify({"error": True, "message": "未登入系統"}),403
        
        # 已登入
        else:
            decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
            userName = decodedtoken["data"]["name"]

            # 打開資料庫，獲得訂單資料
            conn = openDB()
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM orders WHERE serialNumber = %s;""",(orderNumber,))
            data = cursor.fetchone()
            print("data:",data)
            
            if data == None:
                return jsonify({"error": True,"message": "查無訂單"}),400
            
            # 整理資料
            else:
                orderData={
                    "data": {
                        "number":orderNumber ,
                        "price": data[12],
                        "trip": {
                        "attraction": {
                            "id": data[6],
                            "name": data[7],
                            "address": data[8],
                            "image": data[9]
                        },
                        "date": data[10],
                        "time": data[11]
                        },
                        "contact": {
                        "name": data[3],
                        "email": data[4],
                        "phone": data[5]
                        },
                        "status": data[13]
                    }
                }
        return jsonify(orderData),200        
    except:
        return jsonify({"error": True,"message": "伺服器內部錯誤"}),500
            