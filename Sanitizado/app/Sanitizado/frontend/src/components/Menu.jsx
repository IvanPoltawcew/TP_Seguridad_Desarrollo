import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const token = Cookies.get('authtoken');
  const navigate = useNavigate();

  async function cerrarSesion(){
    Cookies.remove('authtoken', { path: '/' });
     await fetch("http://localhost:3002/closeSession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            })
      navigate('/inicio')
  }

  return (
    <nav className="navbar navbar-dark bg-dark app-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand utn-frc-brand" to="/inicio" aria-label="UTN Facultad Regional Córdoba - Inicio">
          <img src="/logo-utn-frc.webp" alt="UTN Facultad Regional Córdoba" />
        </Link>
        <span className="header-title">Seguridad en el Desarrollo de Software</span>
        <div className="header-actions">
          <div className="d-flex align-items-center gap-2">
            {token ? (
              <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                <i className="fa-solid fa-arrow-right-from-bracket me-2" aria-hidden="true"></i>
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-primary btn-sm" to="/register">Crear cuenta</Link>
              </>
            )}
          </div>
          <span className="header-version sanitizada">VERSIÓN SANITIZADA</span>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
