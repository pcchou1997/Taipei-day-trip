from flask import *
from flask import Blueprint
from flask import jsonify
from flask import request
from function.accessDB import *
import jwt
import requests
import os
from dotenv import load_dotenv
load_dotenv()
partner_key = os.getenv("partner_key")
merchant_id = os.getenv("merchant_id")
print(partner_key)


order_blueprint = Blueprint('order', __name__)

orderNum = 0 
@order_blueprint.route('/api/orders', methods=['POST'])
def orders():

    # 取得使用者資訊
    token = request.cookies.get("token")
    
    if token == None:
        return jsonify({"error": True, "message": "未登入系統"}),403
    
    else:
        try:

            decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
            # decodedtoken: {'data': {'id': 1, 'name': 'jane', 'email': '123'}, 'exp': 1671989977, 'iat': 1671385177}
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
                return jsonify({"error": True,"message": "訂單建立失敗"}),400

            # 打開資料庫，建入「未付款」訂單資料
            conn = openDB()
            cursor = conn.cursor()
            cursor.execute("""INSERT INTO orders(user_id,user_name,contact_name,contact_email,contact_phone,attraction_id,attraction_name,attraction_address,attraction_image,date,time,price,isPaid)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,false);""",(userId,userName,name,email,phone,attraction_id,attraction_name,attraction_address,attraction_image,date,time,price))
            conn.commit()
            closeDB(conn,cursor)

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
            orderData = requests.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", json = orderData,headers={'Content-Type': 'application/json','x-api-key': partner_key})
            # print("orderData: ",orderData)
            # print("orderData.text: ",orderData.text)
            print("orderData.text.msg: ",orderData.json()["msg"])
            print("orderData.text.msg: ",orderData.json()["status"])
            
            
            # 確認是否付款成功

            # 付款成功
            if orderData.json()["msg"] == "Success" and orderData.json()["status"]==0 :

                # 打開資料庫，將訂單更改為「已付款」狀態
                conn = openDB()
                cursor = conn.cursor()
                cursor.execute("""UPDATE orders SET isPaid=true WHERE user_id = %s;""",(userId,))
                conn.commit()
                # cursor.execute("""SELECT order_Id FROM orders WHERE user_id = %s;""",(userId,))
                # order_Id = cursor.fetchone()["0"]
                # print("order_Id",order_Id)
                closeDB(conn,cursor)

                # number = date + order_Id
                return jsonify({"data": {
                        "number": date,
                        "payment": {
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                }),200

            # 付款失敗
            else:
                return jsonify({"error": True,"message": "付款失敗"}),400
        except:
            return jsonify({"error": True,"message": "伺服器內部錯誤"}),500

        


# @order_blueprint.route('/api/order/{orderNumber}', methods=["GET"])
# def getOrderData():
            