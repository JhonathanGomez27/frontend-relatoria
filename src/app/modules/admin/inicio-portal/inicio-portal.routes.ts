import { Routes } from "@angular/router";
import { InicioPortalComponent } from "./inicio-portal.component";
import { VerComisionComponent } from "./ver-comision/ver-comision.component";
import { VerSesionComponent } from "./ver-sesion/ver-sesion.component";
import { getTiposComisionesResolver, getComisionesPorTipoResolver, getSesionesResolver, getAudienciaResolver, getTranscripcionAudiencia } from "./incio-portal.resolver";
import { VerAudienciaSesionComponent } from "./ver-audiencia-sesion/ver-audiencia-sesion.component";

export default [
    {
        path: '',
        component: InicioPortalComponent,
        resolve:{
            tipos_comisiones: getTiposComisionesResolver
        }
    },
    {
        path:':comision',
        component: VerComisionComponent,
        resolve:{
            comisiones: getComisionesPorTipoResolver
        }
    },
    {
        path:':comision/:id',
        component: VerSesionComponent,
        resolve:{
            sesiones: getSesionesResolver
        }
    },
    {
        path:':comision/:id/:audiencia',
        component: VerAudienciaSesionComponent,
        resolve:{
            audiencia: getAudienciaResolver,
            transcripcion: getTranscripcionAudiencia
        }
    }
] as Routes;
