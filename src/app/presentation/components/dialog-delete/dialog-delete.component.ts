import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { DialogDeleteModel } from './view-models/dialog-delete.model';

@Component({
  selector: 'dialog-delete-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatDialogModule],
  providers: [],
  templateUrl: './dialog-delete.component.html',
})
export class DialogDeleteComponent {
  readonly props: DialogDeleteModel = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DialogDeleteComponent>);

  closeDialog(value?: any): void {
    this.dialogRef.close(value);
  }
}
