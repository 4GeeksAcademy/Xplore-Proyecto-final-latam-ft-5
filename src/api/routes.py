
from flask import request, jsonify, Blueprint
from .models import db, User, UserRole
from flask_jwt_extended import create_access_token
api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def create_user():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    role_str = body.get("role")
    if not email or not password or not role_str:
        return jsonify({"msg": "Email, contraseña y rol son requeridos"}), 400

    try:
        role = UserRole(role_str)
    except ValueError:
        return jsonify({"msg": "El rol debe ser 'traveler' o 'provider'"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "Este email ya está registrado"}), 409

    new_user = User(email=email, role=role)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente", "user": new_user.serialize()}), 201