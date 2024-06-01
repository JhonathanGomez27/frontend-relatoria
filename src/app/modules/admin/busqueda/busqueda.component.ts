import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './busqueda.component.html'
})
export class BusquedaComponent {
    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle('Relatoría | Busqueda');
    }
}
