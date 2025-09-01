# src/api/routes.py
from __future__ import annotations
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import random


from .models import (
    db, User, UserRole, Tour, Review, Booking,
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
@jwt_required()
def create_tour():
    try:
        current_user_id = int(get_jwt_identity())
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
            guide_id=current_user_id,
            max_travelers=int(data.get("max_travelers") or 10),
            category=str(data.get("category") or "General"),
            available_dates=data.get("available_dates") if isinstance(
                data.get("available_dates"), list) else [],
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

# ==============================BOOKINGS==============================================

@api.route("/tours/<int:tour_id>/book", methods=["POST"])
@jwt_required()
def create_booking(tour_id):
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json(silent=True) or {}
        
        # Validar tour
        tour = Tour.query.get(tour_id)
        if not tour:
            raise APIException("Tour no encontrado", 404)
        
        if not tour.is_active:
            raise APIException("Este tour no está disponible", 400)
        
        # Validar datos requeridos
        required = ("travel_date", "travelers_count")
        if not all(k in data for k in required):
            raise APIException("Faltan campos requeridos", 400)
        
        travel_date = datetime.strptime(data["travel_date"], "%Y-%m-%d").date()
        travelers_count = int(data["travelers_count"])
        
        if travelers_count > tour.max_travelers:
            raise APIException(f"Máximo {tour.max_travelers} viajeros permitidos", 400)
        
        # Calcular precio total
        total_price = float(tour.base_price) * travelers_count
        
        # Crear reserva
        new_booking = Booking(
            tour_id=tour_id,
            user_id=current_user_id,
            travel_date=travel_date,
            travelers_count=travelers_count,
            total_price=total_price,
            special_requests=data.get("special_requests"),
        )
        
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

@api.route("/bookings", methods=["GET"])
@jwt_required()
def get_user_bookings():
    try:
        current_user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=current_user_id).all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        print(f"[get_user_bookings] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500

# ==============================GUIDE TOURS==============================================

@api.route("/guide/tours", methods=["GET"])
@jwt_required()
def get_guide_tours():
    try:
        current_user_id = int(get_jwt_identity())
        tours = Tour.query.filter_by(guide_id=current_user_id).all()
        return jsonify([t.serialize() for t in tours]), 200
    except Exception as e:
        print(f"[get_guide_tours] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500

@api.route("/guide/bookings", methods=["GET"])
@jwt_required()
def get_guide_bookings():
    try:
        current_user_id = int(get_jwt_identity())
        # Obtener todos los tours del guía
        guide_tours = Tour.query.filter_by(guide_id=current_user_id).all()
        tour_ids = [tour.id for tour in guide_tours]
        
        # Obtener todas las reservas de esos tours
        bookings = Booking.query.filter(Booking.tour_id.in_(tour_ids)).all()
        return jsonify([b.serialize() for b in bookings]), 200
    except Exception as e:
        print(f"[get_guide_bookings] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500

# ==============================SEED REAL TOURS==============================================

@api.route("/seed_real_tours", methods=["GET"])
def seed_real_tours():
    """Crear 20 tours reales con datos específicos para el MVP"""
    try:
        # Tours predefinidos con datos reales
        tours_data = [
            {
                "title": "Tour Arqueológico de Chichén Itzá",
                "description": "Explora una de las Siete Maravillas del Mundo Moderno. Visita la Pirámide de Kukulkán, el Templo de los Guerreros y el Observatorio. Incluye guía certificado, transporte desde Cancún y almuerzo buffet.",
                "location": "Chichén Itzá, Yucatán, México",
                "base_price": 89.99,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 15,
                "tour_includes": ["Transporte desde Cancún", "Guía certificado", "Almuerzo buffet", "Entrada al sitio arqueológico", "Agua embotellada"],
                "tour_not_includes": ["Propinas", "Bebidas alcohólicas", "Recuerdos"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1565967511849-4a94a6a3e76f?w=800"],
                "rate": 4.8
            },
            {
                "title": "Tour Gastronómico por Oaxaca",
                "description": "Descubre los sabores auténticos de Oaxaca. Visita mercados tradicionales, prueba el mole negro, tlayudas y mezcal artesanal. Incluye degustaciones, guía local y recetas para llevar.",
                "location": "Oaxaca de Juárez, Oaxaca, México",
                "base_price": 65.00,
                "duration": "1 día",
                "category": "Gastronómico",
                "max_travelers": 12,
                "tour_includes": ["Guía gastronómico", "Degustaciones en 6 lugares", "Recetas impresas", "Transporte entre ubicaciones", "Seguro de viajero"],
                "tour_not_includes": ["Bebidas alcohólicas", "Propinas", "Recuerdos"],
                "images": ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800", "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800"],
                "rate": 4.9
            },
            {
                "title": "Aventura en la Sierra de San Pedro Mártir",
                "description": "Explora la majestuosa Sierra de Baja California. Incluye senderismo por senderos de montaña, observación de estrellas, camping y vistas panorámicas del Océano Pacífico. Ideal para amantes de la naturaleza.",
                "location": "Sierra de San Pedro Mártir, Baja California, México",
                "base_price": 120.00,
                "duration": "2 días",
                "category": "Aventura",
                "max_travelers": 8,
                "tour_includes": ["Equipo de camping", "Guía de montaña certificado", "Alimentación completa", "Transporte desde Ensenada", "Seguro de aventura"],
                "tour_not_includes": ["Equipo personal", "Propinas", "Bebidas alcohólicas"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1464822759844-d150baec0134?w=800"],
                "rate": 4.7
            },
            {
                "title": "Tour Histórico del Centro de la CDMX",
                "description": "Recorre el corazón histórico de la Ciudad de México. Visita el Zócalo, la Catedral Metropolitana, el Templo Mayor, el Palacio Nacional y el Museo Nacional de Arte. Incluye guía historiador y entrada a museos.",
                "location": "Centro Histórico, Ciudad de México",
                "base_price": 45.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 20,
                "tour_includes": ["Guía historiador certificado", "Entradas a museos", "Transporte en metro", "Agua embotellada", "Mapa histórico"],
                "tour_not_includes": ["Alimentación", "Propinas", "Transporte desde hotel"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800"],
                "rate": 4.6
            },
            {
                "title": "Tour de Ballenas en Los Cabos",
                "description": "Observa ballenas jorobadas en su hábitat natural. Navega por el Mar de Cortés, conocido como 'El Acuario del Mundo'. Incluye biólogo marino, equipo de observación y refrigerios.",
                "location": "Los Cabos, Baja California Sur, México",
                "base_price": 95.00,
                "duration": "1 día",
                "category": "Naturaleza",
                "max_travelers": 25,
                "tour_includes": ["Barco con capitán experimentado", "Biólogo marino", "Equipo de observación", "Refrigerios ligeros", "Chaleco salvavidas"],
                "tour_not_includes": ["Transporte desde hotel", "Propinas", "Fotos profesionales"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
                "rate": 4.9
            },
            {
                "title": "Tour de Tequila y Agave",
                "description": "Visita las mejores destilerías de tequila en Jalisco. Aprende sobre el proceso de elaboración, degusta diferentes tipos de tequila y recorre campos de agave azul. Incluye transporte desde Guadalajara.",
                "location": "Tequila, Jalisco, México",
                "base_price": 75.00,
                "duration": "1 día",
                "category": "Gastronómico",
                "max_travelers": 18,
                "tour_includes": ["Transporte desde Guadalajara", "Guía especializado", "Visitas a 3 destilerías", "Degustaciones", "Almuerzo tradicional"],
                "tour_not_includes": ["Compras de tequila", "Propinas", "Bebidas adicionales"],
                "images": ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"],
                "rate": 4.8
            },
            {
                "title": "Aventura en Cañón del Sumidero",
                "description": "Navega por el impresionante Cañón del Sumidero en Chiapas. Observa cascadas, fauna local y formaciones rocosas únicas. Incluye paseo en lancha, guía local y refrigerios.",
                "location": "Cañón del Sumidero, Chiapas, México",
                "base_price": 55.00,
                "duration": "1 día",
                "category": "Naturaleza",
                "max_travelers": 30,
                "tour_includes": ["Paseo en lancha", "Guía local bilingüe", "Refrigerios", "Seguro de viajero", "Transporte desde Tuxtla"],
                "tour_not_includes": ["Alimentación completa", "Propinas", "Recuerdos"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
                "rate": 4.7
            },
            {
                "title": "Tour Cultural de Puebla",
                "description": "Explora la ciudad colonial de Puebla, Patrimonio de la Humanidad. Visita la Catedral, el Zócalo, la Biblioteca Palafoxiana y talleres de talavera. Incluye guía historiador y degustación de mole poblano.",
                "location": "Puebla, Puebla, México",
                "base_price": 60.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 15,
                "tour_includes": ["Guía historiador", "Entradas a museos", "Degustación de mole", "Transporte local", "Mapa de la ciudad"],
                "tour_not_includes": ["Alimentación completa", "Propinas", "Compras de artesanías"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800"],
                "rate": 4.6
            },
            {
                "title": "Tour de Aves en Sian Ka'an",
                "description": "Observa aves exóticas en la Reserva de la Biosfera Sian Ka'an. Incluye guía ornitólogo, equipo de observación, kayak por manglares y almuerzo en la playa. Ideal para fotógrafos de naturaleza.",
                "location": "Reserva Sian Ka'an, Quintana Roo, México",
                "base_price": 110.00,
                "duration": "1 día",
                "category": "Naturaleza",
                "max_travelers": 10,
                "tour_includes": ["Guía ornitólogo", "Equipo de observación", "Kayak en manglares", "Almuerzo en playa", "Transporte desde Tulum"],
                "tour_not_includes": ["Equipo fotográfico", "Propinas", "Bebidas alcohólicas"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
                "rate": 4.9
            },
            {
                "title": "Tour de Arte Urbano en Monterrey",
                "description": "Descubre el vibrante arte urbano de Monterrey. Recorre murales, grafitis y instalaciones artísticas en barrios emergentes. Incluye guía artista local, taller de stencil y refrigerios.",
                "location": "Monterrey, Nuevo León, México",
                "base_price": 50.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 12,
                "tour_includes": ["Guía artista local", "Taller de stencil", "Refrigerios", "Transporte local", "Materiales del taller"],
                "tour_not_includes": ["Alimentación completa", "Propinas", "Compras de arte"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"],
                "rate": 4.5
            },
            {
                "title": "Tour de Cerveza Artesanal en Tijuana",
                "description": "Explora la creciente escena cervecera de Tijuana. Visita cervecerías artesanales, aprende sobre el proceso de elaboración y degusta diferentes estilos. Incluye transporte y guía cervecero.",
                "location": "Tijuana, Baja California, México",
                "base_price": 70.00,
                "duration": "1 día",
                "category": "Gastronómico",
                "max_travelers": 16,
                "tour_includes": ["Transporte local", "Guía cervecero", "Visitas a 4 cervecerías", "Degustaciones", "Snacks"],
                "tour_not_includes": ["Compras de cerveza", "Propinas", "Bebidas adicionales"],
                "images": ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"],
                "rate": 4.7
            },
            {
                "title": "Aventura en Grutas de Tolantongo",
                "description": "Explora las impresionantes grutas termales de Hidalgo. Incluye senderismo, baño en aguas termales, tirolesa y camping. Ideal para aventureros y amantes de la naturaleza.",
                "location": "Grutas de Tolantongo, Hidalgo, México",
                "base_price": 85.00,
                "duration": "2 días",
                "category": "Aventura",
                "max_travelers": 12,
                "tour_includes": ["Equipo de camping", "Guía de aventura", "Alimentación completa", "Transporte desde CDMX", "Seguro de aventura"],
                "tour_not_includes": ["Equipo personal", "Propinas", "Bebidas alcohólicas"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
                "rate": 4.8
            },
            {
                "title": "Tour de Chocolate en Tabasco",
                "description": "Descubre el origen del chocolate en Tabasco. Visita plantaciones de cacao, aprende sobre el proceso de elaboración y crea tu propio chocolate. Incluye guía local y degustaciones.",
                "location": "Comalcalco, Tabasco, México",
                "base_price": 65.00,
                "duration": "1 día",
                "category": "Gastronómico",
                "max_travelers": 14,
                "tour_includes": ["Guía local", "Visita a plantación", "Taller de chocolate", "Degustaciones", "Transporte local"],
                "tour_not_includes": ["Alimentación completa", "Propinas", "Compras de chocolate"],
                "images": ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800", "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800"],
                "rate": 4.6
            },
            {
                "title": "Tour de Mariposas Monarca",
                "description": "Observa el espectáculo natural de las mariposas monarca en Michoacán. Incluye guía naturalista, equipo de observación y senderismo por bosques de oyamel. Temporada: noviembre a marzo.",
                "location": "Santuario El Rosario, Michoacán, México",
                "base_price": 80.00,
                "duration": "1 día",
                "category": "Naturaleza",
                "max_travelers": 20,
                "tour_includes": ["Guía naturalista", "Equipo de observación", "Senderismo guiado", "Almuerzo", "Transporte desde Morelia"],
                "tour_not_includes": ["Equipo personal", "Propinas", "Recuerdos"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
                "rate": 4.9
            },
            {
                "title": "Tour de Arquitectura Moderna en CDMX",
                "description": "Explora la arquitectura contemporánea de la Ciudad de México. Visita edificios icónicos como el Museo Soumaya, la Torre BBVA y el Museo Jumex. Incluye guía arquitecto y transporte.",
                "location": "Ciudad de México, México",
                "base_price": 55.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 18,
                "tour_includes": ["Guía arquitecto", "Entradas a museos", "Transporte local", "Agua embotellada", "Material informativo"],
                "tour_not_includes": ["Alimentación", "Propinas", "Transporte desde hotel"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800"],
                "rate": 4.7
            },
            {
                "title": "Tour de Surf en Sayulita",
                "description": "Aprende a surfear en las olas de Sayulita, Nayarit. Incluye instructor certificado, equipo de surf, clases de 2 horas y refrigerios. Ideal para principiantes y surfistas intermedios.",
                "location": "Sayulita, Nayarit, México",
                "base_price": 90.00,
                "duration": "1 día",
                "category": "Aventura",
                "max_travelers": 8,
                "tour_includes": ["Instructor certificado", "Equipo de surf", "Clases de 2 horas", "Refrigerios", "Seguro de deporte"],
                "tour_not_includes": ["Transporte desde hotel", "Propinas", "Equipo personal"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
                "rate": 4.8
            },
            {
                "title": "Tour de Música Tradicional en Veracruz",
                "description": "Sumérgete en la rica tradición musical de Veracruz. Visita talleres de instrumentos, asiste a presentaciones de son jarocho y aprende a tocar la jarana. Incluye guía músico local.",
                "location": "Veracruz, Veracruz, México",
                "base_price": 60.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 15,
                "tour_includes": ["Guía músico local", "Taller de instrumentos", "Presentación musical", "Transporte local", "Material didáctico"],
                "tour_not_includes": ["Alimentación", "Propinas", "Compras de instrumentos"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"],
                "rate": 4.6
            },
            {
                "title": "Tour de Observación de Estrellas en Baja California",
                "description": "Observa el cielo nocturno en uno de los mejores lugares del mundo para la astronomía. Incluye telescopios profesionales, guía astrónomo y cena bajo las estrellas.",
                "location": "Valle de los Cirios, Baja California, México",
                "base_price": 130.00,
                "duration": "1 día",
                "category": "Naturaleza",
                "max_travelers": 12,
                "tour_includes": ["Telescopios profesionales", "Guía astrónomo", "Cena bajo las estrellas", "Transporte desde Ensenada", "Seguro de viajero"],
                "tour_not_includes": ["Equipo fotográfico", "Propinas", "Bebidas alcohólicas"],
                "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
                "rate": 4.9
            },
            {
                "title": "Tour de Artesanías en Michoacán",
                "description": "Visita talleres de artesanos en Michoacán. Aprende sobre la elaboración de cobre martillado, lacas y textiles. Incluye guía local, talleres prácticos y compras directas.",
                "location": "Pátzcuaro, Michoacán, México",
                "base_price": 70.00,
                "duration": "1 día",
                "category": "Cultural",
                "max_travelers": 16,
                "tour_includes": ["Guía local", "Visitas a talleres", "Talleres prácticos", "Transporte local", "Almuerzo tradicional"],
                "tour_not_includes": ["Compras de artesanías", "Propinas", "Bebidas"],
                "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"],
                "rate": 4.7
            }
        ]
        
        created = []
        
        for tour_data in tours_data:
            tour = Tour(
                title=tour_data["title"],
                description=tour_data["description"],
                location=tour_data["location"],
                base_price=tour_data["base_price"],
                duration=tour_data["duration"],
                category=tour_data["category"],
                max_travelers=tour_data["max_travelers"],
                tour_includes=tour_data["tour_includes"],
                tour_not_includes=tour_data["tour_not_includes"],
                images=tour_data["images"],
                rate=tour_data["rate"],
                guide_id=1,  # Asignar al primer usuario (puedes cambiar esto)
                available_dates=[],  # Por ahora vacío
                popular=["Popular", "Recomendado"],
            )
            db.session.add(tour)
            created.append({
                "title": tour.title,
                "location": tour.location,
                "base_price": tour.base_price,
                "category": tour.category
            })
        
        db.session.commit()
        return jsonify({"msg": f"{len(tours_data)} tours reales creados exitosamente", "tours": created}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[seed_real_tours] Error: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
