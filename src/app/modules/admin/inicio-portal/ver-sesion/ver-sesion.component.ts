import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DateAdapter, MAT_DATE_LOCALE, MatRippleModule,} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, debounceTime, map, takeUntil } from 'rxjs';
import { MatCheckboxChange, MatCheckboxModule,} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators,} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink, RouterOutlet,} from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InicioPortalService } from '../inicio-portal.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-ver-sesion',
    templateUrl: 'ver-sesion.component.html',
    standalone: true,
    imports: [CommonModule, MatSidenavModule, MatRippleModule, NgClass, MatIconModule, NgIf, NgFor, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, FormsModule, MatDatepickerModule, MatSelectModule, TitleCasePipe, MatMenuModule, MatPaginatorModule, RouterOutlet, RouterLink, ReactiveFormsModule, MatProgressSpinnerModule,],
    encapsulation: ViewEncapsulation.None,
})

export class VerSesionComponent implements OnInit, OnDestroy {

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    debounce: number = 1500;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    totalResultados: number = 0;
    buscar: boolean = false;

    //search bar
    searchControl: UntypedFormControl = new UntypedFormControl('');

    resultados: any = [];
    comision: any = {};

    //pagination variables
    page: number = 0;
    limit: number = environment.pagination;

    initial: string = 'init';

    sortFilter: string = 'Alfabeticamente: Ascendente';
    criterio: string = 'nombre';
    orden: string = 'ASC';

    constructor(
        private titleService: Title,
        private location: Location,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _adapter: DateAdapter<any>,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _inicioPortalService: InicioPortalService
    ) {
        this.titleService.setTitle('Relatoría | Comision');
    }

    ngOnInit(): void {

        this._inicioPortalService.sesiones$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.resultados = response.resultados;
            this.totalResultados = response.total;
            this.comision = response.comision;

            this._changeDetectorRef.markForCheck();
        });

        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 0;
            }else{
                this.page = parseInt(params.page) - 1;
            }

            if (params.busqueda && this.initial === 'init') {
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: params.busqueda }});
                this.searchControl.setValue(params.busqueda);
            }

            // if(this.initial === 'init'){
            //     this.aplicarFiltro(0);
            // }
        });

        this.initial = 'fin';

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            ({matchingAliases}) =>{
                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if ( matchingAliases.includes('md') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        );

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value !== '') {
                // this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: value }, queryParamsHandling: 'merge'});
                if (!this.buscar) {
                    this.aplicarFiltro(0);
                }
                // console.log("object");
                this._changeDetectorRef.markForCheck();
            } else {
                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: { busqueda: null },
                    queryParamsHandling: 'merge',
                });

                if(!this.buscar){
                    this.aplicarFiltro(0);
                }

                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // Metodo filtrar
    //-----------------------------------

    aplicarFiltro(page:any): void{
        console.log("entra");
        this.buscar = true;
        this.page = page;

        let claveBusqueda = this.searchControl.value || '';
        let pagina = page + 1;

        if(claveBusqueda === ''){
            if(this.initial === 'fin'){
                this.obtenerSesionesPaginated(pagina);
            }else{
                this.buscar = false;
            }
        }else{
            let data = {
                palabraClave: claveBusqueda,
                comisionId: this.comision.id,
            }

            this.obtenerSesionesBusqueda(pagina, data);
        }
    }

    obtenerSesionesBusqueda(pagina:any, data:any): void {
        let  filtroOrdenamiendo = {
            campo: this.criterio,
            direccion: this.orden
        }

        data.filtroOrdenamiendo = filtroOrdenamiendo;

        this._inicioPortalService.getAudienciasPorSesionBusqueda(data, pagina).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._inicioPortalService.sesiones = response;

                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: data.palabraClave }, queryParamsHandling: 'merge'});

                this.buscar = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.buscar = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    obtenerSesionesPaginated(pagina:any): void {
        let data = {
            filtroOrdenamiendo: {
                campo: this.criterio,
                direccion: this.orden
            }
        }
        this._inicioPortalService.getSesionesPorComisionPaginated(this.comision.id, pagina, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._inicioPortalService.sesiones = response;

                this.buscar = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.buscar = false;
                this._changeDetectorRef.markForCheck();
            }
        );

    }

    //-----------------------------------
    // Sort methods
    //-----------------------------------
    sortByOnChange(sort: any, criterio: string, orden: string){
        if(this.buscar){
            return;
        }

        this.sortFilter = sort;
        this.criterio = criterio;
        this.orden = orden;

        this.aplicarFiltro(0);
    }

    //-----------------------------------
    // Pagination
    //-----------------------------------
    handlePageEnvent(event: PageEvent): void {
        this.aplicarFiltro(event.pageIndex);
    }
}
