import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import traceback

# Carga las variables del archivo .env
load_dotenv()

# Obtiene la URL de la base de datos
db_url = os.getenv("DATABASE_URL")

print(f"Intentando conectar a: {db_url}")

if not db_url:
    print("Error: DATABASE_URL no encontrada en el archivo .env")
else:
    try:
        # Crea el motor de conexión de SQLAlchemy
        engine = create_engine(db_url)

        # Intenta establecer una conexión
        with engine.connect() as connection:
            print("\n¡ÉXITO! La conexión a la base de datos se estableció correctamente.")
            
            # Opcional: Ejecuta una consulta simple para confirmar
            result = connection.execute(text("SELECT version();"))
            db_version = result.fetchone()
            print(f"Versión de PostgreSQL: {db_version[0]}")

    except Exception as e:
        print("\nFALLÓ LA CONEXIÓN.")
        print("Se produjo el siguiente error:")
        # Imprime el error completo
        traceback.print_exc()