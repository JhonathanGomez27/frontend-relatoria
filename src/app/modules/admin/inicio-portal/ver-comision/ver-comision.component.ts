import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ver-comision',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './ver-comision.component.html',
})
export class VerComisionComponent {

    titles: any = {
        general: 'Plenarias del salón elíptico',
        legales: 'Comisiones legales',
        constitucionales: 'Comisiones constitucionales',
        especiales: 'Comisiones especiales',
    };

    title: string = '';

    constructor(
        private titleService: Title,
        private _activatedRoute: ActivatedRoute
    ) {
        this._activatedRoute.params.subscribe(params => {
            this.title = this.titles[params['comision']];
            this.titleService.setTitle(`Relatoría | ${this.title}`);
        });
    }
}
