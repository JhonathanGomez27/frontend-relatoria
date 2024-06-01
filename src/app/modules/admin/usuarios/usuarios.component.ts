import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from './modals/usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, AfterViewInit{

    displayedColumns: string[] = ['id', 'nombre', 'rol', 'correo', 'online', 'acciones'];
    dataSource = new MatTableDataSource<any>([
        { id: 1, nombre: 'Juan Perez', rol: 'Administrador', correo: 'admin@admin.com', online: true },
        { id: 2, nombre: 'Juan Perez', rol: 'Administrador', correo: 'admin@admin.com', online: false },
    ]);

    totalUsuarios: number = 2;
    page: number = 0;

    limit: any = environment.pagination;

    constructor(
        private titleService: Title,
        public dialog: MatDialog
    ) {
        this.titleService.setTitle('Relatoría | Usuarios');
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        // this.abrirDialogoCrearUsuario();

    }

    //-----------------------------------
    // Pagination
    //-----------------------------------
    handlePageEvent(event: any) {
        console.log(event);
    }

    //-----------------------------------
    // Dialog
    //-----------------------------------
    abrirDialogoCrearUsuario() {
        const dialogRef = this.dialog.open(UsuarioModalComponent, {
            // disableClose: true,
            width: '500px',
            data: { action: 'create', title: 'Crear usuario' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
}
