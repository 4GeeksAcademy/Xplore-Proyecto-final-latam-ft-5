#!/usr/bin/env python3
"""
Script para poblar la base de datos con tours de ejemplo
"""

from src.app import app
from src.api.models import db, User, Tour
from datetime import datetime

def create_sample_tours():
    with app.app_context():
        try:
            # Verificar si ya existen tours
            existing_tours = Tour.query.count()
            if existing_tours > 0:
                print(f"Ya existen {existing_tours} tours en la base de datos.")
                return

            # Crear usuario guía si no existe
            guide = User.query.first()
            if not guide:
                guide = User(
                    email="guia@xplora.com",
                    name="Guía",
                    last_name="Experto",
                    is_active=True
                )
                guide.set_password("password123")
                db.session.add(guide)
                db.session.commit()
                print(f"Usuario guía creado: {guide.email}")

            # Tours de ejemplo
            tours_data = [
                {
                    "title": "Tour Arqueológico de Chichén Itzá",
                    "description": "Explora una de las Siete Maravillas del Mundo Moderno. Visita la Pirámide de Kukulkán, el Templo de los Guerreros y el Observatorio.",
                    "location": "Chichén Itzá, Yucatán, México",
                    "base_price": 89.99,
                    "duration": "1 día",
                    "category": "Cultural",
                    "max_travelers": 15,
                    "tour_includes": ["Transporte desde Cancún", "Guía certificado", "Almuerzo buffet"],
                    "tour_not_includes": ["Propinas", "Bebidas alcohólicas"],
                    "images": ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800"],
                    "rate": 4.8
                },
                {
                    "title": "Tour Gastronómico por Oaxaca",
                    "description": "Descubre los sabores auténticos de Oaxaca. Visita mercados tradicionales, prueba el mole negro y mezcal artesanal.",
                    "location": "Oaxaca de Juárez, Oaxaca, México",
                    "base_price": 65.00,
                    "duration": "1 día",
                    "category": "Gastronómico",
                    "max_travelers": 12,
                    "tour_includes": ["Guía gastronómico", "Degustaciones", "Recetas impresas"],
                    "tour_not_includes": ["Bebidas alcohólicas", "Propinas"],
                    "images": ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
                    "rate": 4.9
                },
                {
                    "title": "Aventura en la Sierra de San Pedro Mártir",
                    "description": "Explora la majestuosa Sierra de Baja California. Incluye senderismo, observación de estrellas y camping.",
                    "location": "Sierra de San Pedro Mártir, Baja California, México",
                    "base_price": 120.00,
                    "duration": "2 días",
                    "category": "Aventura",
                    "max_travelers": 8,
                    "tour_includes": ["Equipo de camping", "Guía de montaña", "Alimentación completa"],
                    "tour_not_includes": ["Equipo personal", "Propinas"],
                    "images": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"],
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
                    guide_id=guide.id,
                    available_dates=[],
                    popular=["Popular", "Recomendado"],
                )
                db.session.add(tour)
                created.append(tour_data["title"])

            db.session.commit()
            print(f"✅ {len(tours_data)} tours creados exitosamente!")
            for title in created:
                print(f"  - {title}")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creando tours: {e}")
            raise

if __name__ == "__main__":
    create_sample_tours()
