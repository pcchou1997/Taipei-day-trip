from flask import *
from flask import Blueprint
from flask import jsonify
from flask import request
from function.accessDB import *
import jwt
 
booking_blueprint = Blueprint('booking', __name__)
 
@booking_blueprint.route('/api/booking', methods=["GET",'POST',"DELETE"])
def booking():
    if request.method == 'GET':

            # 取得使用者資訊
            token = request.cookies.get("token")
            
            if token == None:
                return jsonify({"error": True, "message": "未登入系統"}),403

            else:
                decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
                # decodedtoken: {'data': {'id': 1, 'name': 'jane', 'email': '123'}, 'exp': 1671989977, 'iat': 1671385177}
                userId = decodedtoken["data"]["id"]
                userName = decodedtoken["data"]["name"]

                # 進入資料庫取得「預定行程資料」
                conn = openDB()
                cursor = conn.cursor()
                cursor.execute("""select * from booking where userId = %s """,(userId,))
                data = cursor.fetchone()
                closeDB(conn,cursor)

                # 沒有預定資料
                if data == None:
                    return jsonify({"name":userName,"data":None})
                
                # 有預定資料
                else:
                    # 進入資料庫，找出該用戶預定景點的詳細資料
                    conn = openDB()
                    cursor = conn.cursor()
                    cursor.execute("""select * from attraction where id = %s """,(data[2],)) # attraction_id
                    attraction_data = cursor.fetchone()
                    # attraction_data: (2, '大稻埕碼頭', '藍色公路', '大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻埕淡水河旁商店和房屋的興建，淡水港開放後，大稻埕在劉銘傳的治理下成為臺北城最繁華的物資集散中心，當中以茶葉、布料為主要貿易交易，當時的延平北路及貴德街一帶便是商業活動的重心，也讓大稻埕早年的歷史多采多姿、令人回味。 ', '臺北市  大同區環河北路一段', '捷運站名：雙連站，轉乘紅33(固定班次)於大稻埕碼頭站下車。公車：9、206、274、641、669、704至大稻埕碼頭站及255、518、539至民生西路口站，再沿民生西路底方向步行約10分鐘抵達。 開車：沿著環河北路依大稻埕碼頭入口指引便可抵達。', '雙連', '25.056847', '121.508274', "['https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D906/E6/F186/809f30db-7079-421f-a625-7baa8ec21874.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000341.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D878/E420/F173/04765739-d40f-4d13-b271-8d5f9e5f44bd.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000342.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D20/E983/F199/866b5059-8fd7-4719-964c-51d2f78675d5.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D546/E538/F353/ed2464d1-bc28-4790-96cd-5216db2c14f5.jpg', 'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C1/D814/E111/F733/aed9d34d-890c-49fd-83ca-f76f38e4b94b.jpg']")
                    closeDB(conn,cursor)
                    # return jsonify({"ok": True}),200

                    image = "".join(attraction_data[9].strip('][')).replace("'","").split(", ")
                    if data[4] == "morning":
                        time = "早上9點到12點"
                    else:
                        time = "下午1點到4點"
                    # 整理成json資料
                    outerDict = {}
                    dataDict = {}
                    attractionDict = {}
                    attractionDict["id"] = attraction_data[0]
                    attractionDict["name"] = attraction_data[1]
                    attractionDict["address"] = attraction_data[4]
                    attractionDict["image"] = image
                    dataDict["attraction"] = attractionDict
                    outerDict["data"] = dataDict
                    outerDict["date"] = data[3]
                    outerDict["time"] = time
                    outerDict["price"] = data[5]
                    return jsonify(outerDict),200

    # 建立新的預定行程 
    if request.method == 'POST':
        try:
            attractionId = request.json["attractionId"]
            date = request.json["date"]
            time = request.json["time"]
            price = request.json["price"]
            price = int(price)
            
            token = request.cookies.get("token")
            
            # 有登入系統
            if token != None:
                decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
                userId = decodedtoken["data"]["id"]

                # 如果未選擇日期，則建立失敗
                if date == "":
                    return jsonify({"error": True, "message": "請選擇日期"}),400

                # 打開資料庫，將預定行程存入資料庫
                else:
                    conn = openDB()
                    cursor = conn.cursor()
                    
                    cursor.execute("""select * from booking where userId = %s ;""",(userId,))
                    data = cursor.fetchone()
                    if(data != None):
                        cursor.execute("""DELETE FROM booking WHERE userId = %s;""",(userId,))
                        conn.commit()
                    cursor.execute("""INSERT INTO booking(userId,attractionId,date,time,price)values(%s,%s,%s,%s,%s);""",(userId,attractionId,date,time,price))
                    conn.commit()
                    closeDB(conn,cursor)
                    return jsonify({"ok": True}),200
                    
            # 未登入系統
            else:
                return jsonify({"error": True, "message": "未登入系統"}),403
            
        # 內部伺服器錯誤
        except:
            return jsonify({"error": True, "message": "內部伺服器錯誤"}),500

    if request.method == 'DELETE':
        try:
            token = request.cookies.get("token")

            # 有登入狀態
            if token == None:
                return jsonify({"error": True, "message": "未登入系統"}),403

            # 無登入狀態
            else:
                decodedtoken = jwt.decode(token,"secret", algorithms = ["HS256"])
                userId = decodedtoken["data"]["id"]

                # 進入資料庫，刪除預定資料
                conn = openDB()
                cursor = conn.cursor()
                cursor.execute("""DELETE FROM booking WHERE userId = %s;""",(userId,))
                conn.commit()
                closeDB(conn,cursor)
                return jsonify({"ok": True}),200

        #  內部伺服器錯誤
        except:
                return jsonify({"error": True, "message": "內部伺服器錯誤"}),500