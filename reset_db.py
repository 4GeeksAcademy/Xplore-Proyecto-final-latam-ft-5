import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def reset_database():
    # Configuración de la base de datos
    dbname = "example"
    user = "gitpod"
    password = "postgres"
    host = "localhost"

    # Conectar a postgres
    conn = psycopg2.connect(
        dbname="postgres",
        user=user,
        password=password,
        host=host
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Cerrar conexiones existentes
    cur.execute(f'''
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{dbname}'
        AND pid <> pg_backend_pid();
    ''')

    # Eliminar la base de datos si existe
    cur.execute(f'DROP DATABASE IF EXISTS {dbname}')
    
    # Crear la base de datos
    cur.execute(f'CREATE DATABASE {dbname}')
    
    # Cerrar la conexión
    cur.close()
    conn.close()

    print(f"Base de datos '{dbname}' ha sido reiniciada")

if __name__ == "__main__":
    reset_database()
