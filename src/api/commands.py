
import click
from .models import db, User, Tour
from flask import Blueprint
from flask.cli import with_appcontext
import random
from datetime import datetime, timedelta

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""

commands = Blueprint("commands", __name__)

@commands.cli.command("seed-real-tours")
@with_appcontext
def seed_real_tours():
    """Crear 20 tours reales con datos específicos para el MVP"""
    try:
        # Verificar si ya existen tours
        existing_tours = Tour.query.count()
        if existing_tours > 0:
            click.echo(f"Ya existen {existing_tours} tours en la base de datos.")
            if not click.confirm("¿Deseas continuar y crear más tours?"):
                return

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
        
        # Obtener o crear un usuario guía
        guide = User.query.first()
        if not guide:
            # Crear un usuario guía si no existe
            guide = User(
                email="guia@xplora.com",
                name="Guía",
                last_name="Experto",
                is_active=True
            )
            guide.set_password("password123")
            db.session.add(guide)
            db.session.commit()
            click.echo(f"Usuario guía creado: {guide.email}")
        
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
            created.append({
                "title": tour.title,
                "location": tour.location,
                "base_price": tour.base_price,
                "category": tour.category
            })
        
        db.session.commit()
        click.echo(f"✅ {len(tours_data)} tours reales creados exitosamente!")
        click.echo("Tours creados:")
        for tour in created:
            click.echo(f"  - {tour['title']} ({tour['category']}) - ${tour['base_price']}")
        
    except Exception as e:
        db.session.rollback()
        click.echo(f"❌ Error creando tours: {e}")
        raise click.ClickException(f"Error interno del servidor: {e}")

def setup_commands(app):
    app.register_blueprint(commands)