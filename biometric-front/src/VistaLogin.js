import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function VistaLogin() {
  const webcamRef = useRef(null);
  // Estados para capturar lo que el usuario teclea
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState({ tipo: '', texto: '' });

  const verificarAcceso = async () => {
    console.log("Mi API URL es:", process.env.REACT_APP_API_URL);
    if (!username || !password) {
      setEstado({ tipo: 'error', texto: 'Ingresa tu usuario y contraseña primero.' });
      return;
    }

    setEstado({ tipo: '', texto: 'Verificando credenciales y analizando rostro...' });
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    
    const formData = new FormData();
    formData.append('foto', blob, 'login.jpg');
    formData.append('username', username); // Nuevo
    formData.append('password', password); // Nuevo

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if(data.access) {
          setEstado({ tipo: 'exito', texto: `¡Autenticación exitosa! Redirigiendo...` });
          
          // Guardamos el nombre del usuario para que el Landing Page lo pueda leer
          localStorage.setItem('usuario_logeado', data.user);
          
          // Esperamos medio segundo para que lea el mensaje y lo enviamos al Dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);

      } else {
          setEstado({ tipo: 'error', texto: `🔴 ACCESO DENEGADO: ${data.message}` });
      }
    } catch (err) {
      setEstado({ tipo: 'error', texto: 'Error de conexión con los servidores de seguridad.' });
    }
  };

  return (
    <div className="card">
      <h2>Punto de Control (Autenticación Doble)</h2>
      
      <input 
        type="text" 
        className="input-text"
        placeholder="Nombre de Usuario" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        className="input-text"
        placeholder="Contraseña" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />

      <div className="webcam-container">
        <Webcam 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" 
            width="100%" 
            videoConstraints={{ facingMode: "user" }}
        />
      </div>
      
      <button className="btn btn-success" onClick={verificarAcceso}>
        INICIAR ESCANEO Y VERIFICAR
      </button>

      {estado.texto && (
        <div className={`mensaje ${estado.tipo}`}>
          {estado.texto}
        </div>
      )}
    </div>
  );
}

export default VistaLogin;