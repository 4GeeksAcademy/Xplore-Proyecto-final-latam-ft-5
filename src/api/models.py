from wsgiref import validate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
# import enum

db = SQLAlchemy()
bcrypt = Bcrypt()


# --- Relación muchos a muchos ---

user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
    
)

tour_categories = db.Table('tour_categories',
    db.Column('tour_id', db.Integer, db.ForeignKey('tour.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True)
)

tour_images = db.Table('tour_images',
    db.Column('tour_id', db.Integer, db.ForeignKey('tour.id'), primary_key=True),
    db.Column('image_id', db.Integer, db.ForeignKey('image.id'), primary_key=True)
)


# --- Tablas principales ---


# class UserRole(enum.Enum):
#     TRAVELER = 'traveler'
#     PROVIDER = 'provider'

class User(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    # Relaciones
    roles = db.relationship('Role', secondary=user_roles,backref=db.backref('users', lazy='dynamic'))
    tours = db.relationship('Tour', backref='creator', lazy=True)
    bookings = db.relationship('Booking', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

    @property
    def password(self):
        raise AttributeError('La contraseña no es un atributo legible.')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "roles": [role.name for role in self.roles] if self.roles else [],
            "is_active": self.is_active,
        }


class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Tour(db.Model):
    __tablename__ = 'tour'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)

    # Relaciones
    schedules = db.relationship('TourSchedule', backref='tour', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='tour', lazy=True, cascade="all, delete-orphan")
    bookings = db.relationship('Booking', backref='tour', lazy=True)
    categories = db.relationship('Category', secondary=tour_categories, backref='tours', lazy='dynamic')
    images = db.relationship('Image', secondary=tour_images, backref='tours', lazy='dynamic')
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "desciption": self.description,
            "city": self.city,
            "base_price": self.base_price
        }
    

class TourSchedule(db.Model):
    __tablename__ = 'tour_schedule'

    id = db.Column(db.Integer, primary_key=True)
    tour_date = db.Column(db.Date, nullable=False)
    available_slots = db.Column(db.Integer, nullable=False)

    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "tour_date": self.tour_date,
            "available_slots": self.available_slots,
        }

class Booking(db.Model):
    __tablename__ = 'booking'

    id = db.Column(db.Integer, primary_key=True)
    num_guests = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    # ej. 'pending', 'confirmed', 'cancelled'
    status = db.Column(db.String(50), nullable=False, default='pending')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey(
        'tour_schedule.id'), nullable=False)

    # Relación para reserva
    schedule = db.relationship('TourSchedule', backref='bookings')

    def serialize(self):
        return {
            "id": self.id,
            "num_guests": self.num_guests,
            "total_price": self.total_price,
            "status": self.status,
        }


class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Numeric(2, 1), nullable=False)

    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    @validates('rating')
    def validate_rating(self, key, rating):
        if not (0 <= float(rating) <= 5):
            raise ValueError("La calificación debe estar entre 0 y 5.")
        return rating
    
    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "rating": self.rating,
        }
    

class Country(db.Model):
    __tablename__ = 'country'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    
    tours = db.relationship('Tour', backref='country', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
        }