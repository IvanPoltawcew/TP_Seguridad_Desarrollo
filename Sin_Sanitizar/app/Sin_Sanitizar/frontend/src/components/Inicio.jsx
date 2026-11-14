import React from "react";
import { Link } from "react-router-dom";
import "../inicio.css";

function Inicio() {
  const secciones = [
    { titulo: "Películas", descripcion: "Explorá el catálogo de películas", ruta: "/peliculas", icono: "fa-film", color: "azul" },
    { titulo: "Libros", descripcion: "Organizá títulos y autores", ruta: "/libros", icono: "fa-book-open", color: "verde" },
    { titulo: "Países", descripcion: "Consultá países y regiones", ruta: "/paises", icono: "fa-earth-americas", color: "naranja" },
    { titulo: "Series", descripcion: "Descubrí series y temporadas", ruta: "/series", icono: "fa-tv", color: "violeta" },
    { titulo: "Equipos · SQLi", descripcion: "Módulo original para comparación local", ruta: "/equipos", icono: "fa-triangle-exclamation", color: "naranja" },
  ];

  return (
    <main className="inicio-page">
      <section className="inicio-contenido">
        <div className="inicio-intro">
          <span className="inicio-eyebrow">Panel de gestión</span>
          <h1>Bienvenido</h1>
          <p>Elegí una sección para comenzar a trabajar.</p>
        </div>
        <div className="menu-grid">
          {secciones.map((seccion) => (
            <Link className="menu-card" to={seccion.ruta} key={seccion.ruta}>
              <span className={`menu-card-icono ${seccion.color}`}>
                <i className={`fa-solid ${seccion.icono}`} aria-hidden="true"></i>
              </span>
              <span className="menu-card-texto">
                <strong>{seccion.titulo}</strong>
                <span>{seccion.descripcion}</span>
              </span>
              <i className="fa-solid fa-arrow-right menu-card-flecha" aria-hidden="true"></i>
            </Link>
          ))}
        </div>
        <p className="inicio-pie">Trabajo Práctico Integrador · SQLi y seguridad web</p>
      </section>
    </main>
  );
}

export { Inicio };
