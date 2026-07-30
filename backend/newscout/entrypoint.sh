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

echo "Waiting for OpenSearch..."

python << END
import socket
import time
import os

port = int(os.environ.get("OPENSEARCH_PORT", 9200))
host = os.environ.get("OPENSEARCH_HOST", "opensearch")

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        s.connect((host, port))
        s.close()
        break
    except socket.error:
        time.sleep(0.1)
END

echo "OpenSearch started"

# Run Migrations
echo "Applying database migrations..."
python manage.py migrate


echo "Creating superuser..."
python manage.py createsuperuser --noinput || echo "Superuser already exists"

echo "Seeding test data (skipped if articles already exist)..."
python - <<'PYEOF'
import django, os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "newscout.settings")
django.setup()
from core.models import Article
if Article.objects.exists():
    print("Articles found — skipping seed.")
else:
    from django.core.management import call_command
    call_command("seed_test_data")
PYEOF

echo "Creating OpenSearch indexes and indexing documents..."
python manage.py opensearch index rebuild --force
python manage.py opensearch document index --force --refresh

exec "$@"
