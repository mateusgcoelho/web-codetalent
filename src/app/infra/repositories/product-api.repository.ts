import { Inject, Injectable } from '@angular/core';
import { FilterFindProducts } from '../../domain/dtos/filter-find-products.dto';
import { InputAssignSalePriceProduct } from '../../domain/dtos/input-assign-sale-price.dto';
import { InputCreateProduct } from '../../domain/dtos/input-create-product.dto';
import { InputUpdateProduct } from '../../domain/dtos/input-update-product.dto';
import OutputFindProducts from '../../domain/dtos/output-find-products.dto';
import OutputGetProduct from '../../domain/dtos/output-get-product.dto';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import { IHttpClient } from '../gateway/interfaces/http-client.interface';

@Injectable()
export default class ProductRepositoryApi implements ProductRepository {
  constructor(
    @Inject('HttpClient')
    private readonly httpClient: IHttpClient,
  ) {}

  async deleteSalePrice(
    productId: number,
    supermarketId: number,
  ): Promise<void> {
    await this.httpClient.delete(
      `/products/${productId}/sale-price/${supermarketId}`,
    );
  }

  async update(input: InputUpdateProduct): Promise<void> {
    const formData = new FormData();

    if (input.description) {
      formData.append('description', input.description);
    }

    if (input.image) {
      formData.append('image', input.image!);
    }

    if (input.cost) {
      formData.append('cost', input.cost.toString());
    }

    await this.httpClient.put(`/products/${input.productId}`, input, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async delete(productId: number): Promise<void> {
    await this.httpClient.delete(`/products/${productId}`);
  }

  async assignSalePrice(input: InputAssignSalePriceProduct): Promise<void> {
    await this.httpClient.post(
      `/products/${input.productId}/sale-price/assign`,
      input,
    );
  }

  async getProduct(productId: number): Promise<OutputGetProduct> {
    const response = await this.httpClient.get(`/products/${productId}`);

    return OutputGetProduct.fromJson(response.data);
  }

  async create(input: InputCreateProduct): Promise<Product> {
    const formData = new FormData();

    formData.append('description', input.description);

    if (input.image) {
      formData.append('image', input.image!);
    }
    if (input.cost) {
      formData.append('cost', input.cost.toString());
    }

    const response = await this.httpClient.post('/products', input, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return Product.fromJson(response.data.product);
  }

  async find(filter: FilterFindProducts): Promise<OutputFindProducts> {
    let queryParams: FilterFindProducts = {
      page: filter.page,
      perPage: filter.perPage,
    };

    if (filter.productId) {
      queryParams.productId = filter.productId;
    }

    if (filter.cost) {
      queryParams.cost = filter.cost;
    }

    if (filter.description) {
      queryParams.description = filter.description;
    }

    const response = await this.httpClient.get('/products', {
      params: queryParams,
    });

    return OutputFindProducts.fromJson(response.data);
  }
}
