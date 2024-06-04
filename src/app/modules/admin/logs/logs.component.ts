import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatTableModule],
  templateUrl: './logs.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LogsComponent {

    displayedColumns: string[] = ['tipo_ingreso', 'descripcion', 'usuario', 'fecha'];
    dataSource = new MatTableDataSource<any>([
        { tipo_ingreso: 'Ingreso', descripcion: 'Se ha ingresado al sistema', usuario: 'admin', fecha: '2021-09-01 12:00:00' },
    ]);

    //search bar
    searchControl: UntypedFormControl = new UntypedFormControl();
    diasControl: UntypedFormControl = new UntypedFormControl();

    loading: boolean = false;

    constructor(
        private titleService: Title,
    ) {
        this.titleService.setTitle('Relatoría | Monitoreo Logs');
    }
}
