import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseValidators } from '@fuse/validators';

@Component({
    selector: 'app-usuario-modal',
    templateUrl: './usuario-modal.component.html',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule]
})
export class UsuarioModalComponent implements OnInit {

    title: string = '';
    usuarioForm: FormGroup;

    comisiones: any[] = [
        { value: '1', viewValue: 'Comisión 1' },
        { value: '2', viewValue: 'Comisión 2' },
        { value: '3', viewValue: 'Comisión 3' },
    ];

    showData: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UsuarioModalComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.title = this.data.title;

        this.usuarioForm = this._formBuilder.group({
                nombre: ['', Validators.required],
                apellido: ['', Validators.required],
                correo: ['', [Validators.required, Validators.email]],
                comision: ['', Validators.required],
                rol: ['', Validators.required],
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },{
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            },
        );
    }

    cerrarDialogo() {
        this.dialogRef.close();
    }

    guardarUsuario() {
        this.dialogRef.close('guardar');
    }
}
