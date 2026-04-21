import React from 'react';

function VistaLanding() {
  const user = localStorage.getItem('usuario_logeado');
  
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '50px' }}>
      <h1 style={{ color: '#28a745' }}>🚀 ¡Ingreso Exitoso!</h1>
      <p>Bienvenido al panel central de seguridad, <strong>{user}</strong>.</p>
      
      <div style={{ marginTop: '20px', textAlign: 'left', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Resumen del Sistema</h3>
        <ul>
          <li>Estado del Servidor: En línea (Railway)</li>
          <li>Base de Datos: Conectada (Supabase Brasil)</li>
          <li>Nivel de Encriptación: AES-256 / Bcrypt</li>
        </ul>
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '30px' }}
        onClick={() => {
          localStorage.removeItem('usuario_logeado'); // Limpiamos la sesión al salir
          window.location.href='/login';
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

// ¡ESTA ES LA LÍNEA MÁGICA QUE FALTABA!
export default VistaLanding;