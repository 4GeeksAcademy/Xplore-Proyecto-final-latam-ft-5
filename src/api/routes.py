from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User, UserRole, bcrypt

api = Blueprint("api", __name__)

@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}

    email = (body.get("email") or "").strip().lower()
    password = body.get("password")
    name = body.get("name")
    last_name = body.get("last_name")
    role_raw = (body.get("role") or "traveler").strip().lower()

    if not email or not password:
        return jsonify({"msg": "email y password son obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El correo ya está registrado"}), 409

    user = User(
        email=email,
        name=name,
        last_name=last_name,
        is_active=True
    )
    if role_raw in ("traveler", "provider"):
        user.role = UserRole(role_raw)

    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creando usuario: {e}"}), 500

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@api.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "email y password son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # FIX: identity debe ser string
    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "user": user.serialize()}), 200

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # FIX: convertir de string a int para consultar la BD
    uid_str = get_jwt_identity()
    try:
        uid = int(uid_str)
    except (TypeError, ValueError):
        return jsonify({"msg": "Token inválido"}), 422

    user = User.query.get(uid)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200
