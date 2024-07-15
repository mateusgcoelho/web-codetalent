import { Inject, Injectable } from '@angular/core';
import { FilterFindProducts } from '../../domain/dtos/filter-find-products.dto';
import { InputAssignSalePriceProduct } from '../../domain/dtos/input-assign-sale-price.dto';
import { InputCreateProduct } from '../../domain/dtos/input-create-product.dto';
import { InputUpdateProduct } from '../../domain/dtos/input-update-product.dto';
import { InputUpdateSalePrice } from '../../domain/dtos/input-update-sale-price.dto';
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

  async updateSalePrice(input: InputUpdateSalePrice): Promise<void> {
    await this.httpClient.put(
      `/api/v1/products/${input.productId}/sale-price/${input.supermarketId}`,
      {
        salePrice: input.salePrice,
      },
    );
  }

  async deleteSalePrice(
    productId: number,
    supermarketId: number,
  ): Promise<void> {
    await this.httpClient.delete(
      `/api/v1/products/${productId}/sale-price/${supermarketId}`,
    );
  }

  async updateProduct(input: InputUpdateProduct): Promise<void> {
    console.log(input);
    await this.httpClient.put(`/api/v1/products/${input.productId}`, input, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.httpClient.delete(`/api/v1/products/${productId}`);
  }

  async assignSalePrice(input: InputAssignSalePriceProduct): Promise<void> {
    await this.httpClient.post(
      `/api/v1/products/${input.productId}/sale-price/${input.supermarketId}`,
      {
        salePrice: input.salePrice,
      },
    );
  }

  async getProduct(productId: number): Promise<OutputGetProduct> {
    const response = await this.httpClient.get(`/api/v1/products/${productId}`);

    return OutputGetProduct.fromJson(response.data);
  }

  async create(input: InputCreateProduct): Promise<Product> {
    const response = await this.httpClient.post('/api/v1/products', input, {
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

    if (filter.price) {
      queryParams.price = filter.price;
    }

    const response = await this.httpClient.get('/api/v1/products', {
      params: queryParams,
    });

    return OutputFindProducts.fromJson(response.data);
  }
}
