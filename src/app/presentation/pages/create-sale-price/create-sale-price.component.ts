import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import AssignSalePriceProductUseCase from '../../../application/use-cases/assign-sale-price-product.use-case';
import ProductRepositoryApi from '../../../infra/repositories/product-api.repository';
import NumberMaskConverterUtils from '../../../shared/utils/number-mask-converter.utils';
import { InputComponent } from '../../components/input/input.component';
import { SelectInputComponent } from '../../components/select-input/select-input.component';
import { SelectOptionModel } from '../../components/select-input/view-models/select-option.model';
import { DialogCreateSalePriceModel } from './view-models/dialog-create-sale-price.model';

@Component({
  selector: 'page-create-sale-price',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    MatDialogModule,
    SelectInputComponent,
  ],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryApi,
    },
    AssignSalePriceProductUseCase,
  ],
  templateUrl: './create-sale-price.component.html',
})
export class CreateSalePriceComponent implements OnInit {
  private readonly data: DialogCreateSalePriceModel = inject(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<CreateSalePriceComponent> =
    inject(MatDialogRef);

  private readonly assignSalePriceUseCase = inject(
    AssignSalePriceProductUseCase,
  );

  private readonly formBuilderService = inject(FormBuilder);
  private readonly toastService = inject(ToastrService);

  salePriceForm = this.formBuilderService.group({
    salePrice: this.formBuilderService.nonNullable.control<number>(0, {
      validators: [Validators.min(1), Validators.maxLength(16)],
    }),
    supermarketId: this.formBuilderService.control(null, {
      validators: [Validators.required],
    }),
  });

  getFormControl(value: 'salePrice' | 'supermarketId'): FormControl {
    return this.salePriceForm.controls[value];
  }

  supermarketOptions: SelectOptionModel<number>[] = [];

  ngOnInit(): void {
    this.supermarketOptions = this.data.supermarketOptions;
  }

  closeDialog(value?: any): void {
    this.dialogRef.close(value);
  }

  async submitSalePriceForm(): Promise<void> {
    this.salePriceForm.markAsTouched();

    if (!this.salePriceForm.valid) {
      return;
    }

    const response = await this.assignSalePriceUseCase.execute({
      productId: this.data.productId,
      supermarketId: Number(this.getFormControl('supermarketId').value),
      salePrice: NumberMaskConverterUtils.convertMaskToNumber(
        this.salePriceForm.value.salePrice,
      ),
    });

    if (response.isLeft()) {
      this.closeDialog();
      this.toastService.error(response.value.message);
      return;
    }

    this.closeDialog(true);
    this.toastService.success('Preço de venda vinculado a produto.');
  }
}
