import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { InicioPortalService } from "./inicio-portal.service";

export const getTiposComisionesResolver: ResolveFn<any> = () => {
    return inject(InicioPortalService).getAllTiposComisiones();
}

export const getComisionesPorTipoResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
    let id = route.paramMap.get('comision');
    return inject(InicioPortalService).getComisionesPorTipo(id);
}

export const getSesionesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
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
        return inject(InicioPortalService).getAudienciasPorSesionBusqueda({palabraClave: claveBusqueda, comisionId: comision, filtroOrdenamiendo}, page);
    }

    return inject(InicioPortalService).getSesionesPorComision(comision, page);
}

export const getAudienciaResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let id = route.paramMap.get('audiencia');
    return inject(InicioPortalService).getDataAdienciaSesion(id);
}

export const getTranscripcionAudiencia: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let id = route.paramMap.get('audiencia') || '';
    let palabraClave = route.queryParamMap.get('busqueda') || '';

    if(palabraClave !== ''){
        return inject(InicioPortalService).buscarEnAudiencia(id, {palabraClave: palabraClave}, '1');
    }

    return inject(InicioPortalService).getTranscripcionAudiencia(id, '1');
}
