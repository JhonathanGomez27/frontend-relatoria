import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { BusquedaService } from "./busqueda.service";
import { inject } from "@angular/core";

export const getAllComisionesBusqueda: ResolveFn<any> = () => {
    return inject(BusquedaService).getAllComisiones();
}


export const getAudienciaBusquedaResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let id = route.paramMap.get('audiencia');
    return inject(BusquedaService).getDataAdienciaSesion(id);
}

export const getTranscripcionAudienciaBusqueda: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let id = route.paramMap.get('audiencia') || '';
    let palabraClave = route.queryParamMap.get('busqueda') || '';

    if(palabraClave !== ''){
        return inject(BusquedaService).buscarEnAudiencia(id, {palabraClave: palabraClave}, '1');
    }

    return inject(BusquedaService).getTranscripcionAudiencia(id, '1');
}
