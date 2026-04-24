#!/bin/sh

# Stop execution if a command fails
set -e

echo "Waiting for Postgres..."

# Python-based wait logic
python << END
import socket
import time
import os

port = int(os.environ.get("POSTGRES_PORT", 5432))
host = os.environ.get("POSTGRES_HOST", "newscout-db")

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        s.connect((host, port))
        s.close()
        break
    except socket.error:
        time.sleep(0.1)
END

echo "PostgreSQL started"

# Run Migrations
echo "Applying database migrations..."
python manage.py migrate


echo "Creating superuser..."
python manage.py createsuperuser --noinput || echo "Superuser already exists"


exec "$@"