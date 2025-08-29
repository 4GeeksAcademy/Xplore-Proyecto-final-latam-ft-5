# src/api/routes.py
from __future__ import annotations

# ============================================================================
# 📦 Imports
# ============================================================================
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from .models import (
    db, User, UserRole, Tour, TourSchedule, Booking, Review,
    Country, Category, Image, Role
)
from .utils import APIException

# ============================================================================
# 🔧 Blueprint
# ============================================================================
api = Blueprint("api", __name__)

# ============================================================================
# 🧩 Helpers
# ============================================================================
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


# ============================================================================
# 🔐 AUTH (signup / proveedor signup / login)
#   * Importante: el JWT debe tener identity como string
# ============================================================================
@api.post("/signup")
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


@api.post("/proveedor/signup")
def proveedor_signup():
    """
    Alias para registro de proveedor; fuerza rol 'provider'.
    """
    body = request.get_json(silent=True) or {}
    body["role"] = "provider"

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    role = _parse_role("provider") if hasattr(User, "role") else None

    user = User(email=email, name=name, last_name=last_name)
    if role is not None:
        setattr(user, "role", role)

    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # 🔑 FIX: identity como string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 201


@api.post("/login")
def login():
    """
    Login por email/password.
    Devuelve JWT + datos serializados del usuario.
    """
    body = request.get_json(silent=True)
    if not body:
        raise APIException("No se recibieron datos", 400)

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


# ============================================================================
# 👤 PROFILE (GET / PUT/PATCH)
#   * Al leer el JWT, convertir la identity a int antes de consultar DB
# ============================================================================
@api.get("/profile")
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


# ============================================================================
# ❤️ Healthcheck + handler de errores
# ============================================================================
@api.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@api.errorhandler(APIException)
def handle_api_exception(err: APIException):
    return jsonify(err.to_dict()), err.status_code


# ============================================================================
# 🧭 TOURS (listar / crear / por id)
# ============================================================================
@api.get("/tours")
def get_tours():
    """
    Devuelve todos los tours.
    (Cuando agreguen filtros/paginado: usen querystring aquí)
    """
    tours = Tour.query.all()
    return jsonify([t.serialize() for t in tours]), 200


@api.post("/tours")
@jwt_required()
def create_tour():
    """
    Crea un tour. Si tienen M2M de roles y quieren restringir,
    descomenten la parte de permisos.
    """
    try:
        current_user_id = int(get_jwt_identity())  # ← FIX
        user = User.query.get(current_user_id)

        # --- Permiso opcional con M2M (tolerante si no existe) ---
        try:
            roles = [r.name.lower() for r in getattr(user, "roles", [])]
            if roles and "provider" not in roles and "admin" not in roles:
                raise APIException("No tiene permiso para crear tours", 403)
        except Exception:
            pass
        # ----------------------------------------------------------

        data = request.get_json(silent=True) or {}
        required = ("title", "city", "base_price", "country_id")
        if not all(k in data and str(data[k]).strip() for k in required):
            raise APIException("Faltan campos requeridos", 400)

        new_tour = Tour(
            title=str(data["title"]),
            description=str(data.get("description") or ""),
            city=str(data["city"]),
            base_price=data["base_price"],  # Numeric en modelo
            user_id=current_user_id,
            country_id=int(data["country_id"]),
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


@api.get("/tours/<int:tour_id>")
def get_tour(tour_id):
    tour = Tour.query.get(tour_id)
    if not tour:
        raise APIException("Tour no encontrado", 404)
    return jsonify(tour.serialize()), 200


# ============================================================================
# 📆 BOOKINGS (crear)
# ============================================================================
@api.post("/bookings")
@jwt_required()
def create_booking():
    try:
        current_user_id = int(get_jwt_identity())  # ← FIX
        user = User.query.get(current_user_id)

        # --- Permiso opcional con M2M (tolerante si no existe) ---
        try:
            roles = [r.name.lower() for r in getattr(user, "roles", [])]
            if roles and "traveler" not in roles and "admin" not in roles:
                raise APIException("No tiene permiso para crear reservas", 403)
        except Exception:
            pass
        # ----------------------------------------------------------

        data = request.get_json(silent=True) or {}
        required = ("tour_id", "schedule_id", "num_guests")
        if not all(k in data for k in required):
            raise APIException("Faltan campos requeridos", 400)

        tour = Tour.query.get(int(data["tour_id"]))
        schedule = TourSchedule.query.get(int(data["schedule_id"]))
        if not tour or not schedule:
            raise APIException("Tour o horario no encontrado", 404)

        guests = int(data["num_guests"])
        if guests <= 0 or guests > int(schedule.available_slots):
            raise APIException("Número de invitados no válido o sin cupo", 400)

        total_price = tour.base_price * guests

        new_booking = Booking(
            user_id=current_user_id,
            tour_id=tour.id,
            schedule_id=schedule.id,
            num_guests=guests,
            total_price=total_price,
            status="confirmed",
        )
        schedule.available_slots = int(schedule.available_slots) - guests

        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"[create_booking] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# ============================================================================
# ⭐ REVIEWS (agregar)
# ============================================================================
@api.post("/tours/<int:tour_id>/reviews")
@jwt_required()
def add_review(tour_id):
    try:
        current_user_id = int(get_jwt_identity())  # ← FIX
        data = request.get_json(silent=True) or {}

        tour = Tour.query.get(tour_id)
        if not tour:
            raise APIException("Tour no encontrado", 404)

        if "rating" not in data:
            raise APIException("Falta la calificación ('rating')", 400)

        new_review = Review(
            tour_id=tour_id,
            user_id=current_user_id,
            comment=data.get("comment"),
            rating=data["rating"],
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