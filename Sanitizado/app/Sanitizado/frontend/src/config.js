const urlServidor = "http://localhost:3002"



const urlResourcePeliculas = urlServidor + "/api/peliculas";
const urlResourceLibros = urlServidor + "/api/libros";
const urlResourcePaises = urlServidor + "/api/paises";
const urlResourceSeries = urlServidor + "/api/series";
const urlLogin = urlServidor + "/api/login"

export const config = {
    urlServidor,
    urlResourcePeliculas,
    urlResourceLibros,
    urlResourcePaises,
    urlResourceSeries,
    urlLogin
}