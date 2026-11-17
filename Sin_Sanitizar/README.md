# TPI_SEG

## Comparación de catálogos

La interfaz presenta los catálogos de Películas, Libros, Países y Series. Sus rutas CRUD usan Sequelize y permanecen separadas de la ruta original `/api/equipos`, que se conserva sin cambios y sigue accesible desde la tarjeta “Equipos · SQLi” para la comparación en un entorno local de clase. No expongas esta copia vulnerable en una red o entorno público.

La base de datos conserva las tablas y datos de los módulos originales; los catálogos nuevos crean sus propias tablas y agregan ejemplos cuando están vacías. La copia `Sanitizado/` contiene la interfaz correspondiente y las rutas de catálogo protegidas/parametrizadas.

## Ejecución local en paralelo con Sanitizado

Esta copia usa el puerto `3003` para la API y `3006` para React, para no interferir con Sanitizado (`3002` y `3000`).

```powershell
npm --prefix 'SinSanitizar\TPI_SEG\app\Sin_Sanitizar' start
```

En otra terminal:

```powershell
npm --prefix 'SinSanitizar\TPI_SEG\app\Sanitizado' run dev
```

Abrir `http://localhost:3006`. La ruta de Equipos es deliberadamente vulnerable y solo debe usarse en localhost.