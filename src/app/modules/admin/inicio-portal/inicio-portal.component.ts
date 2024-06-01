import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio-portal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './inicio-portal.component.html'
})
export class InicioPortalComponent {

    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle('Relatoría | Inicio Portal');
    }

}
