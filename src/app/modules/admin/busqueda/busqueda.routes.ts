import { Routes } from "@angular/router";
import { BusquedaComponent } from "./busqueda.component";
import { getAllComisionesBusqueda, getAudienciaBusquedaResolver, getTranscripcionAudienciaBusqueda } from "./busqueda.resolver";
import { VerAudienciaBusquedaComponent } from "./ver-audiencia-busqueda/ver-audiencia-busqueda.component";

export default [
    {
        path: '',
        component: BusquedaComponent,
        resolve: {
            data: getAllComisionesBusqueda
        }
    },
    {
        path: 'sesion/:audiencia',
        component: VerAudienciaBusquedaComponent,
        resolve: {
            audiencia: getAudienciaBusquedaResolver,
            transcripcion: getTranscripcionAudienciaBusqueda
        }
    }
] as Routes;
