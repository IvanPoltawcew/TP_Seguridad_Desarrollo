import React, { useCallback, useEffect, useState } from "react";
import httpService from "../services/http.services";
import modalDialogService from "../services/modalDialog.service";

const PAGE_SIZE = 10;

function Catalogo({ config }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [paginas, setPaginas] = useState([]);
  const [termino, setTermino] = useState("");
  const [activo, setActivo] = useState("");
  const [accion, setAccion] = useState("L");
  const [item, setItem] = useState(null);

  const buscar = useCallback(async (paginaSolicitada = 1, filtro = "", estado = "") => {
    try {
      const { data } = await httpService.get(config.recurso, {
        params: { Termino: filtro, Activo: estado, Pagina: paginaSolicitada },
      });
      setItems(data.Items);
      setTotal(data.RegistrosTotal);
      setPagina(Number(paginaSolicitada));
      setPaginas(Array.from(
        { length: Math.ceil(data.RegistrosTotal / PAGE_SIZE) },
        (_, index) => index + 1
      ));
    } catch (error) {
      modalDialogService.Alert(error.response?.data?.message || "No se pudo cargar el catálogo.");
      setItems([]);
      setTotal(0);
      setPaginas([]);
    }
  }, [config]);

  useEffect(() => {
    buscar(1, "", "");
  }, [buscar]);

  function nuevo() {
    setItem(Object.fromEntries([
      [config.clave, 0],
      ...config.campos.map((campo) => [campo.nombre, ""]),
      ["Activo", true],
    ]));
    setAccion("A");
  }

  async function abrir(registro, modo) {
    try {
      const { data } = await httpService.get(`${config.recurso}/${registro[config.clave]}`);
      setItem(data);
      setAccion(modo);
    } catch (error) {
      modalDialogService.Alert(error.response?.data?.message || "No se pudo cargar el registro.");
    }
  }

  async function guardar(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(config.campos.map(({ nombre }) => [nombre, formData.get(nombre)]));
    config.campos.forEach((campo) => {
      if (campo.tipo === "number") data[campo.nombre] = Number(data[campo.nombre]);
    });
    data.Activo = item.Activo;

    try {
      if (accion === "A") {
        await httpService.post(config.recurso, data);
      } else {
        await httpService.put(`${config.recurso}/${item[config.clave]}`, data);
      }
      setAccion("L");
      await buscar(pagina, termino, activo);
      modalDialogService.Alert("El registro se guardó correctamente.", "Listo", "Aceptar", "", null, null, "success");
    } catch (error) {
      modalDialogService.Alert(error.response?.data?.message || "No se pudo guardar el registro.");
    }
  }

  function cambiarEstado(registro) {
    modalDialogService.Confirm(
      `¿Querés ${registro.Activo ? "desactivar" : "activar"} este registro?`,
      "Confirmar acción",
      "Aceptar",
      "Cancelar",
      async () => {
        try {
          await httpService.delete(`${config.recurso}/${registro[config.clave]}`);
          await buscar(pagina, termino, activo);
        } catch (error) {
          modalDialogService.Alert(error.response?.data?.message || "No se pudo cambiar el estado.");
        }
      }
    );
  }

  return (
    <section className="catalogo">
      <div className="tituloPagina">
        {config.titulo} <small>{accion === "L" ? "(Listado)" : accion === "A" ? "(Agregar)" : accion === "M" ? "(Modificar)" : "(Consultar)"}</small>
      </div>
      {accion === "L" ? (
        <>
          <form className="catalogo-filtros" onSubmit={(event) => { event.preventDefault(); buscar(1, termino, activo); }}>
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label" htmlFor="catalogo-termino">{config.campos[0].etiqueta}</label>
                <input id="catalogo-termino" className="form-control" value={termino} onChange={(event) => setTermino(event.target.value)} maxLength={config.campos[0].maxLength} />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="catalogo-activo">Estado</label>
                <select id="catalogo-activo" className="form-select" value={activo} onChange={(event) => setActivo(event.target.value)}>
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" type="submit"><i className="fa-solid fa-magnifying-glass me-2" aria-hidden="true"></i>Buscar</button>
                <button className="btn btn-outline-primary flex-grow-1" type="button" onClick={nuevo}><i className="fa-solid fa-plus me-2" aria-hidden="true"></i>Agregar</button>
              </div>
            </div>
          </form>

          {items.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-sm table-bordered align-middle">
                <thead>
                  <tr>{config.campos.map((campo) => <th key={campo.nombre}>{campo.etiqueta}</th>)}<th>Estado</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                  {items.map((registro) => (
                    <tr key={registro[config.clave]}>
                      {config.campos.map((campo) => <td key={campo.nombre}>{registro[campo.nombre]}</td>)}
                      <td>{registro.Activo ? "Activo" : "Inactivo"}</td>
                      <td className="text-center text-nowrap">
                        <button className="btn btn-sm btn-outline-secondary me-1" type="button" title="Consultar" onClick={() => abrir(registro, "C")}><i className="fa-solid fa-eye" aria-hidden="true"></i></button>
                        <button className="btn btn-sm btn-outline-primary me-1" type="button" title="Modificar" disabled={!registro.Activo} onClick={() => abrir(registro, "M")}><i className="fa-solid fa-pen" aria-hidden="true"></i></button>
                        <button className={`btn btn-sm ${registro.Activo ? "btn-outline-danger" : "btn-outline-success"}`} type="button" title={registro.Activo ? "Desactivar" : "Activar"} onClick={() => cambiarEstado(registro)}><i className={`fa-solid ${registro.Activo ? "fa-toggle-off" : "fa-toggle-on"}`} aria-hidden="true"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 bg-light p-2">
                <span className="pyBadge">Registros: {total}</span>
                <label className="d-flex align-items-center gap-2 mb-0">Página
                  <select className="form-select form-select-sm w-auto" value={pagina} onChange={(event) => buscar(event.target.value, termino, activo)}>
                    {paginas.map((numero) => <option value={numero} key={numero}>{numero}</option>)}
                  </select>
                  de {paginas.length}
                </label>
              </div>
            </div>
          ) : <div className="alert alert-info">No se encontraron registros.</div>}
        </>
      ) : (
        <form className="catalogo-form" onSubmit={guardar}>
          <fieldset disabled={accion === "C"}>
            <div className="row g-3">
              {config.campos.map((campo) => (
                <div className="col-md-6" key={campo.nombre}>
                  <label className="form-label" htmlFor={`campo-${campo.nombre}`}>{campo.etiqueta}</label>
                  <input id={`campo-${campo.nombre}`} className="form-control" name={campo.nombre} type={campo.tipo || "text"} defaultValue={item?.[campo.nombre] ?? ""} required maxLength={campo.maxLength} min={campo.min} max={campo.max} />
                </div>
              ))}
            </div>
          </fieldset>
          <div className="d-flex justify-content-center gap-2 mt-4">
            {accion !== "C" && <button className="btn btn-primary" type="submit"><i className="fa-solid fa-check me-2" aria-hidden="true"></i>Guardar</button>}
            <button className="btn btn-outline-secondary" type="button" onClick={() => setAccion("L")}>{accion === "C" ? "Volver" : "Cancelar"}</button>
          </div>
        </form>
      )}
    </section>
  );
}

export default Catalogo;
