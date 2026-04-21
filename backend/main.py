import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import numpy as np
import cv2
from deepface import DeepFace
from passlib.context import CryptContext

os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pro-tip: En Railway, usa os.getenv("DATABASE_URL") en lugar de hardcodear esto
URI_SUPABASE = os.getenv("DATABASE_URL")

def procesar_imagen_upload(file):
    contents = file.file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/register")
async def register(
    nombre: str = Form(...), 
    username: str = Form(...), 
    password: str = Form(...), 
    foto: UploadFile = File(...)
):
    conn = None
    try:
        hashed_password = pwd_context.hash(password)
        img = procesar_imagen_upload(foto)
        
        # enforce_detection=True obliga a que haya una cara clara
        res = DeepFace.represent(img, model_name="Facenet", enforce_detection=True)
        vector = [float(x) for x in res[0]["embedding"]]

        conn = psycopg2.connect(URI_SUPABASE)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO usuarios_biometricos (nombre, username, password_hash, vector_biometrico) VALUES (%s, %s, %s, %s)",
            (nombre, username, hashed_password, vector)
        )
        conn.commit()
        return {"status": "success", "message": "Usuario registrado con éxito"}
    
    except ValueError:
        raise HTTPException(status_code=400, detail="No se detectó un rostro claro en la imagen.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            cur.close()
            conn.close()

@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...), foto: UploadFile = File(...)):
    conn = None
    try:
        conn = psycopg2.connect(URI_SUPABASE)
        cur = conn.cursor()
        
        cur.execute("SELECT nombre, password_hash, vector_biometrico FROM usuarios_biometricos WHERE username = %s", (username,))
        user_data = cur.fetchone()
        
        # 1. Validación de credenciales
        if not user_data or not pwd_context.verify(password, user_data[1]):
            return {"access": False, "message": "Usuario o contraseña incorrectos"}

        # 2. Validación Biométrica
        img = procesar_imagen_upload(foto)
        res_vivo = DeepFace.represent(img, model_name="Facenet", enforce_detection=True)
        vector_vivo = res_vivo[0]["embedding"]
        
        v1, v2 = np.array(vector_vivo), np.array(user_data[2])
        
        # Distancia Coseno: $1 - \frac{u \cdot v}{||u|| ||v||}$
        distancia = 1 - (np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

        if distancia < 0.28:
            return {"access": True, "user": user_data[0], "distance": round(distancia, 4)}
        
        return {"access": False, "message": f"Verificación facial fallida (Distancia: {round(distancia, 4)})"}

    except ValueError:
        return {"access": False, "message": "No se detectó un rostro en la cámara."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)