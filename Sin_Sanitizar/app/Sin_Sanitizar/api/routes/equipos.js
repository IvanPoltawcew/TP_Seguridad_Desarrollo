const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

// Consulta GET para equipos sin saneamiento
router.get("/api/equipos", async function (req, res, next) {
    console.log(req.query);
    try {
        const Pagina = req.query.Pagina ?? 1;
        const TamañoPagina = 10;
        const Activo = req.query.Activo || "";
        const Nombre = req.query.Nombre ? `%${req.query.Nombre}%` : '%';
        const query = `
                    SELECT IdEquipo, Nombre, FechaFundacion, Activo 
                    FROM equipos 
                    WHERE Nombre LIKE '${Nombre}'
                    
                   
                    ORDER BY IdEquipo ASC
                    `;
        const [rows, fields] = await db.sequelize.query(query); // Vulnerable a SQL Injection
        res.json({ Items: rows, RegistrosTotal: rows.length });
    } catch (err) {
        res.status(500).json({ message: "Error en la consulta" });
    }
});

// Consulta GET para un equipo específico sin sanitización
router.get("/api/equipos/:id", async function (req, res, next) {
    try {
        const query = `
            SELECT IdEquipo, Nombre, FechaFundacion, Activo 
            FROM equipos 
            WHERE IdEquipo = ${req.params.id}`;  // Vulnerable a SQL Injection
        
        const [rows, fields] = await db.sequelize.query(query); // Vulnerable
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ message: "Error en la consulta" });
    }
});

// Inserción de un nuevo equipo sin saneamiento
router.post("/api/equipos/", async (req, res) => {
    try {
        const { Nombre, FechaFundacion, Activo } = req.body;

        // Consulta SQL vulnerable a inyecciones SQL
        const query = `
            INSERT INTO equipos (Nombre, FechaFundacion, Activo) 
            VALUES ('${Nombre}', '${FechaFundacion}', ${Activo})`;  // Vulnerable
        
        await db.sequelize.query(query); // Vulnerable
        res.status(200).json({ message: "Equipo agregado correctamente." });
    } catch (err) {
        res.status(500).json({ message: "Error al insertar el equipo." });
    }
});

// Actualización de un equipo sin saneamiento
router.put("/api/equipos/:id", async (req, res) => {
    try {
        const { Nombre, FechaFundacion, Activo } = req.body;

        // Consulta SQL vulnerable a inyecciones SQL
        const query = `
            UPDATE equipos 
            SET Nombre = '${Nombre}', FechaFundacion = '${FechaFundacion}', Activo = ${Activo} 
            WHERE IdEquipo = ${req.params.id}`;  // Vulnerable
        
        await db.sequelize.query(query); // Vulnerable
        res.status(200).json({ message: "Equipo actualizado correctamente." });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el equipo." });
    }
});

// Eliminación de un equipo sin saneamiento
router.delete("/api/equipos/:id", async (req, res) => {
    try {
        // Consulta SQL vulnerable a inyecciones SQL
        const query = `
            DELETE FROM equipos 
            WHERE IdEquipo = ${req.params.id}`;  // Vulnerable
        
        const [result] = await db.sequelize.query(query); // Vulnerable
        res.status(result.affectedRows > 0 ? 200 : 404).json({ message: "Equipo eliminado correctamente." });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el equipo." });
    }
});

module.exports = router;
