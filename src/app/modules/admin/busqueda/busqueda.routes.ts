import { Routes } from "@angular/router";
import { BusquedaComponent } from "./busqueda.component";
import { getAllComisionesBusqueda, getAudienciaBusquedaResolver, getComisionesBusquedaResolver, getTranscripcionAudienciaBusqueda } from "./busqueda.resolver";
import { VerAudienciaBusquedaComponent } from "./ver-audiencia-busqueda/ver-audiencia-busqueda.component";
import { VerComisionBusquedaComponent } from "./ver-comision-busqueda/ver-comision-busqueda.component";

export default [
    {
        path: '',
        component: BusquedaComponent,
        resolve: {
            data: getAllComisionesBusqueda
        }
    },
    {
        path: 'comision/:id',
        component: VerComisionBusquedaComponent,
        resolve: {
            data: getComisionesBusquedaResolver
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
