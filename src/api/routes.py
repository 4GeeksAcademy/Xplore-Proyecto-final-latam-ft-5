# src/api/routes.py
from __future__ import annotations

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from .models import db, User, UserRole, Tour, TourSchedule, Booking, Review, Country, Category, Image, Role
from .utils import APIException
from datetime import date

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

def create_app(test_config=None):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)
    global MIGRATE
    MIGRATE = Migrate(app, db)


# ---------- SIGNUP ----------
@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    last_name = (body.get("last_name") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    if role_str not in ["traveler", "provider"]:
        return jsonify({"msg": "El rol debe ser 'traveler' o 'provider'"}), 400

    role = Role.query.filter_by(name=role_str).first()
    if not role or role.name not in ["traveler", "provider"]:
        return jsonify({"msg": "El rol debe ser 'traveler' o 'provider'"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Este email ya está registrado"}), 409

    role_obj = Role.query.filter_by(name=role_str).first()
    if not role_obj:
        return jsonify({"msg": f"El rol '{role_str}' no existe en la base de datos"}), 500

    user = User(email=email, name=name, last_name=last_name)
    user.set_password(password)
    user = User(
        email=email,
        name=name,
        last_name=last_name,
        password_hash=password
    )
    user.roles.append(role)
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
        return jsonify({"msg": "Error al registrar proveedor: {str(e)}"}), 400


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


# ---------- Tours y busqueda -----------------------------------

@api.route("/tours", methods=["GET"])
def get_tours():
    tours = Tour.query.all()
    serialized_tours = [tour.serialize() for tour in tours]
    return jsonify(serialized_tours), 200


@api.route("/tour", methods=["POST"])
@jwt_required()
def create_experince():
    try:
        current_user_id = get_jwt_identity()
        print(current_user_id)
        user = User.query.get(current_user_id)
        # if "provider" not in [role.name for role in user.roles]:
        #     raise APIException(
        #         "No tiene permiso para crear tours", status_code=403)

        data = request.get_json()
        print(data)
        if not data:
            raise APIException("No se recibieron datos", status_code=400)
        # required_fields = ['title', 'city',
        #                    'base_price', 'country_id', 'description']
        # if not all(field in data for field in required_fields):
        #     raise APIException("Faltan campos requeridos.", status_code=400)

        title = str(data['title'])
        description = str(data['description'])
        city = str(data['city'])
        base_price = float(data['base_price'])
        country_id = int(data['country_id'])

        # Crear tour
        new_tour = Tour(
            title=title,
            description=description,
            city=city,
            base_price=base_price,
            user_id=current_user_id,
            country_id=country_id
        )

        db.session.add(new_tour)
        db.session.commit()
        return jsonify(new_tour.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"Error inesperado al crear tour: {str(e)}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@api.route("/tours/<int:tour_id>", methods=["GET"])
def get_tour(tour_id):
    tour = Tour.query.get(tour_id)
    if not tour:
        raise APIException("Tour no encontrado.", status_code=404)
    return jsonify(tour.serialize()), 200


# --- Rutas para bookings --------------------------------------------

# # [GET] Obtener todos los horarios
# @api.route("/tour_schedules", methods=['GET'])
# def get_all_schedules():
#     schedules = TourSchedule.query.all()
#     result = [schedule.serialize() for schedule in schedules]
#     return jsonify(result), 200

# # [GET] Obtener un horario por ID


# @api.route("/tour_schedules/<int:schedule_id>", methods=['GET'])
# def get_schedule(schedule_id):
#     schedule = TourSchedule.query.get_or_404(schedule_id)
#     return jsonify(schedule.serialize()), 200

# [POST] Crear un nuevo horario


# @api.route("/tour_schedules", methods=['POST'])
# def create_schedule():
#     data = request.get_json()
#     if not data or not 'tour_date' in data or not 'available_slots' in data or not 'tour_id' in data:
#         return jsonify({"error": "Faltan datos requeridos"}), 400

#     # Validar que el Tour asociado exista
#     tour = Tour.query.get(all)
#     # if not tour:
#     #     return jsonify({"error": f"El tour con id {data['tour_id']} no existe"}), 404

#     # Convertir la fecha de string a objeto date
#     try:
#         tour_date_obj = datetime.fromisoformat(data['tour_date']).date()
#     except ValueError:
#         return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD"}), 400

#     new_schedule = TourSchedule(
#         tour_date=tour_date_obj,
#         available_slots=data['available_slots'],
#         tour_id=tour[data['tour_id']]
#     )

#     db.session.add(new_schedule)
#     db.session.commit()

#     return jsonify(new_schedule.serialize()), 201  # 201: Created

# [PUT] Actualizar un horario existente


# @api.route("/tour_schedules/<int:schedule_id>", methods=['PUT'])
# def update_schedule(schedule_id):
#     schedule = TourSchedule.query.get_or_404(schedule_id)
#     data = request.get_json()

#     if 'tour_date' in data:
#         try:
#             schedule.tour_date = datetime.fromisoformat(
#                 data['tour_date']).date()
#         except ValueError:
#             return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD"}), 400

#     if 'available_slots' in data:
#         schedule.available_slots = data['available_slots']

#     db.session.commit()
#     return jsonify(schedule.serialize()), 200

# # [DELETE] Eliminar un horario


# @api.route("/tour_schedules/<int:schedule_id>", methods=['DELETE'])
# def delete_schedule(schedule_id):
#     schedule = TourSchedule.query.get_or_404(schedule_id)
#     db.session.delete(schedule)
#     db.session.commit()
#     return jsonify({"message": f"Horario con id {schedule_id} eliminado exitosamente"}), 200


@api.route("/bookings", methods=["POST"])
@jwt_required()
def create_booking():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if "traveler" not in [role.name for role in user.roles]:
            raise APIException(
                "No tiene permiso para crear reservas.", status_code=403)

        data = request.get_json()
        required_fields = ['tour_id', 'schedule_id', 'num_guests']
        if not all(field in data for field in required_fields):
            raise APIException("Faltan campos requeridos.", status_code=400)

        tour = Tour.query.get(data['tour_id'])
        schedule = TourSchedule.query.get(data['schedule_id'])

        if not tour or not schedule:
            raise APIException(
                "Tour o horario no encontrado.", status_code=404)

        if data['num_guests'] <= 0 or data['num_guests'] > schedule.available_slots:
            raise APIException(
                "Número de invitados no válido o no hay cupo disponible.", status_code=400)

        total_price = tour.base_price * data['num_guests']

        new_booking = Booking(
            user_id=current_user_id,
            tour_id=tour.id,
            schedule_id=schedule.id,
            num_guests=data['num_guests'],
            total_price=total_price,
            status='confirmed'  # o 'pending', etc.
        )

        schedule.available_slots -= data['num_guests']

        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"Error inesperado al crear reserva: {str(e)}")
        return jsonify({"msg": "Error interno del servidor"}), 500


# --- Rutas para reviews -----------------------------------------

@api.route("/tours/<int:tour_id>/reviews", methods=["POST"])
@jwt_required()
def add_review(tour_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        tour = Tour.query.get(tour_id)
        if not tour:
            raise APIException("Tour no encontrado.", status_code=404)

        required_fields = ['rating']
        if not all(field in data for field in required_fields):
            raise APIException(
                "Falta la calificación ('rating').", status_code=400)

        new_review = Review(
            tour_id=tour_id,
            user_id=current_user_id,
            comment=data.get('comment'),
            rating=data['rating']
        )

        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.serialize()), 201

    except APIException as e:
        db.session.rollback()
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        db.session.rollback()
        print(f"Error inesperado al agregar reseña: {str(e)}")
        return jsonify({"msg": "Error interno del servidor"}), 500
