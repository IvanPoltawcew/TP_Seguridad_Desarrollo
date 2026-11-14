import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav className="navbar navbar-dark bg-dark app-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand utn-frc-brand" to="/inicio" aria-label="UTN Facultad Regional Córdoba - Inicio">
          <img src="/logo-utn-frc.webp" alt="UTN Facultad Regional Córdoba" />
        </Link>
        <span className="header-title">Seguridad en el Desarrollo de Software</span>
        <div className="header-actions">
          <span className="header-version sin-sanitizar">VERSIÓN SIN SANITIZAR</span>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
