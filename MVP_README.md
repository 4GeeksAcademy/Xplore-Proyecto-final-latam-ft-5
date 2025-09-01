# 🚀 MVP - Sistema de Reserva de Tours Xplora

## 📋 Descripción del MVP

Este MVP implementa un sistema completo de reserva de tours con dos roles principales:

1. **Guías/Proveedores**: Pueden crear, editar y gestionar tours
2. **Viajeros**: Pueden explorar, reservar y gestionar sus reservas

## 🏗️ Estructura del Proyecto

### Backend (Flask)
- **Modelos**: User, Tour, Review, Booking
- **API REST**: Autenticación, gestión de tours, reservas
- **Base de datos**: SQLAlchemy con migraciones

### Frontend (React)
- **Páginas públicas**: Home, exploración de tours
- **Panel de usuario**: Gestión de reservas, favoritos
- **Panel de guía**: Crear/editar tours, ver reservas

## 🚀 Instalación y Configuración

### 1. Configurar el Backend

```bash
# Instalar dependencias Python
pipenv install

# Crear archivo .env (basado en .env.example)
cp .env.example .env

# Configurar DATABASE_URL en .env
DATABASE_URL=sqlite:////test.db

# Ejecutar migraciones
pipenv run migrate
pipenv run upgrade

# Poblar la base de datos con tours de ejemplo
pipenv run seed-real-tours

# Iniciar el servidor
pipenv run start
```

### 2. Configurar el Frontend

```bash
# Instalar dependencias Node.js
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 🎯 Funcionalidades Implementadas

### Para Guías/Proveedores
- ✅ Registro como proveedor
- ✅ Crear tours con información detallada
- ✅ Editar tours existentes
- ✅ Ver todos los tours creados
- ✅ Gestionar reservas de sus tours

### Para Viajeros
- ✅ Registro como usuario
- ✅ Explorar tours por categorías
- ✅ Ver detalles completos de tours
- ✅ Crear reservas
- ✅ Gestionar reservas existentes
- ✅ Sistema de reviews y calificaciones

### Tours Predefinidos
Se han creado **20 tours reales** con datos específicos de México:
- **Culturales**: Chichén Itzá, Centro Histórico CDMX, Puebla
- **Gastronómicos**: Oaxaca, Tequila, Chocolate Tabasco
- **Naturaleza**: Ballenas Los Cabos, Mariposas Monarca, Sian Ka'an
- **Aventura**: Sierra San Pedro Mártir, Surf Sayulita, Grutas Tolantongo

## 🔧 Comandos Útiles

### Poblar Base de Datos
```bash
# Crear 20 tours reales
pipenv run seed-real-tours

# Crear tours aleatorios (para testing)
pipenv run seed-tours
```

### Gestión de Base de Datos
```bash
# Crear migraciones
pipenv run migrate

# Aplicar migraciones
pipenv run upgrade

# Revertir migración
pipenv run downgrade
```

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/signup` - Registro de usuario
- `POST /api/proveedor/signup` - Registro de proveedor
- `POST /api/login` - Inicio de sesión
- `GET /api/profile` - Perfil del usuario

### Tours
- `GET /api/tours` - Listar todos los tours
- `POST /api/tours` - Crear nuevo tour (requiere auth)
- `GET /api/tours/<id>` - Ver tour específico

### Reservas
- `POST /api/tours/<id>/book` - Crear reserva
- `GET /api/bookings` - Ver reservas del usuario

### Panel de Guía
- `GET /api/guide/tours` - Tours del guía
- `GET /api/guide/bookings` - Reservas de tours del guía

### Reviews
- `POST /api/tours/<id>/reviews` - Crear review
- `DELETE /api/reviews/<id>` - Eliminar review

## 🎨 Componentes del Frontend

### Páginas Principales
- **Home**: Landing page con exploración de tours
- **Panel**: Dashboard principal para usuarios
- **CreateTour**: Formulario para crear tours
- **TourDetail**: Vista detallada de un tour

### Componentes Reutilizables
- **PanelTours**: Lista de tours con filtros
- **GuideTours**: Gestión de tours para guías
- **TourCard**: Tarjeta individual de tour
- **Navbar**: Navegación principal

## 🔐 Autenticación y Roles

### Sistema de Roles
- **TRAVELER**: Usuarios que pueden reservar tours
- **PROVIDER**: Guías que pueden crear tours
- **ADMIN**: Administradores del sistema

### JWT Tokens
- Autenticación basada en tokens JWT
- Tokens expiran automáticamente
- Protección de rutas sensibles

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Bootstrap 5**: Framework CSS moderno
- **Componentes adaptativos**: Se ajustan a diferentes pantallas

## 🚀 Próximos Pasos para Producción

### Funcionalidades Adicionales
- [ ] Sistema de pagos integrado
- [ ] Notificaciones por email/SMS
- [ ] Panel de administración
- [ ] Sistema de comisiones
- [ ] API de terceros (Google Maps, etc.)

### Mejoras Técnicas
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Monitoreo y logging
- [ ] Cache y optimización
- [ ] Documentación de API (Swagger)

## 🐛 Solución de Problemas

### Error de Base de Datos
```bash
# Resetear base de datos
rm test.db
pipenv run upgrade
pipenv run seed-real-tours
```

### Error de CORS
- Verificar configuración en `src/app.py`
- Asegurar que las URLs estén correctamente configuradas

### Error de Autenticación
- Verificar que el token JWT esté presente
- Comprobar que el usuario esté activo

## 📞 Soporte

Para dudas o problemas:
1. Revisar logs del servidor Flask
2. Verificar consola del navegador
3. Comprobar estado de la base de datos

## 🎉 ¡Listo para Usar!

El MVP está completamente funcional y listo para:
- **Demostraciones** a clientes/inversores
- **Testing** con usuarios reales
- **Desarrollo** de funcionalidades adicionales
- **Despliegue** en producción

¡Disfruta explorando y creando tours increíbles! 🌟
