# src/api/routes.py
from __future__ import annotations

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from .models import db, User, UserRole
from .utils import APIException

from . import api

api = Blueprint("api", __name__)


# ----------------------- Helpers -----------------------

def _parse_role(role_raw: str | None) -> UserRole:
    """
    Convierte el string del body a UserRole (Enum).
    Acepta variantes en minúsculas: 'traveler', 'provider', 'admin'.
    Por defecto TRAVELER.
    """
    if not role_raw:
        return UserRole.TRAVELER
    txt = role_raw.strip().upper()
    # permitir alias comunes
    aliases = {
        "TRAVELER": UserRole.TRAVELER,
        "PROVIDER": UserRole.PROVIDER,
        "ADMIN": UserRole.ADMIN,
    }
    # también aceptar minúsculas comunes
    if txt.lower() in ("traveler", "user"):
        return UserRole.TRAVELER
    if txt.lower() in ("provider", "proveedor"):
        return UserRole.PROVIDER
    if txt.lower() == "admin":
        return UserRole.ADMIN
    # si envían exactamente el valor del enum
    return aliases.get(txt, UserRole.TRAVELER)


# ----------------------- SIGNUP -------NO TOCAR-----------------

@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    user = User(email=email, name=name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.serialize()}), 201


@api.post("/proveedor/signup")
def proveedor_signup():
    """
    Alias para registro de proveedor. Reusa la lógica de signup
    pero fuerza el rol PROVIDER si no va en el body.
    """
    body = request.get_json(silent=True) or {}
    body.setdefault("role", "provider")
    # Reusar validaciones de /signup sin duplicar lógica:
    with api.test_request_context(json=body):
        return signup()


# ------------------------ LOGIN --------------NO TOCAR----------

@api.post("/login")
def login():
    body = request.get_json(silent=True)
    if not body:
        raise APIException("No se recibieron datos", 400)

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        raise APIException("Email y contraseña son requeridos", 400)

    # Buscar al usuario en DB
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise APIException("Credenciales inválidas", 401)

    # Generar token JWT
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200

# ----------------------- PROFILE -----------------------

@api.route("/profile", methods=["PUT", "PATCH"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException("Usuario no encontrado", 404)

    body = request.get_json(silent=True) or {}
    # Solo permitimos campos conocidos y existentes en el modelo
    updated = False
    for field in ("name", "last_name"):
        if field in body and hasattr(user, field):
            setattr(user, field, (body.get(field) or "").strip())
            updated = True

    if not updated:
        return jsonify({"msg": "Nada para actualizar", "user": user.serialize()}), 200

    db.session.commit()
    return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200


# ------------------ Health / Info opcional --------------

@api.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


# -------------------- Error handler ---------------------

@api.errorhandler(APIException)
def handle_api_exception(err: APIException):
    return jsonify(err.to_dict()), err.status_code
