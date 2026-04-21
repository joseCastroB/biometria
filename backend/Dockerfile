# Usamos una imagen de Python ligera
FROM python:3.11-slim

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema para OpenCV y DeepFace
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Railway usa la variable de entorno PORT, le decimos a uvicorn que la use
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}