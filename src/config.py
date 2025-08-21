# src/config.py
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Carga variables del .env en el entorno
load_dotenv()

# ---- Credenciales por partes (útiles en local) ----
DB_USER = os.getenv("DB_USER", "gitpod")
DB_PASS = quote_plus(os.getenv("DB_PASS", "postgres"))  # codifica símbolos/acentos
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "example")

# ---- DATABASE_URL completa (útil en despliegues) ----
# Acepta "postgres://" (Heroku) y lo pasa a "postgresql://"
DATABASE_URL_ENV = os.getenv("DATABASE_URL")
if DATABASE_URL_ENV:
    DATABASE_URL_ENV = DATABASE_URL_ENV.replace("postgres://", "postgresql://")

# URI final para SQLAlchemy: prioriza DATABASE_URL si existe; si no, arma con partes
SQLALCHEMY_DATABASE_URI = DATABASE_URL_ENV or (
f"postgresql+psycopg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

)

# Configs extra
SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", "False") == "True"

# Secrets
SECRET_KEY = os.getenv("SECRET_KEY", "cambia_este_secret_key")
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "cambia_este_jwt_secret")
