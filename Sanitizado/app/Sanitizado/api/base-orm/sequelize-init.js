const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite:" + "./.data/DATABASE.db");

const users = sequelize.define("users", {
  idUsuario: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const sessions = sequelize.define("sessions", {
  idSesion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "users", key: "idUsuario" },
  },
  jwtToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anulated: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  timestamps: false,
});

sessions.belongsTo(users, {
  foreignKey: "idUsuario",
  as: "user",
});

const peliculas = sequelize.define("Peliculas", {
  IdPelicula: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true, len: [1, 100] },
  },
  Director: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true, len: [1, 80] } },
  Genero: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true, len: [1, 50] } },
  AnioEstreno: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1888, max: 2100, isInt: true } },
  Activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: "peliculas", timestamps: false });

const libros = sequelize.define("Libros", {
  IdLibro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Titulo: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true, len: [1, 120] },
  },
  Autor: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true, len: [1, 80] } },
  Genero: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true, len: [1, 50] } },
  AnioPublicacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: -3000, max: 2100, isInt: true } },
  Activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: "libros", timestamps: false });

const paises = sequelize.define("Paises", {
  IdPais: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: {
    type: DataTypes.STRING(80),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true, len: [1, 80] },
  },
  Capital: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true, len: [1, 80] } },
  Continente: { type: DataTypes.STRING(40), allowNull: false, validate: { notEmpty: true, len: [1, 40] } },
  Poblacion: { type: DataTypes.BIGINT, allowNull: false, validate: { min: 0, isInt: true } },
  Activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: "paises", timestamps: false });

const series = sequelize.define("Series", {
  IdSerie: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true, len: [1, 100] },
  },
  Creador: { type: DataTypes.STRING(80), allowNull: false, validate: { notEmpty: true, len: [1, 80] } },
  Genero: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true, len: [1, 50] } },
  Temporadas: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 100, isInt: true } },
  Activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: "series", timestamps: false });

module.exports = {
  sequelize,
  peliculas,
  libros,
  paises,
  series,
  users,
  sessions,
};
