#!/bin/bash

echo "🚀 Configurando MVP de Xplora Tours..."
echo "======================================"

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si pipenv está instalado
if ! command -v pipenv &> /dev/null; then
    echo "📦 Instalando pipenv..."
    pip install pipenv
fi

echo "🔧 Configurando Backend..."

# Instalar dependencias Python
echo "📦 Instalando dependencias Python..."
pipenv install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << EOF
FLASK_APP=src/app.py
FLASK_DEBUG=1
DATABASE_URL=sqlite:////test.db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
EOF
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Ejecutar migraciones
echo "🗄️ Configurando base de datos..."
pipenv run migrate
pipenv run upgrade

# Poblar con tours de ejemplo
echo "🎯 Poblando base de datos con tours..."
pipenv run seed-real-tours

echo "🔧 Configurando Frontend..."

# Instalar dependencias Node.js
echo "📦 Instalando dependencias Node.js..."
npm install

echo ""
echo "🎉 ¡MVP configurado exitosamente!"
echo ""
echo "📋 Para iniciar el proyecto:"
echo ""
echo "🔹 Terminal 1 (Backend):"
echo "   pipenv run start"
echo ""
echo "🔹 Terminal 2 (Frontend):"
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📚 Documentación: MVP_README.md"
echo ""
echo "¡Disfruta explorando y creando tours increíbles! 🌟"
