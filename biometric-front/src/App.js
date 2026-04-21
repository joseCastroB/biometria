// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VistaRegistro from './VistaRegistro';
import VistaLogin from './VistaLogin';
import VistaLanding from './VistaLanding';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Barra de Navegación Superior */}
        <nav className="navbar">
          <Link to="/login" className="nav-link">Control de Acceso</Link>
          <Link to="/registro" className="nav-link">Registrar Empleado</Link>
        </nav>

        {/* Aquí se cargarán las vistas dependiendo de la URL */}
        <Routes>
          <Route path="/" element={<VistaLogin />} />
          <Route path="/login" element={<VistaLogin />} />
          <Route path="/registro" element={<VistaRegistro />} />
          <Route path="/dashboard" element={<VistaLanding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;