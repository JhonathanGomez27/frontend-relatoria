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


export const getComisionesBusquedaResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let comision = ''
    let page:any = '1';
    let claveBusqueda = '';

    if(route.paramMap.has('id')){
        comision = route.paramMap.get('id');
    }

    if(route.queryParamMap.has('page')){
       page = route.queryParamMap.get('page');
    }

    if(route.queryParamMap.has('busqueda')){
        claveBusqueda = route.queryParamMap.get('busqueda') || '';
    }

    const filtroOrdenamiendo = {
        campo: 'fecha',
        direccion: 'DESC'
    }

    if(claveBusqueda !== ''){
        return inject(BusquedaService).getAudienciasPorSesionBusqueda({palabraClave: claveBusqueda, comisionId: comision, filtroOrdenamiendo}, page);
    }

    return inject(BusquedaService).getSesionesPorComision(comision, page);
}
