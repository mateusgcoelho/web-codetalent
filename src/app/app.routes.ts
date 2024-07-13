import { Routes } from '@angular/router';
import { CreateProductComponent } from './presentation/pages/create-product/create-product.component';
import { ProductsComponent } from './presentation/pages/products/products.component';

export const routes: Routes = [
  {
    path: 'produto',
    children: [
      {
        path: '',
        component: ProductsComponent,
      },
      {
        path: 'cadastro',
        component: CreateProductComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'produto',
  },
];
