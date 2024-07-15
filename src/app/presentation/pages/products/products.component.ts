import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import DeleteProductUseCase from '../../../application/use-cases/delete-product.use-case';
import FindProductsUseCase from '../../../application/use-cases/find-products.use-case';
import OutputFindProducts from '../../../domain/dtos/output-find-products.dto';
import Product from '../../../domain/entities/product';
import ProductRepositoryApi from '../../../infra/repositories/product-api.repository';
import NumberMaskConverterUtils from '../../../shared/utils/number-mask-converter.utils';
import { DialogDeleteComponent } from '../../components/dialog-delete/dialog-delete.component';
import { InputComponent } from '../../components/input/input.component';
import { LoadingScreenComponent } from '../../components/loading-screen/loading-screen.component';

@Component({
  selector: 'page-products',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingScreenComponent,
    InputComponent,
    MatDialogModule,
  ],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryApi,
    },
    FindProductsUseCase,
    DeleteProductUseCase,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private readonly findProductsUseCase = inject(FindProductsUseCase);
  private readonly deleteProductUseCase = inject(DeleteProductUseCase);

  private readonly dialogService = inject(MatDialog);
  private readonly formBuilderService = inject(FormBuilder);
  private readonly toastService = inject(ToastrService);
  private readonly router = inject(Router);

  page: number = 1;
  perPage: number = 10;

  isLoading: boolean = false;

  outputFindProducts: OutputFindProducts = {
    total: 0,
    products: [],
    maxPage: 1,
  };

  get hasNextPage(): boolean {
    return this.page < this.outputFindProducts.maxPage;
  }

  get hasPreviousPage(): boolean {
    return this.page > 1 && this.page <= this.outputFindProducts.maxPage;
  }

  searchForm = this.formBuilderService.group({
    productId: [null],
    description: ['', Validators.maxLength(30)],
    cost: [null, Validators.maxLength(16)],
  });

  getFormControl(value: 'productId' | 'description' | 'cost'): FormControl {
    return this.searchForm.controls[value];
  }

  async ngOnInit(): Promise<void> {
    this.loadScreen();
  }

  nextPage(): void {
    this.page += 1;
    this.loadScreen();
  }

  previousPage(): void {
    this.page -= 1;
    this.loadScreen();
  }

  async loadScreen(): Promise<void> {
    try {
      this.isLoading = true;
      await this.findProducts();
      this.listenSearchForm();
    } finally {
      this.isLoading = false;
    }
  }

  async findProducts(): Promise<void> {
    const response = await this.findProductsUseCase.execute({
      productId: this.searchForm.value.productId,
      description: this.searchForm.value.description,
      cost: NumberMaskConverterUtils.convertMaskToNumber(
        this.searchForm.value.cost,
      ),
      page: this.page,
      perPage: this.perPage,
    });

    if (response.isLeft()) {
      this.toastService.error(response.value.message);
      return;
    }

    this.outputFindProducts = response.value;
  }

  resetPage(): void {
    this.page = 1;
  }

  searchFormSubscription?: Subscription;

  listenSearchForm(): void {
    if (this.searchFormSubscription) return;

    this.searchFormSubscription = this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        this.resetPage();
        this.findProducts();
      });
  }

  navigateToEditProduct(productId: number): void {
    this.router.navigate([`/produto/cadastro`], {
      queryParams: {
        id: productId,
      },
    });
  }

  showDialogDeleteProduct(product: Product): void {
    const dialogRef = this.dialogService.open(DialogDeleteComponent, {
      data: {
        title: 'Atenção',
        description: `Deseja realmente excluir o produto ${product.description}?`,
      },
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (!value) return;

      this.deleteProduct(product.id);
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

      this.toastService.success('Produto excluido com sucesso.');
    } finally {
      this.isLoading = false;
      this.loadScreen();
    }
  }
}
