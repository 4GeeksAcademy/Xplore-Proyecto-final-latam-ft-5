
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from flask import  request, jsonify, Blueprint
# src/api/routes.py
from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from .models import db, User
from .utils import APIException

api = Blueprint("api", __name__)

# ---------- SIGNUP ----------
@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    role_str = (body.get("role") or "traveler").strip().lower()
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    try:
        #role = UserRole(role_str)
        pass
    except ValueError:
        return jsonify({"msg": "El rol debe ser 'traveler' o 'provider'"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    user = User(email=email, role=role_str, name=name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente", "user": user.serialize()}), 201

@api.route("/proveedor/signup", methods=["POST"])
def proveedor_signup():
    try:
        data = request.get_json(silent=True) or {}
        # TODO: Agregar validación de datos
        
        return jsonify({
            "msg": "Proveedor registrado con éxito",
            "data": data
        }), 201
    except Exception as e:
        return jsonify({"msg": f"Error al registrar proveedor: {str(e)}"}), 400


# ---------- LOGIN ----------
@api.route("/login", methods=["POST"])
def login():
    try:
        # Obtener y validar datos
        body = request.get_json(silent=True)
        if not body:
            raise APIException("No se recibieron datos", status_code=400)

        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            raise APIException("Email y contraseña son requeridos", status_code=400)

        # Buscar usuario y validar contraseña
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            raise APIException("Credenciales inválidas", status_code=401)

        # Generar token
        access_token = create_access_token(identity=user.id)
        
        # Log de acceso exitoso
        print(f"Login exitoso para {email}")
        
        return jsonify({
            "access_token": access_token,
            "user": user.serialize()
        }), 200

    except APIException as e:
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        print(f"Error inesperado en login: {str(e)}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ---------- PROFILE (PROTEGIDO) ----------
@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


# Manejo básico de errores si quieres usar APIException en tu app
@api.errorhandler(APIException)
def handle_api_exception(err):
    return jsonify(err.to_dict()), err.status_code
