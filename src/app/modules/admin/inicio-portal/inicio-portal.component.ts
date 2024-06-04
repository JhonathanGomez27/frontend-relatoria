import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { InicioPortalService } from './inicio-portal.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inicio-portal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './inicio-portal.component.html'
})
export class InicioPortalComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    tipos_comisiones: any[] = [];

    constructor(
        private titleService: Title,
        private inicioPortalService: InicioPortalService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.titleService.setTitle('Relatoría | Inicio Portal');
    }

    ngOnInit() {
        this.inicioPortalService.tipos_comisiones$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.tipos_comisiones = response.data;
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
