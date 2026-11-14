import { config } from "../config";
import httpServiceVulnerable from "./http.serviceVulnerable";

const urlResource = config.urlResourceEquipos;

async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpServiceVulnerable.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp;
}

async function BuscarPorId(item) {
  const resp = await httpServiceVulnerable.get(`${urlResource}/${item.IdEquipo}`);
  return resp;
}

async function ActivarDesactivar(item) {
  await httpServiceVulnerable.delete(`${urlResource}/${item.IdEquipo}`);
}

async function Grabar(item) {
  if (item.IdEquipo === 0) {
    await httpServiceVulnerable.post(urlResource, item);
  } else {
    await httpServiceVulnerable.put(`${urlResource}/${item.IdEquipo}`, item);
  }
}

export const equiposService = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
};
