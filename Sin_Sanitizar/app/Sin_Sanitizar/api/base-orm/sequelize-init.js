// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + process.env.base );
const sequelize = new Sequelize("sqlite:" + "./.data/DATABASE.db");


const facturas = sequelize.define(
    "facturas",{
        IdFactura:{ 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        FechaAlta:{
            type: DataTypes.DATEONLY,
            allowNull:false
        },
        Email:{
            type: DataTypes.STRING,
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        }
    },
    {
        // pasar a mayusculas
        hooks: {
          beforeValidate: function (equipo, options) {
            if (typeof equipo.Nombre === "string") {
              equipo.Nombre = equipo.Nombre.toUpperCase().trim();
            }
          },
        },
    
        timestamps: false,
      }
);

//definicion del modelo de datos

const automoviles = sequelize.define(
    "Automoviles",
    {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING(55),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "El nombre es requerido",
                },
                len: {
                    args: [3, 55],
                    msg: "Nombre debe ser tipo carateres, entre 5 y 20 de longitud",
                },
            },
            unique: {
                args: true,
                msg: "este nombre ya existe en la tabla!",
            },
        },
        Marca: {
            type: DataTypes.STRING(55),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'La marca del auto es requerida!'
                }
            }
        },
        FechaLanzamiento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "La fecha Lanazamiento es requerida!",
                }
            }
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    masg: 'EL valor booleano de activo es requerido!'
                }
            }
        }

},
    {
        // pasar a mayusculas
        hooks: {
          beforeValidate: function (automoviles, options) {
            if (typeof automoviles.Nombre === "string") {
              automoviles.Nombre = automoviles.Nombre.toUpperCase().trim();
            }
          },
        },
    
        timestamps: false,
      }
);
//definicion del modelo de datos

const equipos = sequelize.define(
    "equipos",
    {
        IdEquipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Nombre es requerido",
                },
                len: {
                    args: [5, 20],
                    msg: "Nombre debe ser tipo carateres, entre 5 y 20 de longitud",
                },
            },
            unique: {
                args: true,
                msg: "este Nombre ya existe en la tabla!",
            },
        },
        FechaFundacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Fecha Alta es requerido",
                }
            }


        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate:{
                notNull:{
                    args: true,
                    msg: "Activo es requerido",
                }
            }
        },

    },
    {
        // pasar a mayusculas
        hooks: {
          beforeValidate: function (equipo, options) {
            if (typeof equipo.Nombre === "string") {
              equipo.Nombre = equipo.Nombre.toUpperCase().trim();
            }
          },
        },
    
        timestamps: false,
      }
);

const provincias = sequelize.define(
    "provincias",
    {
        IdProvincia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Nombre de la provincia es requerida.",
                },
                len: {
                    args: [4, 60],
                    msg: "El nombre debe ser de tipo string, entre 4 y 60.",
                },
            },
            unique: {
                args: true,
                msg: "Este nombre ya existe en la tabla.",
            },
        },
        FechaFundacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull: {
                    args: true,
                    msg: "Fecha de fundación es requerida.",
                }
            }


        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate:{
                notNull:{
                    args: true,
                    msg: "Activo es requerido.",
                }
            }
        },

    },
    {
        // pasar a mayusculas
        hooks: {
          beforeValidate: function (provincia, options) {
            if (typeof provincia.Nombre === "string") {
              provincia.Nombre = provincia.Nombre.toUpperCase().trim();
            }
          },
        },
        timestamps: false,
      }
);

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
    equipos,
    facturas,
    automoviles,
    provincias,
    peliculas,
    libros,
    paises,
    series,
 };
