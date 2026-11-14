const express = require("express");
const request = require("supertest");
const catalogosRouter = require("../routes/catalogos");
const db = require("../base-orm/sequelize-init");

const app = express();
app.use(express.json(), catalogosRouter);
const client = request(app);

const catalogos = [
  {
    ruta: "/api/peliculas",
    modelo: db.peliculas,
    clave: "IdPelicula",
    campos: { Titulo: "Prueba", Director: "Directora", Genero: "Drama", AnioEstreno: 2020 },
    actualizacion: { Director: "Director actualizado", AnioEstreno: 2021 },
  },
  {
    ruta: "/api/libros",
    modelo: db.libros,
    clave: "IdLibro",
    campos: { Titulo: "Prueba", Autor: "Autora", Genero: "Novela", AnioPublicacion: 2020 },
    actualizacion: { Autor: "Autor actualizado", AnioPublicacion: 2021 },
  },
  {
    ruta: "/api/paises",
    modelo: db.paises,
    clave: "IdPais",
    campos: { Nombre: "Prueba", Capital: "Capital prueba", Continente: "América", Poblacion: 1234 },
    actualizacion: { Capital: "Capital actualizada", Poblacion: 2345 },
  },
  {
    ruta: "/api/series",
    modelo: db.series,
    clave: "IdSerie",
    campos: { Titulo: "Prueba", Creador: "Creadora", Genero: "Drama", Temporadas: 1 },
    actualizacion: { Creador: "Creador actualizado", Temporadas: 2 },
  },
];

const registrosCreados = [];

afterAll(async () => {
  for (const { modelo, clave, id } of registrosCreados) {
    await modelo.destroy({ where: { [clave]: id } });
  }
  await db.sequelize.close();
});

test.each(catalogos)("CRUD de $ruta", async (catalogo) => {
  const { ruta, clave, campos } = catalogo;
  const sufijo = Date.now().toString();
  const uniqueFields = { ...campos };
  if (uniqueFields.Titulo) uniqueFields.Titulo += ` ${sufijo}`;
  if (uniqueFields.Nombre) uniqueFields.Nombre += ` ${sufijo}`;

  let response = await client.get(ruta).query({ Pagina: 1 });
  expect(response.status).toBe(200);
  expect(response.body.Items.length).toBeGreaterThan(0);

  response = await client.post(ruta).send(uniqueFields);
  expect(response.status).toBe(201);
  const id = response.body[clave];
  registrosCreados.push({ modelo: catalogo.modelo, clave, id });

  const termino = uniqueFields.Titulo ?? uniqueFields.Nombre;
  response = await client.get(ruta).query({ Termino: termino, Pagina: 1 });
  expect(response.status).toBe(200);
  expect(response.body.Items.some((registro) => registro[clave] === id)).toBe(true);

  response = await client.get(`${ruta}/${id}`);
  expect(response.status).toBe(200);
  expect(response.body[clave]).toBe(id);

  response = await client.put(`${ruta}/${id}`).send({ ...uniqueFields, ...catalogo.actualizacion });
  expect(response.status).toBe(204);

  response = await client.delete(`${ruta}/${id}`);
  expect(response.status).toBe(204);
  response = await client.get(`${ruta}/${id}`);
  expect(response.body.Activo).toBe(false);
});
