import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import CreateProductUseCase from '../../../application/use-cases/create-product.use-case';
import DeleteProductUseCase from '../../../application/use-cases/delete-product.use-case';
import DeleteSalePriceUseCase from '../../../application/use-cases/delete-sale-price.use-case';
import FindSupermarketsUseCase from '../../../application/use-cases/find-supermarkets.use-case';
import GetProductUseCase from '../../../application/use-cases/get-product.use-case';
import UpdateProductUseCase from '../../../application/use-cases/update-product.use-case';
import Product from '../../../domain/entities/product';
import SalePrice from '../../../domain/entities/sale-price';
import Supermarket from '../../../domain/entities/supermarket';
import ProductRepositoryApi from '../../../infra/repositories/product-api.repository';
import SupermarketRepositoryApi from '../../../infra/repositories/supermarket-api.repository';
import ImageConverterUtils from '../../../shared/utils/image-converter.utils';
import NumberMaskConverterUtils from '../../../shared/utils/number-mask-converter.utils';
import { DialogDeleteComponent } from '../../components/dialog-delete/dialog-delete.component';
import { InputComponent } from '../../components/input/input.component';
import { LoadingScreenComponent } from '../../components/loading-screen/loading-screen.component';
import { SelectInputComponent } from '../../components/select-input/select-input.component';
import { SelectOptionModel } from '../../components/select-input/view-models/select-option.model';
import { TableItemModel } from '../../components/table/view-models/table-item.model';
import { CreateSalePriceComponent } from '../create-sale-price/create-sale-price.component';

@Component({
  selector: 'page-create-product',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    MatDialogModule,
    CreateSalePriceComponent,
    SelectInputComponent,
    LoadingScreenComponent,
  ],
  providers: [
    {
      provide: 'SupermarketRepository',
      useClass: SupermarketRepositoryApi,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryApi,
    },
    CreateProductUseCase,
    GetProductUseCase,
    FindSupermarketsUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    DeleteSalePriceUseCase,
  ],
  templateUrl: './create-product.component.html',
})
export class CreateProductComponent implements OnInit {
  private readonly createProductUseCase = inject(CreateProductUseCase);
  private readonly getProductUseCase = inject(GetProductUseCase);
  private readonly findSupermarketsUseCase = inject(FindSupermarketsUseCase);
  private readonly deleteProductUseCase = inject(DeleteProductUseCase);
  private readonly deleteSalePriceUseCase = inject(DeleteSalePriceUseCase);
  private readonly updateProductUseCase = inject(UpdateProductUseCase);

  private readonly formBuilderService = inject(FormBuilder);
  private readonly toastService = inject(ToastrService);

  private readonly dialogService = inject(MatDialog);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  productForm = this.formBuilderService.group({
    productId: this.formBuilderService.control({ value: '', disabled: true }),
    description: this.formBuilderService.nonNullable.control('', {
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    cost: this.formBuilderService.control(null, {
      validators: [Validators.maxLength(16)],
    }),
    image: this.formBuilderService.control(''),
  });

  getFormControl(value: 'cost' | 'description' | 'productId'): FormControl {
    return this.productForm.controls[value];
  }

  isLoading: boolean = false;
  productIdParam?: number;
  product?: Product;
  salesPrices: SalePrice[] = [];
  supermarkets: Supermarket[] = [];
  image?: File;

  get supermarketsOptions(): SelectOptionModel<number>[] {
    return this.supermarkets.map((supermarket) => {
      return {
        value: supermarket.id,
        label: supermarket.fullDescription,
      };
    });
  }

  salePriceRows: TableItemModel<SalePrice>[] = [];

  constructor() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const productId = queryParams['id'];
      if (!productId) {
        return;
      }

      this.productIdParam = productId;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadScreen();
  }

  async loadScreen() {
    try {
      this.isLoading = true;

      if (this.productIdParam) {
        await this.loadProduct();
      }

      await this.loadSupermarkets();
    } finally {
      this.isLoading = false;
    }
  }

  async loadProduct(): Promise<void> {
    const response = await this.getProductUseCase.execute({
      productId: this.productIdParam!,
    });

    if (response.isLeft()) {
      this.router.navigate(['/produto']);
      this.toastService.error(response.value.message);
      return;
    }

    this.salesPrices = response.value.salesPrices;
    this.onSuccessLoadProduct(response.value.product);
  }

  async loadSupermarkets(): Promise<void> {
    const response = await this.findSupermarketsUseCase.execute();

    if (response.isLeft()) {
      return;
    }

    this.supermarkets = response.value.supermarkets;
  }

  onSuccessLoadProduct(product: Product): void {
    this.product = product;

    this.getFormControl('productId')?.setValue(product.formattedId);
    this.getFormControl('description')?.setValue(product.description);
    this.getFormControl('cost')?.setValue(product.cost);

    if (product.image) {
      const base64Data = ImageConverterUtils.bufferToBase64(product.image);
      this.productForm.controls.image.setValue(base64Data);
    }

    this.populateTableRows();
  }

  populateTableRows(): void {
    let rows: TableItemModel<SalePrice>[] = [];

    this.salesPrices.forEach((salePrice) => {
      rows.push({
        itens: [
          { label: salePrice.supermarket.fullDescription },
          { label: salePrice.formattedSalePrice },
        ],
        value: salePrice,
      });
    });

    this.salePriceRows = rows;
  }

  async submitProductForm(): Promise<void> {
    this.productForm.markAsTouched();

    if (!this.productForm.valid) {
      return;
    }

    if (this.product) {
      this.updateProduct();
      return;
    }

    this.createProduct();
  }

  async updateProduct(): Promise<void> {
    const response = await this.updateProductUseCase.execute({
      productId: this.product!.id,
      description: this.productForm.value.description!,
      cost: this.productForm.value.cost
        ? NumberMaskConverterUtils.convertMaskToNumber(
            this.productForm.value.cost,
          )
        : null,
      image: this.image,
    });

    if (response.isLeft()) {
      this.toastService.error(response.value.message);
      return;
    }

    this.toastService.success('Produto atualizado com sucesso!');
  }

  async createProduct(): Promise<void> {
    const response = await this.createProductUseCase.execute({
      description: this.productForm.value.description!,
      cost: this.productForm.value.cost
        ? NumberMaskConverterUtils.convertMaskToNumber(
            this.productForm.value.cost,
          )
        : null,
      image: this.image,
    });

    if (response.isLeft()) {
      this.toastService.error(response.value.message);
      return;
    }

    this.product = response.value.product;
    this.router.navigate(['/produto/cadastro'], {
      queryParams: {
        id: this.product.id,
      },
    });
    this.toastService.success('Produto cadastrado com sucesso!');
  }

  setFileData(event: Event): void {
    const eventTarget = event.target as HTMLInputElement | null;

    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      this.image = file;
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.productForm.controls.image.setValue(reader.result as string);
      });

      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.fileInput.nativeElement.value = '';
    this.productForm.controls.image.reset();
    this.image = undefined;
  }

  showDialogSalePrice(): void {
    const dialogRef = this.dialogService.open(CreateSalePriceComponent, {
      maxHeight: 400,
      data: {
        productId: this.productIdParam,
        supermarketOptions: this.supermarketsOptions,
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      }

      this.loadProduct();
    });
  }

  showDialogDeleteProduct(): void {
    const dialogRef = this.dialogService.open(DialogDeleteComponent, {
      data: {
        title: 'Atenção',
        description: `Deseja realmente excluir o produto ${this.product!.description}?`,
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) return;

      this.deleteProduct(this.product!.id);
    });
  }

  async deleteProduct(productId: number) {
    try {
      this.isLoading = true;
      const response = await this.deleteProductUseCase.execute({ productId });

      if (response.isLeft()) {
        this.toastService.error(response.value.message);
        return;
      }

      this.router.navigate(['/produto']);
      this.toastService.success('Produto excluido com sucesso.');
    } finally {
      this.isLoading = false;
    }
  }

  showDialogDeleteSalePrice(salePrice: SalePrice) {
    const dialogRef = this.dialogService.open(DialogDeleteComponent, {
      data: {
        title: 'Atenção',
        description: `Deseja realmente excluir o preço de venda para a loja ${salePrice.supermarket.description}?`,
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) return;

      this.deleteSalePrice(salePrice.supermarket.id);
    });
  }

  async deleteSalePrice(supermarketId: number) {
    try {
      this.isLoading = true;
      const response = await this.deleteSalePriceUseCase.execute({
        productId: this.productIdParam!,
        supermarketId,
      });

      if (response.isLeft()) {
        this.toastService.error(response.value.message);
        return;
      }
      this.toastService.success('Preço de venda excluido com sucesso.');
    } finally {
      this.isLoading = false;
      this.loadScreen();
    }
  }
}
