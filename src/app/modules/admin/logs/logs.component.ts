import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.component.html'
})
export class LogsComponent {
    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle('Relatoría | Monitoreo Logs');
    }
}
