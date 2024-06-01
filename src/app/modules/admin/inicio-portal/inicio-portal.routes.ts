import { Routes } from "@angular/router";
import { InicioPortalComponent } from "./inicio-portal.component";
import { VerComisionComponent } from "./ver-comision/ver-comision.component";

export default [
    {
        path: '',
        component: InicioPortalComponent
    },
    {
        path:':comision',
        component: VerComisionComponent
    }
] as Routes;
