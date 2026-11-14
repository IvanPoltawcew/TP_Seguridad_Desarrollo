import { config } from "../config";

const catalogos = {
  peliculas: {
    titulo: "Películas",
    recurso: config.urlResourcePeliculas,
    clave: "IdPelicula",
    campos: [
      { nombre: "Titulo", etiqueta: "Título", maxLength: 100 },
      { nombre: "Director", etiqueta: "Director", maxLength: 80 },
      { nombre: "Genero", etiqueta: "Género", maxLength: 50 },
      { nombre: "AnioEstreno", etiqueta: "Año de estreno", tipo: "number", min: 1888, max: 2100 },
    ],
  },
  libros: {
    titulo: "Libros",
    recurso: config.urlResourceLibros,
    clave: "IdLibro",
    campos: [
      { nombre: "Titulo", etiqueta: "Título", maxLength: 120 },
      { nombre: "Autor", etiqueta: "Autor", maxLength: 80 },
      { nombre: "Genero", etiqueta: "Género", maxLength: 50 },
      { nombre: "AnioPublicacion", etiqueta: "Año de publicación", tipo: "number", min: -3000, max: 2100 },
    ],
  },
  paises: {
    titulo: "Países",
    recurso: config.urlResourcePaises,
    clave: "IdPais",
    campos: [
      { nombre: "Nombre", etiqueta: "País", maxLength: 80 },
      { nombre: "Capital", etiqueta: "Capital", maxLength: 80 },
      { nombre: "Continente", etiqueta: "Continente", maxLength: 40 },
      { nombre: "Poblacion", etiqueta: "Población", tipo: "number", min: 0, max: 10000000000 },
    ],
  },
  series: {
    titulo: "Series",
    recurso: config.urlResourceSeries,
    clave: "IdSerie",
    campos: [
      { nombre: "Titulo", etiqueta: "Título", maxLength: 100 },
      { nombre: "Creador", etiqueta: "Creador", maxLength: 80 },
      { nombre: "Genero", etiqueta: "Género", maxLength: 50 },
      { nombre: "Temporadas", etiqueta: "Temporadas", tipo: "number", min: 1, max: 100 },
    ],
  },
};

export default catalogos;
