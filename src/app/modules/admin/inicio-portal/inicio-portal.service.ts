import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InicioPortalService {
    // variables url
    private url: string = environment.url;
    private limit: any = environment.pagination;

    private _httpCliente = inject(HttpClient);

    // variables datos
    private _tipos_comisiones:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _comisiones: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _sesiones: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _audiencia: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _transcripcion: BehaviorSubject<any | null> = new BehaviorSubject(null);
    //-----------------------------------
    // Metodos set
    //-----------------------------------

    set sesiones(value: any) {
        this._sesiones.next(value);
    }

    set transcripcion(value: any) {
        this._transcripcion.next(value);
    }

    //-----------------------------------
    // Metodos get
    //-----------------------------------

    get tipos_comisiones$(): Observable<any | null> {
        return this._tipos_comisiones.asObservable();
    }

    get comisiones$(): Observable<any | null> {
        return this._comisiones.asObservable();
    }

    get sesiones$(): Observable<any | null> {
        return this._sesiones.asObservable();
    }

    get audiencia$(): Observable<any | null> {
        return this._audiencia.asObservable();
    }

    get transcripcion$(): Observable<any | null> {
        return this._transcripcion.asObservable();
    }

    //-----------------------------------
    // Metodos http
    //-----------------------------------

    getAllTiposComisiones(): Observable<any> {
        return this._httpCliente.get(`${this.url}tipos-comision/find-all`).pipe(
            tap((response: any) => {
                this._tipos_comisiones.next(response);
            })
        );
    }

    getComisionesPorTipo(id: string): Observable<any> {
        return this._httpCliente.get(`${this.url}comisiones/find-by-tipo-comision/${id}`).pipe(
            tap((response: any) => {
                this._tipos_comisiones.next(response);
            })
        );
    }

    //-----------------------------------
    // Metodos sesion
    //-----------------------------------
    getSesionesPorComision(id: string, page: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        let data = {
            filtroOrdenamiendo: {
                campo: 'nombre',
                direccion: 'ASC'
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

    getAudienciasPorSesionBusqueda(data:any, page:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);


        let filtroOrdenamiendo: {
            campo: 'nombre',
            direccion: 'ASC'
        }

        data.filtroOrdenamiendo = filtroOrdenamiendo;

        return this._httpCliente.post(`${this.url}comisiones/buscarEnUnaComision`, data, {params}).pipe(
            tap((response: any) => {
                this._sesiones.next(response);
            })
        );
    }

    getAudienciasPorSesionBusquedaPaginated(data:any, page:any): Observable<any> {
        console.log(page, data);
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpCliente.post(`${this.url}comisiones/buscarEnUnaComision`, data, {params});
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

}
