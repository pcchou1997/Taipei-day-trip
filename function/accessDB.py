from mysql.connector import pooling
import os
from dotenv import load_dotenv
load_dotenv()

database_password = os.getenv("database_password")

# 打開資料庫 
def openDB():
    pool=pooling.MySQLConnectionPool(
        pool_name="mypool_TaipeiDayTripDB",
        pool_size=20,
        pool_reset_session=True,
        host='localhost',
        user='root',
        password=database_password,
        db='TaipeiDayTripDB',
        charset='utf8mb4')
    conn = pool.get_connection()
    return conn

# 關閉資料庫 
def closeDB(conn,cursor):
    cursor.close()
    conn.close()