import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function VistaRegistro() {
  const webcamRef = useRef(null);
  // Añadimos los nuevos estados para las credenciales
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState({ tipo: '', texto: '' });

  const registrarUsuario = async () => {
    if (!nombre || !username || !password) {
      setEstado({ tipo: 'error', texto: 'Por favor, llena todos los campos.' });
      return;
    }

    setEstado({ tipo: '', texto: 'Procesando biometría y encriptando credenciales...' });
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    
    const formData = new FormData();
    formData.append('foto', blob, 'registro.jpg');
    formData.append('nombre', nombre);
    formData.append('username', username); // Nuevo
    formData.append('password', password); // Nuevo

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if(data.status === "success") {
          setEstado({ tipo: 'exito', texto: data.message });
          // Limpiamos el formulario
          setNombre('');
          setUsername('');
          setPassword('');
      } else {
          setEstado({ tipo: 'error', texto: data.message || "Error al registrar" });
      }
    } catch (err) {
      setEstado({ tipo: 'error', texto: 'Error conectando con el servidor local.' });
    }
  };

  return (
    <div className="card">
      <h2>Alta de Personal (Multifactor)</h2>
      <div className="webcam-container">
        <Webcam 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" 
            width="100%" 
            videoConstraints={{ facingMode: "user" }}
        />
      </div>
      
      <input 
        type="text" 
        className="input-text"
        placeholder="Nombre Completo (Ej. Jose Daniel)" 
        value={nombre} 
        onChange={(e) => setNombre(e.target.value)} 
      />
      <input 
        type="text" 
        className="input-text"
        placeholder="Nombre de Usuario (Ej. jdanield)" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        className="input-text"
        placeholder="Contraseña segura" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      
      <button className="btn btn-primary" onClick={registrarUsuario}>
        Guardar Identidad Híbrida
      </button>

      {estado.texto && (
        <div className={`mensaje ${estado.tipo}`}>
          {estado.texto}
        </div>
      )}
    </div>
  );
}

export default VistaRegistro;