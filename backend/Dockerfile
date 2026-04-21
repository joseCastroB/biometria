# Usamos una imagen de Python ligera
FROM python:3.11-slim

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema para OpenCV y DeepFace
RUN apt-get update --fix-missing && \
    apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Railway usa la variable de entorno PORT, le decimos a uvicorn que la use
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}