import os
from psycopg2 import pool
from dotenv import load_dotenv

load_dotenv()

try:
    db_pool = pool.SimpleConnectionPool(
        1, 10,
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT")
    )
    print("Database connected")
except Exception as e:
    print("DB connection failed:", e)

def get_db_connection():
    if db_pool is None:
        raise Exception("Database pool not initialized")

    conn = db_pool.getconn()
    try:
        yield conn
    finally:
        db_pool.putconn(conn)

