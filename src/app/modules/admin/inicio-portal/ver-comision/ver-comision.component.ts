import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { InicioPortalService } from '../inicio-portal.service';

@Component({
  selector: 'app-ver-comision',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './ver-comision.component.html',
})
export class VerComisionComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    titles: any = {
        general: 'Plenarias del salón elíptico',
        legales: 'Comisiones legales',
        constitucionales: 'Comisiones constitucionales',
        especiales: 'Comisiones especiales',
    };

    title: string = '';

    tipo_comision: any = {};

    comisiones: any = [];

    constructor(
        private titleService: Title,
        private _activatedRoute: ActivatedRoute,
        private _inicioPortalService: InicioPortalService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this._inicioPortalService.tipos_comisiones$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.tipo_comision = response.tipoComision;
            this.comisiones = response.data;

            this._changeDetectorRef.markForCheck();
        });

        this.title = this.tipo_comision.title;
        this.titleService.setTitle(`Relatoría | ${this.title}`);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
