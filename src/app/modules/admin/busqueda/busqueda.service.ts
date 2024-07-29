import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

    // variables url
    private url: string = environment.url;
    private limit: any = environment.pagination;

    private _httpCliente = inject(HttpClient);

    // variables datos
    private _comisiones:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _sesiones: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _comisionesBusqueda: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _audiencia: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _transcripcion: BehaviorSubject<any | null> = new BehaviorSubject(null);
    //-----------------------------------
    // Metodos set
    //-----------------------------------

    set sesiones(data: any) {
        this._sesiones.next(data);
    }

    set comisionesBusqueda(data: any) {
        this._comisionesBusqueda.next(data);
    }

    set transcripcion(value: any) {
        this._transcripcion.next(value);
    }

    //-----------------------------------
    // Metodos get
    //-----------------------------------

    get comisiones$(): Observable<any | null> {
        return this._comisiones.asObservable();
    }

    get sesiones$(): Observable<any | null> {
        return this._sesiones.asObservable();
    }

    get comisionesBusqueda$(): Observable<any | null> {
        return this._comisionesBusqueda.asObservable();
    }

    get audiencia$(): Observable<any | null> {
        return this._audiencia.asObservable();
    }

    get transcripcion$(): Observable<any | null> {
        return this._transcripcion.asObservable();
    }

    //-----------------------------------
    // Metodos comisiones
    //-----------------------------------
    getAllComisiones(): Observable<any> {
        return this._httpCliente.get(`${this.url}comisiones`).pipe(
            tap((response: any) => {
                this._comisiones.next(response);
            })
        );
    }

    //-----------------------------------
    // Metodos busqueda
    //-----------------------------------
    getFromOneComision(data: any, page: any, fechas: any): Observable<any> {
        let params = new HttpParams();
        params = params.append('page', page);
        params = params.append('limit', this.limit);
        fechas.fechaInicio !== '' ? params = params.append('fechaInicio', fechas.fechaInicio) : '';
        fechas.fechaFin !== '' ? params = params.append('fechaFin', fechas.fechaFin): '';

        return this._httpCliente.post(`${this.url}comisiones/buscarEnUnaComision`, data, {params} );
    }

    getFromManyComision(data: any, page: any, fechas: any): Observable<any> {
        let params = new HttpParams();
        params = params.append('page', page);
        params = params.append('limit', this.limit);
        fechas.fechaInicio !== '' ? params = params.append('fechaInicio', fechas.fechaInicio) : '';
        fechas.fechaFin !== '' ? params = params.append('fechaFin', fechas.fechaFin): '';

        return this._httpCliente.post(`${this.url}comisiones/buscarEnTodasLasComisiones`, data, {params} );
    }

    //-----------------------------------
    // Metodos audiencia
    //-----------------------------------

    getDataAdienciaSesion(id: string): Observable<any> {
        return this._httpCliente.get(`${this.url}sesiones/byId/${id}`).pipe(
            tap((response: any) => {
                this._audiencia.next(response);
            })
        );
    }

    getTranscripcionAudiencia(id: string, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.get(`${this.url}sesiones/obtenerTranscripciones/${id}`, {params}).pipe(
            tap((response: any) => {
                this._transcripcion.next(response);
            })
        );
    }

    getTranscripcionAudienciaPaginated(id: string, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.get(`${this.url}sesiones/obtenerTranscripciones/${id}`, {params});
    }

    buscarEnAudiencia(id: any, data:any, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.post(`${this.url}sesiones/buscarEnUnaSesion/${id}`, data, {params}).pipe(
            tap((response: any) => {
                this._transcripcion.next(response);
            })
        );
    }

    buscarEnAudienciaPaginated(id: any, data:any, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.post(`${this.url}sesiones/buscarEnUnaSesion/${id}`, data, {params});
    }

    //-----------------------------------
    // Metodos comisiones
    //-----------------------------------

    //Sin parametro de busqueda
    getSesionesPorComision(id: string, page: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        let data = {
            filtroOrdenamiendo: {
                campo: 'fecha',
                direccion: 'DESC'
            }
        }

        return this._httpCliente.post(`${this.url}comisiones/getSesionesPorComision/${id}`, data, {params}).pipe(
            tap((response: any) => {
                this._sesiones.next(response);
            })
        );
    }

    getSesionesPorComisionPaginated(id: string, page: any, data:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.post(`${this.url}comisiones/getSesionesPorComision/${id}`, data, {params});
    }

    //Con parametro de busqueda

    getAudienciasPorSesionBusqueda(data:any, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit)

        return this._httpCliente.post(`${this.url}comisiones/buscarEnUnaComision`, data, {params}).pipe(
            tap((response: any) => {
                this._sesiones.next(response);
            })
        );
    }

    getAudienciasPorSesionBusquedaPaginated(data:any, page:any): Observable<any> {
        // console.log(page, data);
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.post(`${this.url}comisiones/buscarEnUnaComision`, data, {params});
    }
}
