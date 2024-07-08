import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Observable, Subject, catchError, debounceTime, map, of, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { SanitizedHtmlPipe } from 'app/shared/pipes/sanitizedPipe.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusquedaService } from '../busqueda.service';

@Component({
  selector: 'app-ver-audiencia-busqueda',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, SanitizedHtmlPipe, TitleCasePipe, MatTooltipModule],
  templateUrl: './ver-audiencia-busqueda.component.html',
})
export class VerAudienciaBusquedaComponent {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('videoPlayer', {static: true}) videoPlayer: ElementRef;

    myScriptElement: HTMLVideoElement;

    comision: any = {};

    //pagination
    audiencia: any = {};
    subtitulos: any[] = [];
    subtituloActual: string = '';

    totalResponse: number = 0;
    page: number = 0;
    totalPages: number = 0;
    disableSubtitulos: boolean = false;

    //search bar
    searchControl: UntypedFormControl = new UntypedFormControl();
    debounce: number = 1500;
    loading: boolean = false;

    initital: string = 'init';

    videoUrl: any = '';
    audioUrl: any = '';

    limit: any = environment.pagination;

    //params routes
    params: any = {};

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _busquedaService: BusquedaService,
    ){
        this.activatedRoute.params.subscribe(params => {
            this.params = params;
        });
    }

    ngOnInit(): void {
        this.myScriptElement = this.videoPlayer.nativeElement;
        // this.myScriptElement = document.getElementById("myVideo") as HTMLMediaElement;

        this.activatedRoute.queryParams.subscribe(params => {
            if(params.busqueda && this.initital === 'init'){
                this.searchControl.setValue(params.busqueda);

            }
            this.initital = 'fin';
            this._changeDetectorRef.markForCheck();
        });

        this._busquedaService.audiencia$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.audiencia = response.sesion;
            this.comision = response.sesion.comision;

            this.videoUrl = `./video/${this.audiencia.rutaVideo}`;
            this.audioUrl = `./audio/${this.audiencia.rutaAudio}`;
            this._changeDetectorRef.markForCheck();
        });

        this._busquedaService.transcripcion$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.subtitulos = response?.transcripciones || response?.resultados || [];
            this.totalResponse = response?.total || 0;

            let paginas = Math.ceil(this.totalResponse / this.limit);
            this.totalPages = paginas;

            if(this.subtitulos.length){
                this.setCurTime(this.subtitulos[0].minuto);
            }

            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce),takeUntil(this._unsubscribeAll)).subscribe((value) =>
            {
                if(value !== ''){

                    this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: value }, queryParamsHandling: 'merge'});
                    if(!this.loading ){
                        this.subtituloActual = '';
                        this.myScriptElement.pause();

                        this.aplicarFiltroBusqueda(0);
                    }
                    this._changeDetectorRef.markForCheck();
                }else{
                    this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: null }, queryParamsHandling: 'merge'});
                    this.aplicarFiltroBusqueda(0);
                    this._changeDetectorRef.markForCheck();
                }
        });
    }

    ngAfterViewInit(): void {
        // this.videoPlayer.nativeElement.play();
        this.myScriptElement.ontimeupdate  = () => {
            this.checkSubtitles();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // Methods filtros
    //-----------------------------------

    aplicarFiltroBusqueda(pagina: any): void {
        this.loading = true;
        this.page = pagina;
        let pag = pagina + 1;

        let palabraClave = this.searchControl.value || '';

        if(palabraClave !== ''){
            let data = {
                palabraClave: palabraClave
            }

            this.getTranscripcionBusqueda(pag, data);
        }else{
            this.getTranscripcionPaginated(pag);
        }
    }

    getTranscripcionPaginated(pagina: any): void {
        this._busquedaService.getTranscripcionAudienciaPaginated(this.audiencia.clavePrincipal, pagina).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._busquedaService.transcripcion = response;

                this.loading = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    getTranscripcionBusqueda(pagina: any, data: any): void {
        this._busquedaService.buscarEnAudienciaPaginated(this.audiencia.clavePrincipal, data, pagina).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._busquedaService.transcripcion = response;

                this.loading = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    //-----------------------------------
    // Video methods
    //-----------------------------------

    setCurTime(time: string){
        const minutos = parseInt(time)*60;

        this.myScriptElement.currentTime = minutos;
        this.myScriptElement.play();
        this.myScriptElement.muted = false;
    }

    checkSubtitles(): void {
        // console.log("object");

        if(this.subtitulos.length === 0){
            return;
        }

        if(this.loading){
            return;
        }

        let lastSub = this.subtitulos[this.subtitulos.length - 1].minuto;
        const minuto = (parseInt(lastSub) * 60) + 60;

        if(this.myScriptElement.currentTime > minuto){
            if(this.page + 2 > this.totalPages){
                return;
            }

            this.myScriptElement.pause();

            this.aplicarFiltroBusqueda(this.page + 1);

            this._changeDetectorRef.markForCheck();
            return;
        }

        let temp = this.subtituloActual;

        this.subtitulos.some((element: any, index: any) => {
            const elementMinuto = parseInt(element.minuto) * 60;
            let siguiente = elementMinuto + 60;
            if(elementMinuto < this.myScriptElement.currentTime && siguiente > this.myScriptElement.currentTime){
                if(temp !== element.clavePrincipal){
                    this.subtituloActual = element.clavePrincipal;
                    this._changeDetectorRef.markForCheck();
                    return true;
                }
            }
        })
    }

    transformarData(value: any): any {
        if(this.searchControl.value === ''){
            return value;
        }
        const searchValue = this.searchControl.value;
        const regEx = new RegExp(searchValue, "ig");
        const temp =  value.replace(regEx, `<strong class="font-bold text-primary">${searchValue}</strong>`);
        return temp;
    }

    //-----------------------------------
    // Pagination methods
    //-----------------------------------
    handlePageEnvent(event: PageEvent): void {
        this.aplicarFiltroBusqueda(event.pageIndex);
    }

    //-----------------------------------
    // Metedos descargas
    //-----------------------------------

    descargarArchivoXml(): void {
        const archivXML = this.audiencia.rutaXML;
        const ruta = `./xml/${archivXML}`;
        const a = document.createElement('a');
        a.href = ruta;
        a.download = archivXML;
        a.click();
    }

    descargarArchivoAudio(): void {
        const archivAudio = this.audiencia.rutaAudio;
        const ruta = `./audio/${archivAudio}`;
        const a = document.createElement('a');
        a.href = ruta;
        a.download = archivAudio;
        a.click();
    }

    descargarArchivoPdf(): void {
        const archivPdf = this.audiencia.rutaPDF;
        const ruta = `./pdf/${archivPdf}`;
        const a = document.createElement('a');
        a.href = ruta;
        a.download = archivPdf;
        a.click();
    }

    descargarArchivoWord(): void {
        const archivWord = this.audiencia.rutaDoc;
        const ruta = `./word/${archivWord}`;
        const a = document.createElement('a');
        a.href = ruta;
        a.download = archivWord;
        a.click();
    }
}
