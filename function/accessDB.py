from mysql.connector import pooling
import mysql.connector

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