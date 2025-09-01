# PowerShell script para configurar MVP de Xplora Tours

Write-Host "🚀 Configurando MVP de Xplora Tours..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Verificar si Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar si pipenv está instalado
try {
    $pipenvVersion = pipenv --version 2>&1
    Write-Host "✅ pipenv encontrado: $pipenvVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando pipenv..." -ForegroundColor Yellow
    pip install pipenv
}

Write-Host "🔧 Configurando Backend..." -ForegroundColor Cyan

# Instalar dependencias Python
Write-Host "📦 Instalando dependencias Python..." -ForegroundColor Yellow
pipenv install

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    @"
FLASK_APP=src/app.py
FLASK_DEBUG=1
DATABASE_URL=sqlite:////test.db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Ejecutar migraciones
Write-Host "🗄️ Configurando base de datos..." -ForegroundColor Yellow
pipenv run migrate
pipenv run upgrade

# Poblar con tours de ejemplo
Write-Host "🎯 Poblando base de datos con tours..." -ForegroundColor Yellow
pipenv run seed-real-tours

Write-Host "🔧 Configurando Frontend..." -ForegroundColor Cyan

# Instalar dependencias Node.js
Write-Host "📦 Instalando dependencias Node.js..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🎉 ¡MVP configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para iniciar el proyecto:" -ForegroundColor White
Write-Host ""
Write-Host "🔹 Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "   pipenv run start" -ForegroundColor White
Write-Host ""
Write-Host "🔹 Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor White
Write-Host "   Backend: http://localhost:3001" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación: MVP_README.md" -ForegroundColor White
Write-Host ""
Write-Host "¡Disfruta explorando y creando tours increíbles! 🌟" -ForegroundColor Green
