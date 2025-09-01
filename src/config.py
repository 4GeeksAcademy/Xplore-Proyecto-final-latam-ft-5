import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Carga variables del .env en el entorno (lo dejamos por si otras partes lo usan)
load_dotenv()

# --- PRUEBA DE DIAGNÓSTICO ---
# Vamos a ignorar todas las variables del .env y a poner la URL directamente.
# Esto nos ayudará a confirmar si el problema es el archivo .env.

# --- CONFIGURACIÓN DE BASE DE DATOS ---
# Usar PostgreSQL para desarrollo local
DB_USER = os.getenv("DB_USER", "gitpod")
DB_PASS = quote_plus(os.getenv("DB_PASS", "postgres"))
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "example")

SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# -----------------------------


# --- El código original queda comentado temporalmente ---
# DB_USER = os.getenv("DB_USER", "gitpod")
# DB_PASS = quote_plus(os.getenv("DB_PASS", "postgres"))
# DB_HOST = os.getenv("DB_HOST", "localhost")
# DB_PORT = os.getenv("DB_PORT", "5432")
# DB_NAME = os.getenv("DB_NAME", "example")
# DATABASE_URL_ENV = os.getenv("DATABASE_URL")
# if DATABASE_URL_ENV:
#     DATABASE_URL_ENV = DATABASE_URL_ENV.replace("postgres://", "postgresql://")
# SQLALCHEMY_DATABASE_URI = DATABASE_URL_ENV or (
#     f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# )
# ----------------------------------------------------


# Configs extra
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Secrets
SECRET_KEY = os.getenv("SECRET_KEY", "cambia_este_secret_key")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "cambia_este_jwt_secret")
