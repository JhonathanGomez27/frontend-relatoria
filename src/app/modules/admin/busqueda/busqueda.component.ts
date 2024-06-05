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
import { BusquedaService } from './busqueda.service';
import { ShowForRolesDirective } from 'app/core/directives/show-for-roles.directive';
import { environment } from 'environments/environment';
import { filter } from 'lodash';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'app-busqueda',
    standalone: true,
    imports: [ CommonModule, MatSidenavModule, MatRippleModule, NgClass, MatIconModule, NgIf, NgFor, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, FormsModule, MatDatepickerModule, MatSelectModule, TitleCasePipe, MatMenuModule, MatPaginatorModule, RouterOutlet, RouterLink, ReactiveFormsModule, MatProgressSpinnerModule, ShowForRolesDirective],
    templateUrl: './busqueda.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class BusquedaComponent implements OnInit, OnDestroy {
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    debounce: number = 1500;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    totalResultados: number = 0;
    buscar: boolean = false;

    //search bar
    searchControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;

    resultados: any = [];

    //pagination variables
    page: number = 0;
    limit: number = environment.pagination;

    initial: string = 'init';

    comisiones: any = [];
    totalComisiones: number = 0;

    comisionesBusqueda: any = [];

    userRol: any = '';

    tipoBusqueda:string = 'all';

    constructor(
        private titleService: Title,
        private location: Location,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _adapter: DateAdapter<any>,
        private _formBuilder: UntypedFormBuilder,
        private _busquedaService: BusquedaService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _userService: UserService
    ) {
        this._adapter.setLocale('es');
        this.titleService.setTitle('Relatoría | Busqueda');

        // Initialize the form
        this.filterForm = this._formBuilder.group({
            comision: [''],
            // representante: [null],
            fechaInicio: [null],
            fechaFin: [null],
        });
    }

    ngOnInit(): void {
        // Get user rol
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: any) => {
            if (user) {
                this.userRol = user.rol;
            }
        });

        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 0;
            }else{
                this.page = parseInt(params.page) - 1;
            }

            if(params.busqueda && this.initial === 'init'){
                this.searchControl.setValue(params.busqueda);
            }

            if(params.comision){
                this.filterForm.controls['comision'].setValue(params.comision);
            }

            if(this.initial === 'init' && params.busqueda){
                this.aplicarFiltro(0);
            }

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

        this._busquedaService.comisiones$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.comisiones = response.data;
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value !== '') {
                // this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: value }, queryParamsHandling: 'merge'});
                if (!this.buscar) {
                    this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: 1 }, queryParamsHandling: 'merge'});
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
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // Metodos filtro
    //-----------------------------------
    aplicarFiltro(page: any): void {
        this.buscar = true;
        this.page = page;

        let pagina = this.page + 1;
        let filterForm = this.filterForm.getRawValue();

        for (const [key, value] of Object.entries(filterForm)) {
            if(value === '' || value === null){
                delete filterForm[key];
            }
        }

        let data = {
            palabraClave: this.searchControl.value || '',
            comisionId: filterForm.comision || '',
        }

        let fechas = {
            fechaInicio: filterForm.fechaInicio ? this.transformDate(filterForm.fechaInicio._d) : '',
            fechaFin: filterForm.fechaFin ? this.transformDate(filterForm.fechaFin._d) : '',
        }

        if(this.userRol === 'admin' && data.comisionId === ''){
            this.filtroPaginatedAllComision(pagina, data, fechas);
        }

        if(this.userRol === 'admin' && data.comisionId !== ''){
            this.filtroPaginatedOneComision(pagina, data, fechas);
        }

        if(this.userRol !== 'admin'){
            this.filtroPaginatedOneComision(pagina, data, fechas);
        }
    }

    filtroPaginatedOneComision(page: any, data:any, fechas:any): void {
        this._busquedaService.getFromOneComision(data, page, fechas).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.tipoBusqueda = 'one';
            this.comisionesBusqueda = [];
            this.resultados = response.resultados || [];

            this.totalResultados = response.total || 0;
            this.totalComisiones = response.totalComisiones || 0;
            this.buscar = false;

            this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: data.palabraClave }, queryParamsHandling: 'merge'});
            this._changeDetectorRef.markForCheck();
        });
    }

    filtroPaginatedAllComision(page: any, data:any, fechas:any): void {
        this._busquedaService.getFromManyComision(data, page, fechas).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.tipoBusqueda = 'all';
            this.comisionesBusqueda = response.comisiones || [];
            this.resultados = response.resultados || [];

            this.totalComisiones = response.totalComisiones || 0;
            this.totalResultados = response.total || 0;
            this.buscar = false;

            this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: data.palabraClave }, queryParamsHandling: 'merge'});
            this._changeDetectorRef.markForCheck();
        });
    }

    //-----------------------------------
    // query params
    //-----------------------------------
    setQueryParam(key: string, value: any): void {

        value === '' ? value = null : value;

        this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { [key]: value }, queryParamsHandling: 'merge'});

        this._changeDetectorRef.markForCheck();
    }

    //-----------------------------------
    // Pagination
    //-----------------------------------
    handlePageChangeEvent(event: PageEvent): void {
        this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: event.pageIndex }, queryParamsHandling: 'merge'});
        this.aplicarFiltro(event.pageIndex);
    }

    //-----------------------------------
    // Metodos adicionales
    //-----------------------------------
    transformDate(date: any): any {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
}
