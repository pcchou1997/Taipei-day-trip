from flask import Blueprint
from flask import request
 
booking_blueprint = Blueprint('booking', __name__)
 
@booking_blueprint.route('/api/booking')
def booking():
    if request.method=='GET':
        return "GET"
    if request.method=='POST':
        return "POST"
    if request.method=='DELETE':
        return "DELETE"