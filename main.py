from flask import *

from function.accessDB import *
from api.booking import booking_blueprint
from api.user import user_blueprint
from api.attraction import attraction_blueprint
from api.order import order_blueprint

# from flask_cors import CORS
# from flask_cors import cross_origin

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False # 支援 JSON 顯示中文
app.config["JSON_SORT_KEYS"] = False # JSON 輸出瀏覽器不會自動排序
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.register_blueprint(booking_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(attraction_blueprint)
app.register_blueprint(order_blueprint)

# cors = CORS(app, resources={r"/api/*": {"origins": "*"}}) #所有api路徑都可以使用CORS
# CORS(app)
    
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