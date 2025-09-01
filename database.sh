#!/bin/bash

# Función para crear la migración inicial de la base de datos
creating_migration () {
    echo "-> Creando migración inicial..."
    pipenv run init
    pipenv run migrate
    pipenv run upgrade
    echo "-> Migración completada."
}

# Detener el script si ocurre algún error
set -e

# --- COMANDO CORREGIDO CON SUDO ---
# Iniciar el servicio de PostgreSQL con permisos de administrador
echo "-> Iniciando servicio de PostgreSQL..."
sudo service postgresql start

# Esperar un momento para que el servicio se inicie completamente
sleep 2

# Crear el usuario y la base de datos si no existen
if ! psql -U gitpod -lqt | cut -d \| -f 1 | grep -qw example; then
    echo "-> Creando usuario y base de datos 'example'..."
    psql -U gitpod -c "CREATE DATABASE example"
    psql -U gitpod -c "CREATE USER superuser"
    echo "-> Base de datos creada."
else
    echo "-> La base de datos 'example' ya existe."
fi

# Ejecutar la función de migración
creating_migration

echo "-> ¡La base de datos está lista!"
