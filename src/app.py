"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager

# IMPORTS RELATIVOS (porque el app es src.app)
from flask_cors import CORS  # <-- 1. Importa CORS

# --- Imports del proyecto (relativos al paquete src) ---
from .config import (
    SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS,
    SECRET_KEY,
    JWT_SECRET_KEY,
)
from .api.utils import APIException, generate_sitemap
from .api.models import db, bcrypt
from .api.routes import api
from .api.admin import setup_admin
from .api.commands import setup_commands

# --- Inicialización de la App ---
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "../dist/")

app = Flask(__name__)
app.url_map.strict_slashes = False


# --- 2. Habilita CORS para toda la aplicación ---
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000",
     "https://animated-telegram-xggv7g9jpw936wv-3000.app.github.dev"]}})

# ---- Configuración de Flask/DB/JWT ----
app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

# ---- Inicialización de Extensiones ----
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
MIGRATE = Migrate(app, db, compare_type=True)

# ---- Registro de Componentes ----
setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix="/api")

# ---- Manejadores de Errores y Rutas Estáticas ----


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")


@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response


# ---- Creación de Tablas ----
with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        print(f"[DB INIT] Error creando tablas: {e}")

# ---- Punto de Entrada Principal ----
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
