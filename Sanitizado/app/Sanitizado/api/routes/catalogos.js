const express = require("express");
const { Op, ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");

const router = express.Router();
const PAGE_SIZE = 10;

const catalogos = [
  { path: "/api/peliculas", model: db.peliculas, id: "IdPelicula", search: "Titulo", fields: ["Titulo", "Director", "Genero", "AnioEstreno"] },
  { path: "/api/libros", model: db.libros, id: "IdLibro", search: "Titulo", fields: ["Titulo", "Autor", "Genero", "AnioPublicacion"] },
  { path: "/api/paises", model: db.paises, id: "IdPais", search: "Nombre", fields: ["Nombre", "Capital", "Continente", "Poblacion"] },
  { path: "/api/series", model: db.series, id: "IdSerie", search: "Titulo", fields: ["Titulo", "Creador", "Genero", "Temporadas"] },
];

const semillas = {
  "/api/peliculas": [
    { Titulo: "El secreto de sus ojos", Director: "Juan José Campanella", Genero: "Drama", AnioEstreno: 2009, Activo: true },
    { Titulo: "Nueve reinas", Director: "Fabián Bielinsky", Genero: "Suspenso", AnioEstreno: 2000, Activo: true },
  ],
  "/api/libros": [
    { Titulo: "El Aleph", Autor: "Jorge Luis Borges", Genero: "Cuentos", AnioPublicacion: 1949, Activo: true },
    { Titulo: "Rayuela", Autor: "Julio Cortázar", Genero: "Novela", AnioPublicacion: 1963, Activo: true },
  ],
  "/api/paises": [
    { Nombre: "Argentina", Capital: "Buenos Aires", Continente: "América del Sur", Poblacion: 46000000, Activo: true },
    { Nombre: "Uruguay", Capital: "Montevideo", Continente: "América del Sur", Poblacion: 3500000, Activo: true },
  ],
  "/api/series": [
    { Titulo: "Los simuladores", Creador: "Damián Szifron", Genero: "Comedia", Temporadas: 2, Activo: true },
    { Titulo: "Okupas", Creador: "Bruno Stagnaro", Genero: "Drama", Temporadas: 1, Activo: true },
  ],
};

const catalogosListos = (async () => {
  for (const tabla of ["equipos", "facturas", "Automoviles", "provincias"]) {
    await db.sequelize.query(`DROP TABLE IF EXISTS "${tabla}"`);
  }

  await Promise.all(catalogos.map(async (catalogo) => {
    await catalogo.model.sync();
    if (await catalogo.model.count() === 0) {
      await catalogo.model.bulkCreate(semillas[catalogo.path]);
    }
  }));
})();

router.use(async (req, res, next) => {
  await catalogosListos;
  next();
});

for (const catalogo of catalogos) {
  router.get(catalogo.path, async (req, res) => {
    const pagina = Number(req.query.Pagina ?? 1);
    if (!Number.isInteger(pagina) || pagina < 1) {
      return res.status(400).json({ message: "La página debe ser un entero positivo." });
    }

    const where = {};
    const termino = typeof req.query.Termino === "string" ? req.query.Termino.trim() : "";
    if (termino) where[catalogo.search] = { [Op.like]: `%${termino}%` };
    if (req.query.Activo === "true") where.Activo = true;
    if (req.query.Activo === "false") where.Activo = false;

    const { count, rows } = await catalogo.model.findAndCountAll({
      where,
      order: [[catalogo.id, "ASC"]],
      offset: (pagina - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    });
    res.json({ Items: rows, RegistrosTotal: count });
  });

  router.get(`${catalogo.path}/:id`, async (req, res) => {
    const registro = await catalogo.model.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro no encontrado." });
    res.json(registro);
  });

  router.post(catalogo.path, async (req, res) => {
    try {
      const datos = Object.fromEntries(catalogo.fields.map((field) => [field, req.body[field]]));
      datos.Activo = req.body.Activo ?? true;
      const registro = await catalogo.model.create(datos);
      res.status(201).json(registro);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.errors.map((item) => item.message).join("\n") });
      }
      throw error;
    }
  });

  router.put(`${catalogo.path}/:id`, async (req, res) => {
    try {
      const registro = await catalogo.model.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ message: "Registro no encontrado." });
      for (const field of catalogo.fields) registro[field] = req.body[field];
      await registro.save();
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.errors.map((item) => item.message).join("\n") });
      }
      throw error;
    }
  });

  router.delete(`${catalogo.path}/:id`, async (req, res) => {
    const registro = await catalogo.model.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro no encontrado." });
    registro.Activo = !registro.Activo;
    await registro.save();
    res.sendStatus(204);
  });
}

module.exports = router;
