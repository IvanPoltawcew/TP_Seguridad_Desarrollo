# Trabajo Practico Integrador: seguridad web

## Objetivo

Este repositorio contiene una aplicacion web con catalogos CRUD de peliculas, libros, paises y series. Las carpetas `Sanitizado` y `SinSanitizar` permiten comparar una version que incorpora cambios de seguridad con otra que conserva una implementacion vulnerable en la ruta de equipos.

Este README documenta una revision estatica y una prueba local de la copia ubicada en `Sanitizado/TPI_SEG`. No afirma autoria de los cambios existentes. Antes de entregar el trabajo, cada estudiante debe verificar el origen del codigo, las reglas de la catedra y los cambios que efectivamente realizo.

## Estructura

- `API`: API Express, modelos Sequelize, rutas y middleware.
- `afrontend`: interfaz React.
- `../../SinSanitizar/TPI_SEG`: version de referencia para comparar el comportamiento de `/api/equipos`.

Los catalogos de Peliculas, Libros, Paises y Series comparten la misma interfaz de busqueda, paginacion, consulta, alta, modificacion y baja logica. Al iniciar, la API elimina las tablas heredadas de equipos, facturas, automoviles y provincias, y crea las tablas de catalogo actuales con unos pocos registros de ejemplo si estan vacias.

## Comparacion de seguridad

### Inyeccion SQL en equipos

En la version SinSanitizar, las operaciones de `/api/equipos` construyen SQL mediante interpolacion de valores recibidos por la API. Esto permite que la entrada se interprete como parte de la consulta SQL.

La implementacion historica Sanitizado de equipos uso consultas de Sequelize y parametros `replacements` para la baja logica. Ese modulo, sus datos y sus tablas se retiraron al reemplazar los catalogos por Peliculas, Libros, Paises y Series; la version SinSanitizar se conserva como referencia para la comparacion. La aplicacion Sanitizado actual ya no expone `/api/equipos`.

La comparacion SQLi se limita a ese caso historico y no debe describirse como una sanitizacion completa de toda la aplicacion ni como una limpieza de HTML. React renderiza texto escapado de forma predeterminada.

### Autenticacion agregada

La copia Sanitizado incorpora registro y login, hash de contrasenas con bcrypt, JWT con vencimiento de cinco minutos, persistencia de sesiones y un middleware aplicado a las rutas de datos. El frontend agrega pantallas de login/registro y una ruta protegida.

Estos controles agregan autenticacion y control de acceso; son distintos de la parametrizacion SQL.

## Observaciones pendientes

La revision encontro estos puntos que conviene corregir y probar antes de considerar la aplicacion segura:

1. En `api/middleware/validateIdentity.js`, el error del callback de `jwt.verify` responde `401`, pero el flujo exterior no termina expresamente. La verificacion debe impedir que una solicitud con token invalido llegue a `next()`.
2. `api/routes/login.js` escribe usuario, contrasena y JWT en la salida de consola. No registrar contrasenas ni tokens.
3. La cookie de autenticacion configura `httpOnly: false` y `secure: false`. Para un despliegue real, revisar `HttpOnly`, HTTPS y la politica `SameSite`.
4. `frontend/src/components/Login.jsx` navega luego de parsear la respuesta sin comprobar `response.ok`; la interfaz puede mostrar un login como exitoso aunque el servidor lo rechace.
5. CORS permite credenciales y refleja el origen recibido. En un entorno real, limitarlo a los origenes necesarios.
Estas observaciones provienen de lectura de codigo; no equivalen a una auditoria exhaustiva ni a una prueba de penetracion.

## Ejecucion local

Requisitos: Node.js y npm. Desde PowerShell, ubicado en la carpeta raiz `TPI`:

```powershell
npm --prefix 'Sanitizado\TPI_SEG\app\tpg15-frontend-main\api' ci
npm --prefix 'Sanitizado\TPI_SEG\app\tpg15-frontend-main\frontend' install --no-package-lock --no-audit --no-fund
```

El `npm ci` del frontend no funciona con el lockfile actual: falta `fsevents@2.3.3`. El comando `npm install --no-package-lock` permitio instalar y compilar sin reescribir ese lockfile. Es una solucion local para poder probar; el lockfile deberia reconciliarse como un cambio independiente.

La API requiere configuracion local en `api/.env`, incluyendo un `JWT_SECRET` no vacio. No publiques ese archivo ni incluyas sus valores en capturas o entregas. La base SQLite se encuentra bajo `api/.data`.

Abrir dos terminales desde la raiz del proyecto y ejecutar:

```powershell
npm --prefix 'Sanitizado\TPI_SEG\app\tpg15-frontend-main\api' start
```

```powershell
npm --prefix 'Sanitizado\TPI_SEG\app\tpg15-frontend-main\frontend' start
```

La interfaz queda en `http://localhost:3000` y la API en `http://localhost:3002`. Para cerrar cada proceso, usar `Ctrl+C` en su terminal.

## Verificacion realizada

- El build de React termino correctamente. Reporto advertencias de ESLint por imports/variables sin uso y detalles menores de JSX.
- Se verifico el listado inicial de los cuatro catalogos y el ciclo de alta, consulta, modificacion y baja logica de peliculas contra SQLite.
- La migracion elimina las tablas heredadas de equipos, facturas, automoviles y provincias.
- La pantalla de inicio muestra los accesos a Peliculas, Libros, Paises y Series.
- La pagina principal respondio `200` en `http://localhost:3000`.
- No se completo un flujo de registro/login. Por eso, el funcionamiento de autenticacion con credenciales validas queda sin verificar.
- La instalacion del backend reporto 50 vulnerabilidades en dependencias: 14 low, 6 moderate, 25 high y 5 critical. Revisar con `npm audit` y evaluar las actualizaciones por separado; no aplicar actualizaciones forzadas sin probar compatibilidad.

## Propuesta para presentar el trabajo

Una entrega defendible puede organizarse asi:

1. **Problema y alcance:** describir la aplicacion y la vulnerabilidad concreta que se analiza, sin afirmar que todas las rutas tienen el mismo riesgo.
2. **Metodo:** explicar como se compararon las dos versiones, que archivos se inspeccionaron y que pruebas se ejecutaron.
3. **Caso vulnerable:** documentar la construccion de SQL en SinSanitizar y explicar por que concatenar entrada cambia la estructura de la consulta.
4. **Mitigacion:** documentar el cambio historico de la ruta Sanitizado a Sequelize/parametros y explicar por que los valores dejan de ser interpretados como SQL.
5. **Autenticacion:** describir bcrypt, JWT, sesiones y proteccion de rutas, separando estos controles de la mitigacion de SQLi.
6. **Pruebas y resultados:** agregar casos reproducibles, resultados esperados/obtenidos y limitaciones. Probar al menos entrada normal, entrada con caracteres SQL, acceso sin autenticacion y acceso tras login.
7. **Riesgos pendientes:** priorizar los hallazgos de la seccion anterior y proponer correcciones verificables.
8. **Aportes y referencias:** indicar con claridad que codigo se recibio como referencia, que cambios propios se hicieron y que fuentes/documentacion se consultaron, segun las reglas de la catedra.

Antes de entregar, reemplazar cualquier afirmacion de este borrador que no se haya verificado personalmente, agregar los cambios propios y confirmar que la catedra permite el uso de codigo de referencia. No presentar como propio el trabajo previo de otra persona.