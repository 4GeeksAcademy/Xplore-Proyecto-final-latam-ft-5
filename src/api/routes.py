# src/api/routes.py
from __future__ import annotations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import random


from .models import (
    db, User, UserRole, Tour, Review,
)
from .utils import APIException
from datetime import datetime, date
from faker import Faker

api = Blueprint("api", __name__)
fake = Faker()


def _parse_role(role_raw: str | None) -> UserRole:
    """
    Convierte un string a UserRole (Enum), aceptando alias comunes.
    Si no viene o no coincide, retorna TRAVELER.
    """
    if not role_raw:
        return UserRole.TRAVELER
    t = str(role_raw).strip().lower()
    if t in ("traveler", "user"):
        return UserRole.TRAVELER
    if t in ("provider", "proveedor"):
        return UserRole.PROVIDER
    if t == "admin":
        return UserRole.ADMIN
    try:
        return UserRole(role_raw)
    except Exception:
        return UserRole.TRAVELER


# ================================Auth============================================

@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()
    role_raw = body.get("role")  # opcional

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    role = _parse_role(role_raw) if hasattr(User, "role") else None

    user = User(email=email, name=name, last_name=last_name)
    if role is not None:
        setattr(user, "role", role)

    user.set_password(password)  # guarda hash en password_hash
    db.session.add(user)
    db.session.commit()

    # 🔑 FIX: identity como string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 201


# @api.route("/proveedor/signup", methods=["POST"])
# def proveedor_signup():

#     body = request.get_json(silent=True) or {}
#     body["role"] = "provider"

#     email = (body.get("email") or "").strip().lower()
#     password = body.get("password") or ""
#     name = (body.get("name") or "").strip()
#     last_name = (body.get("last_name") or "").strip()

#     if not email or not password:
#         return jsonify({"msg": "Email y contraseña son requeridos"}), 400

#     if User.query.filter_by(email=email).first():
#         return jsonify({"msg": "Este email ya está registrado"}), 409

#     role_obj = Role.query.filter_by(name=role_str).first()
#     if not role_obj:
#         return jsonify({"msg": f"El rol '{role_str}' no existe en la base de datos"}), 500

#     user = User(email=email, name=name, last_name=last_name)
#     if role is not None:
#         setattr(user, "role", role)

#     user.set_password(password)
#     db.session.add(user)
#     db.session.commit()

#     return jsonify({"msg": "Usuario creado exitosamente", "user": user.serialize()}), 201


@api.route("/proveedor/signup", methods=["POST"])
def proveedor_signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()
    role_raw = "PROVIDER"

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    role = _parse_role(role_raw) if hasattr(User, "role") else None

    user = User(email=email, name=name, last_name=last_name)
    if role is not None:
        setattr(user, "role", role)

    user.set_password(password)  # guarda hash en password_hash
    db.session.add(user)
    db.session.commit()

    # 🔑 FIX: identity como string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 201

# ===================================Login=========================================


@api.route("/login", methods=["POST"])
def login():
    try:
        print("Hola")
        # Obtener y validar datos
        body = request.get_json(silent=True)
        if not body:
            raise APIException("No se recibieron datos", status_code=400)

        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            raise APIException("Email y contraseña son requeridos", 400)

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            raise APIException("Credenciales inválidas", 401)

        # 🔑 FIX: identity como string
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": access_token, "user": user.serialize()}), 200
    except Exception as e:
        print(e.message)


# ===================================Profile=========================================

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile_me():
    user_id = int(get_jwt_identity())  # ← FIX: castear a int
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route("/profile", methods=["PUT", "PATCH"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())  # ← FIX
    user = User.query.get(user_id)
    if not user:
        raise APIException("Usuario no encontrado", 404)

    body = request.get_json(silent=True) or {}
    updated = False

    # Permitimos actualizar estos campos si existen en el modelo
    for field in ("name", "last_name", "phone"):
        if field in body and hasattr(user, field):
            setattr(user, field, (body.get(field) or "").strip())
            updated = True

    if not updated:
        return jsonify({"msg": "Nada para actualizar", "user": user.serialize()}), 200

    db.session.commit()
    return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200


# ===============================Health=============================================

@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@api.errorhandler(APIException)
def handle_api_exception(err: APIException):
    return jsonify(err.to_dict()), err.status_code


# ==============================Tours==============================================

@api.route("/tours", methods=["GET"])
def get_tours():
    tours = Tour.query.all()
    if tours == []:
        return jsonify({"msg": "Nohay tours"}), 404
    return jsonify([t.serialize() for t in tours]), 200


@api.route("/tours", methods=["POST"])
def create_tour():
    try:
        data = request.get_json(silent=True) or {}
        required = ("title", "location", "base_price")
        if not all(k in data and str(data[k]).strip() for k in required):
            raise APIException("Faltan campos requeridos", 400)

        # Crear tour
        new_tour = Tour(
            title=str(data["title"]),
            description=str(data.get("description") or ""),
            location=str(data["location"]),
            base_price=float(data["base_price"]),
            duration=str(data.get("duration") or ""),
            popular=data.get("popular") if isinstance(
                data.get("popular"), list) else [],
            tour_includes=data.get("tour_includes") if isinstance(
                data.get("tour_includes"), list) else [],
            tour_not_includes=data.get("tour_not_includes") if isinstance(
                data.get("tour_not_includes"), list) else [],
            images=data.get("images") if isinstance(
                data.get("images"), list) else [],
            rate=float(data.get("rate") or 0.0),
        )
        db.session.add(new_tour)
        db.session.commit()

        return jsonify(new_tour.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"[create_tour] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@api.route("/tours/<int:tour_id>", methods=["GET"])
def get_tour(tour_id):
    tour = Tour.query.get(tour_id)
    if not tour:
        raise APIException("Tour no encontrado", 404)
    return jsonify(tour.serialize()), 200

# ======================================Review======================================

@api.route("/tours/<int:tour_id>/reviews", methods=["POST"])
@jwt_required()
def add_review(tour_id):
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json(silent=True) or {}

        tour = Tour.query.get(tour_id)
        if not tour:
            raise APIException("Tour no encontrado", 404)

        rating = data.get("rating")
        if rating is None or not (0 <= float(rating) <= 5):
            raise APIException("Rating inválido, debe estar entre 0 y 5", 400)

        new_review = Review(
            tour_id=tour_id,
            user_id=current_user_id,
            comment=data.get("comment"),
            rating=float(rating),
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"[add_review] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@api.route("/reviews/<int:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    try:
        current_user_id = int(get_jwt_identity())
        review = Review.query.get(review_id)

        if not review:
            raise APIException("Review no encontrada", 404)

        # Solo el usuario que creó el review puede eliminarlo
        if review.user_id != current_user_id:
            raise APIException("No tienes permiso para eliminar este review", 403)

        db.session.delete(review)
        db.session.commit()
        return jsonify({"msg": "Review eliminada correctamente"}), 200

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"[delete_review] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
    
# ==================================Seeds===========================================
# warning no volver a ejecutar mas que una sola vez para cear 10 tours fakes
@api.route("/seed_tours", methods=["GET"])
def seed_tours():
    try:
        # Cantidad de tours a crear
        n = request.args.get("n", default=10, type=int)
        created = []

        for _ in range(n):
            tour = Tour(
                title=fake.sentence(nb_words=5),
                description=fake.paragraph(nb_sentences=3),
                location=fake.city(),
                base_price=round(random.uniform(50, 500), 2),
                duration=f"{random.randint(1, 14)} days",
                popular=[fake.word() for _ in range(random.randint(1, 5))],
                tour_includes=[fake.word()
                               for _ in range(random.randint(1, 5))],
                tour_not_includes=[fake.word()
                                   for _ in range(random.randint(0, 3))],
                images=[fake.image_url() for _ in range(random.randint(1, 5))],
                rate=round(random.uniform(0, 5), 1),
            )
            db.session.add(tour)
            created.append({
                "title": tour.title,
                "location": tour.location,
                "base_price": tour.base_price
            })

        db.session.commit()
        return jsonify({"msg": f"{n} tours creados exitosamente", "tours": created}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[seed_tours] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
